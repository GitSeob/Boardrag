import React from 'react';
import useSWR from 'swr';
import qs from 'qs';
import fetcher from '@utils/fetcher';
import { LoginContainer, LoginButton } from '@pages/Auth/styles';
import { googleOauth } from '@config/config';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import LoadingCircle from '@components/LoadingCircle';

const Auth = () => {
	const { data: userData, revalidate } = useSWR('/api/auth', fetcher);
	const [error, setError] = React.useState('');

	const query = qs.parse(location.search, {
		ignoreQueryPrefix: true,
	});

	if (location.search && userData === false && !error) {
		if (!userData && query.code) {
			axios
				.post(
					`/api/auth`,
					{
						codeValue: query.code,
						trashValue: '123',
					},
					{
						withCredentials: true,
					},
				)
				.then((res) => {
					revalidate();
					return res.data;
				})
				.catch((e) => {
					setError(e.response.data.reason);
				});
			return <LoadingCircle />;
		}
	}

	if (userData) {
		if (query.prev) return <Redirect to={`${query.prev}`} />;
		else return <Redirect to="/main" />;
	}

	return (
		<LoginContainer>
			<h1>BOARDRAG</h1>
			<LoginButton href={googleOauth} className="google">
				<img src="/public/btn_google_signin_light_normal_web@2x.png" />
			</LoginButton>
			{error && <p>{error}</p>}
		</LoginContainer>
	);
};

export default Auth;
