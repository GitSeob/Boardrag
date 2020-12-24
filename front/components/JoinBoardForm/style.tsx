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
    overflow: hidden;
    transition: .5s;

    & > div {
        position: relative;
        width: 100%;
        height: 100%;

        p {
            font-size: 11px;
        }

        .description {
            margin-top: .2rem;
            border-left: 2px solid #777;
            overflow: auto;
            padding: .5rem;
            font-size: 11px;
            color: #ddd;
            max-height: 300px;
        }

        div {
            margin-bottom: .5rem;
        }
    }
`;

export const FLEXDIV = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

export const PageButton = styled.button`
    width: 100%;
    border-radius: 5px;
    padding: .5rem;
    margin-top: 1rem;
    border: 1px solid #444;
    transition: .3s;
    background: #111;
    color: #fff;

    &:hover {
        background: #444;
    }
`;

export const Input = styled.input`
    padding: .5rem;
    width: 100%;
    border-radius: 1rem;
    font-size: 12px;
    margin: .5rem auto;
    text-align: center;

    &.nickname {
        width: 50%;
    }
`;
