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
    offset: offset,
    setSend: (send: boolean) => void
}

export interface SwitchProps {
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

type RectSize = {
    size: number
}

type ImageProps = {
    src: string | null,
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

export const AddContainer = styled('div')<Container>`
    position: absolute;
    z-index: 4;
    display: flex;
    align-items: center;
    justify-content: center;
    top: ${props => props.y + 5};
    left: ${props => props.x + 5};
    width: ${props => props.width - 10};
    height: ${props => props.height - 10};
    z-index: 3;
`;

export const AddBox = styled.div`
    position: relative;
    padding: 5px;
    border-radius: 5px;
    background: rgba(255, 255, 255, .6);
    box-shadow: 0 0 4px 1px rgba(255, 255, 255, .5);
    color: #000;
    width: 100%;
    animation: ${enlarge} .3s ease-in-out 1;
    height: 100%;
`;

export const SubmitButton = styled('div')<RectSize>`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    right: -10px;
    transform: translateX(100%);
    width: ${props => props.size};
    height: ${props => props.size};
    border-radius: 5px;
    background: #01babc;
    color: #fff;
    box-shadow: 0 0 4px 1px rgba(1, 186, 188, .7);
    cursor: pointer;

    & > svg {
        height: 20px;
        fill: #fff;
    }
`;

export const ImageInputButton = styled('div')<RectSize>`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    right: -10px;
    top: ${props => props.size + 10};
    transform: translateX(100%);
    width: ${props => props.size};
    height: ${props => props.size};
    border-radius: 5px;
    cursor: pointer;
    background: #34568B;
    box-shadow: 0 0 4px 1px rgba(52, 86, 139, .7);

    & > svg {
        fill: #fff;
        height: 20px;
    }
`

export const TextArea = styled.textarea`
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 5px;
    background: rgba(255, 255, 255, .6);
    resize: none;
    padding: 5px;
`;

export const ImageAddBox = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 500;
    overflow: hidden;
    text-align: center;
    word-break: keep-all;

    & > img {
        width: 100%;
        height: 100%;
    }
`;

export const NoteAddBox = styled('div')<ImageProps>`
    width: 100%;
    heigth: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: ${props => props.src ? props.src : 'transparent'};
    overflow: hidden;
    animation: ${enlarge} .3s ease-in-out 1;

    & > div {
        background: transparent;
        color: ${props => props.src ? '#fff' : '000'};
        font-weight: 500;
    }
`;

export const InputBox = styled('div')<RectSize>`
    width: 100%;
    height: ${props => props.size};
    overflow: hidden;
`;

export const InputArea = styled.input`
    width: 100%;
    height: 100%;
    padding: 5px;
    font-size: 20px;
    font-weight: 600;
    background: inherit !important;
`