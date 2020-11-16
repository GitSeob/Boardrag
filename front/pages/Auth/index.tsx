import React from 'react';
import useSWR from 'swr';

import url from 'url';

import fetcher from '@utils/fetcher';
import { LoginContainer, LoginButton } from '@pages/Auth/styles';
import { FT_UID, OAUTH, FRONT_URL } from '@config/config';
import axios from 'axios';

const Auth = () => {
    const OAuthURL = `${OAUTH}/authorize?client_id=${FT_UID}&redirect_uri=${FRONT_URL}&response_type=code`
    const codeValue = url.parse(window.location.href).query?.replace("code=", "");

    // const { data:userData } = useSWR('/api/auth', fetcher);

    if (codeValue)
    {
        const data = axios.post(`/api/auth`, {
            codeValue: codeValue,
            trashValue: '123',
        }, {
            withCredentials: true
        }).then(res => {
            console.log(res.data);
            return res.data;
        }).catch(e => {
            console.log(e);
        });
    }

    return (
        <LoginContainer>
            <h1>Login</h1>
            <LoginButton href={OAuthURL}>
                <img src="/public/42_logo.svg" />
                Login with 42api
            </LoginButton>
        </LoginContainer>
    );
}

export default Auth;
