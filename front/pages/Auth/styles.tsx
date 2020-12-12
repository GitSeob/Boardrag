import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const appearUp = keyframes`
    from {
        transform: translate(-50%, -30%);
        opacity: 0;
    }
    to {
        transform: translate(-50%, -50%);
        opacity: 1;
    }
`;

export const LoginContainer = styled.div`
    background: rgba(0, 0, 0, .3);
    padding: 1rem;
    width: fit-content;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: ${appearUp} .5s ease-in-out 1;
    color: #fff;
    min-width: 300px;

    & > h1 {
        text-align: center;
        margin-bottom: 1rem;
    }

    & > p {
        color: #ff7777;
        font-size: 10px;
        margin-top: .5rem;
        text-align: center;
    }
`;

export const LoginButton = styled.a`
    background: #090a0f;
    color: #fff;
    padding: .5rem 3.5rem;
    display: inline-flex;
    position: relative;
    cursor: pointer;
    width: 100%;
    align-items: center;
    justify-content: center;
    font-weight: 500;

    &:hover {
        box-shadow: 0 0 4px 1px rgba(255, 255, 255, 0.3);
    }

    & > img {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        height: 1.5rem;
    }
`
