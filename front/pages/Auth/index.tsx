import React, {FC} from 'react';
import useSWR from 'swr';
import url from 'url';
import fetcher from '@utils/fetcher';
import { LoginContainer, LoginButton } from '@pages/Auth/styles';
import { FT_UID, OAUTH, FRONT_URL } from '@config/config';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import LoadingCircle from '@components/LoadingCircle';

const Auth:FC = () => {
    const OAuthURL:string = `${OAUTH}/authorize?client_id=${FT_UID}&redirect_uri=${FRONT_URL}&response_type=code`
    const codeValue = url.parse(window.location.href).query?.replace("code=", "");
    const { data:userData, revalidate } = useSWR('/api/auth', fetcher);

    if (userData) {
        return <Redirect to="/board/42board" />
    }

    if (!userData && document && document.cookie) {
        return (
            <LoadingCircle />
        );
    }

    if (!userData && codeValue)
    {
        const data = axios.post(`/api/auth`, {
            codeValue: codeValue,
            trashValue: '123',
        }, {
            withCredentials: true
        }).then(res => {
            revalidate();
            return res.data;
        }).catch(e => {
            console.error(e.response.data);
        });
    }

    if (userData)
        return <Redirect to="/board" />

    if (userData || codeValue)
        return (
            <LoadingCircle />
        );

    return (
        <LoginContainer>
            <h1>LOGIN</h1>
            <LoginButton href={OAuthURL}>
                <img src="/public/42_logo.svg" />
                Login with 42API
            </LoginButton>
        </LoginContainer>
    );
}

export default Auth;
