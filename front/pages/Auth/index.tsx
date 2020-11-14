import React from 'react';
import axios from 'axios';
import useSWR from 'swr';

import url from 'url';

import fetcher from '@utils/fetcher';
import { LoginContainer, LoginButton } from '@pages/Auth/styles';

const Auth = () => {
    // const OAuthURL = process.env.NODE_ENV === 'production' ?
    //     `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.DEV_UID}&redirect_uri=${process.env.DEV_URL}&response_type=code` :
    //     `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.PRODUCT_UID}&redirect_uri=${process.env.PRODUCT_URL}&response_type=code`;

    // const tokenValue = url.parse(window.location.href).query?.replace("code=", "");

    console.log(process.env.DEV_UID);

    return (
        <LoginContainer>
            <h1>Login</h1>
            <LoginButton href={"naver.com"} target="_blank">
                <img src="/public/42_logo.svg" />
                Login with 42api
            </LoginButton>
        </LoginContainer>
    );
}

export default Auth;
