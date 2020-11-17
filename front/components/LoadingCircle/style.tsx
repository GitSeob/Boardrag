import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const spin = keyframes`
    from {
        transform: rotate(0);
    }
    to {
        transform: rotate(359deg);
    }
`;

export const LoadingCircleContainer = styled.div`
    width: 300px;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

export const LoadingCircleBox = styled.div`
    width: 150px;
    height: 150px;
    padding: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: rgb(63, 249, 200);
    background: linear-gradient(0deg, rgba(63, 249, 200, 0.1) 33%, rgba(63, 249, 220, 1) 100%);
    animation: ${spin} .8s linear 0s infinite;
`;

export const LoadingCircleCore = styled.div`
    width: 100%;
    height: 100%;
    background: #001c29;
    border-radius: 50%;
`;


