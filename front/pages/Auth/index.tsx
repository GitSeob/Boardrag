import React from 'react';
import axios from 'axios';
import useSWR from 'swr';

import url from 'url';

import fetcher from '@utils/fetcher';
import { LoginContainer, LoginButton } from '@pages/Auth/styles';
import { FT_UID, OAUTH, FRONT_URL } from '@config/config';

const Auth = () => {
    const OAuthURL = `${OAUTH}/authorize?client_id=${FT_UID}&redirect_uri=${FRONT_URL}&response_type=code`
    const tokenValue = url.parse(window.location.href).query?.replace("code=", "");

    if (tokenValue)
        console.log(tokenValue);

    return (
        <LoginContainer>
            <h1>Login</h1>
            <LoginButton href={OAuthURL} target="_blank">
                <img src="/public/42_logo.svg" />
                Login with 42api
            </LoginButton>
        </LoginContainer>
    );
}

export default Auth;
