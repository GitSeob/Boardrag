import React, {FC} from 'react';
import useSWR from 'swr';
import qs from 'qs';
import fetcher from '@utils/fetcher';
import { LoginContainer, LoginButton } from '@pages/Auth/styles';
import { GOOGLE_CID, REDIR_URI } from '@config/config';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import LoadingCircle from '@components/LoadingCircle';

const Auth:FC = () => {
	const OAuthURL:string = `https://accounts.google.com/o/oauth2/auth?client_id=${GOOGLE_CID}&redirect_uri=${REDIR_URI}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email&approval_prompt=force&access_type=offline`;
	const { data:userData, revalidate } = useSWR('/api/auth', fetcher);
	const query = qs.parse(location.search, {
		ignoreQueryPrefix: true // /about?details=true 같은 쿼리 주소의 '?'를 생략해주는 옵션입니다.
	});

	if (location.search && userData === false)
	{
		if (!userData && query.code)
		{
			console.log(query.code);
			axios.post(`/api/auth`, {
					codeValue: query.code,
					trashValue: '123',
			}, {
				withCredentials: true
			}).then(res => {
				revalidate();
				return res.data;
			}).catch(e => {
				console.error(e);
				location.href = "/auth?error=codeValue";
			})
			return <LoadingCircle />
		}
	}

	if (userData) {
		if (query.prev)
			return <Redirect to={`${query.prev}`} />
		else
			return <Redirect to="/main" />
	}

	return (
		<LoginContainer>
			<h1>BOXLOT</h1>
			<LoginButton href={OAuthURL} className="google">
				<img src="/public/btn_google_signin_light_normal_web@2x.png" />
			</LoginButton>
			{ query?.error && <p>42API에서 전송한 코드 값 문제가 발생했습니다.</p>}
		</LoginContainer>
	);
}

export default Auth;
