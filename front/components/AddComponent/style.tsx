import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

export type offset = {
    width: number,
    height: number,
    x: number,
    y: number
};

export interface boxProps {
    x: number,
    y: number,
    width: number,
    height: number,
    category: number,
    offset: offset
}

type Container = {
    width: number,
    height: number,
    x: number,
    y: number,
}

type Box = {
    width: number,
    height: number,
}

const enlarge = keyframes`
    0% {
        width: 0;
        height: 0;
    }
    30% {
        width: 10%;
        height: 10%;
    }
    100% {
        width: 100%;
        height: 100%;
    }
`

export const AddComponent = styled('div')<Container>`
    position: absolute;
    z-index: 4;
    display: flex;
    align-items: center;
    justify-content: center;
    top: ${props => props.y};
    left: ${props => props.x};
    width: ${props => props.width};
    height: ${props => props.height};
`;

export const AddBox = styled('div')`
    position: absolute;
    padding: 5px;
    border-radius: 5px;
    background: rgba(255, 255, 255, .6);
    box-shadow: 0 0 4px 1px rgba(255, 255, 255, .5);
    color: #000;
    animation: ${enlarge} .3s ease-in-out 1;
    width: 100%;
    height: 100%;
`;
