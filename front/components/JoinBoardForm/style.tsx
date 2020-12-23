import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const appearUp = keyframes`
    0% {
        opacity: 0;
        transform: translate(-50%, -40%);
    }
    50% {
        opacity: 1;
        transform: translate(-50%, -50%);
    }
`;

export const Box = styled.div`
    position: absolute;
    z-index: 21;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 1rem;
    width: 400px;
    border-radius: 10px;
    background: #000;
    box-shadow: 0 0 6px 1px #afafaf;
    animation: ${appearUp} .3s ease-in-out 1;

    p {
        font-size: 11px;
    }

    input {
        background: rgba(255, 255, 255, .95);
        border-radius: 1rem;
        color: #444;
        margin-top: .5rem;
        width: 100%;
        padding: .5rem 1rem;
    }

    input[type="password"] {
        padding: .3rem 1rem;
    }

    .description {
        max-height: 300px;
        overflow: auto;
        padding: .5rem;
        font-size: 11px;
        color: #ddd;
    }

    .row {
        border-top: 1px solid #666;
        margin-top: 1rem;
        padding-top: .5rem;
        width: 100%;
        display: flex;
        color: #ddd;
    }

    & > button {
        width: 100%;
        border-radius: 5px;
        padding: .5rem;
        background: linear-gradient(#a7dfaf, #879f8f);
        cursor: pointer;
        margin-top: 1rem;
    }
`;
