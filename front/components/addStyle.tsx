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
    board: string,
    initStates: () => void,
    toast: any
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

type ButtonBox = {
    size: number,
    right: number,
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
    z-index: 6;
`;

export const AddBox = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    background: #fff;
    box-shadow: 0 0 4px 1px rgba(255, 255, 255, .5);
    color: #000;
    width: 100%;
    animation: ${enlarge} .3s ease-in-out 1;
    height: 100%;

    &.note {
        padding: 0;
        border-radius: 5px;
    }
    & > img {
        width: 100%;
        height: 100%;
        border-radius: 5px;
    }
`;

export const SubmitButton = styled('div')<ButtonBox>`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    right: ${props => props.right};
    transform: translateX(100%);
    width: ${props => props.size - 10};
    height: ${props => props.size - 10};
    transform: translateX(${props => props.right === -5 ? '100%' : '0'});
    border-radius: 5px;
    background: #01babc;
    color: #fff;
    box-shadow: 0 0 4px 1px rgba(1, 186, 188, .7);
    cursor: pointer;
    padding: 2px;

    & > svg {
        height: 20px;
        fill: #fff;
    }

    @media screen and (max-width: 800px) {
        border-radius: 2px;
    }
`;

export const ImageInputButton = styled('div')<ButtonBox>`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    right: ${props => props.right};
    top: ${props => props.size };
    transform: translateX(${props => props.right === -5 ? '100%' : '0'});
    width: ${props => props.size - 10};
    height: ${props => props.size - 10};
    border-radius: 5px;
    cursor: pointer;
    background: #34568B;
    box-shadow: 0 0 4px 1px rgba(52, 86, 139, .7);
    padding: 2px;

    & > svg {
        fill: #fff;
        height: 20px;
    }

    @media screen and (max-width: 800px) {
        border-radius: 2px;
    }
`;

export const TextArea = styled.textarea`
    width: 100%;
    // height: 100%;
    max-height: 100%;
    overflow: auto;
    border: none;
    // border-radius: 0 0 5px 5px;
    border-radius: 5px;
    padding: 0;
    white-space: normal;
    text-align: center;
    resize: none;
    padding: 5px;
`;

export const ImageAddBox = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
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
    background: ${props => props.src ? 'url(\''+props.src+'\') no-repeat center' : '#fff'};
    background-size: cover;
    overflow: hidden;
    animation: ${enlarge} .3s ease-in-out 1;
    padding: 5px;
    border-radius: 5px;
    color: ${props => props.src ? '#fff' : '000'} !important;

    & > div {
        background: transparent;
        font-weight: 500;
    }

    textarea {
        font-size: 12px;
    }

    input[type="text"], textarea {
        color: ${props => props.src ? '#fff' : '#000'} !important;
        text-shadow: ${props => props.src ? '0 3px 10px #000' : 'none'};
    }

    @media screen and (max-width: 800px) {
        textarea {
            font-size: 10px;
        }
        input {
            font-size: 142x;
        }
    }

    @media screen and (max-width: 500px) {
        textarea {
            font-size: 8px;
        }

        input {
            font-size: 10px;
        }
    }
`;

export const InputBox = styled('div')<RectSize>`
    width: 100%;
    height: ${props => props.size};
    overflow: hidden;
    & > textarea {
        background: none;
    }
`;

export const InputArea = styled.input`
    width: 100%;
    height: 100%;
    padding: 5px;
    font-weight: 600;
    background: inherit !important;
    color: inherit !important;
`;

export const WarnBox = styled.div`
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .8);
    color: red;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
`;
