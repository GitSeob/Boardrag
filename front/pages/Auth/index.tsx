import React, {FC} from 'react';
import useSWR from 'swr';
import qs from 'qs';
import fetcher from '@utils/fetcher';
import { LoginContainer, LoginButton } from '@pages/Auth/styles';
import { FT_UID, OAUTH, FRONT_URL } from '@config/config';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import LoadingCircle from '@components/LoadingCircle';

const Auth:FC = () => {
    const OAuthURL:string = `${OAUTH}/authorize?client_id=${FT_UID}&redirect_uri=${FRONT_URL}&response_type=code`
    const { data:userData, revalidate } = useSWR('/api/auth', fetcher);
    let query;
    if (location.search && userData === false)
    {
        query = qs.parse(location.search, {
            ignoreQueryPrefix: true // /about?details=true 같은 쿼리 주소의 '?'를 생략해주는 옵션입니다.
        });
        if (!userData && query.code)
        {
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
        return <Redirect to="/board/42board" />
    }

    if (userData)
        return <Redirect to="/board/42board" />

    return (
        <LoginContainer>
            <h1>LOGIN</h1>
            <LoginButton href={OAuthURL}>
                <img src="/public/42_logo.svg" />
                Login with 42API
            </LoginButton>
            { query?.error && <p>42API에서 전송한 코드 값 문제가 발생했습니다.</p>}
        </LoginContainer>
    );
}

export default Auth;
