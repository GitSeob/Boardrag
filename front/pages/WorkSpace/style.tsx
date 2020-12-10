import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

type MenuPosition = {
    x: number,
    y: number,
    clicked: boolean,
    disp: boolean
}

type BoxPosition = {
    width: number,
    height: number,
    x: number,
    y: number,
}

type NoteProps = {
    src: string
}

const apperMenu = keyframes`
    from {
        max-width: 0;
        max-height: 0;
    }
    to {
        max-width: 200px;
        max-height: 200px;
    }
`

const disapperMenu = keyframes`
    from {
        max-width: 200px;
        max-height: 200px;
    }
    to {
        max-width: 0px;
        max-height: 0px
    }
`

const padeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`

const padeLeftToRight = keyframes`
    from {
        opacity: 0;
        transform: translateX(-10%);
    }
    to {
        opacity: 1;
        transform: translateX(0%);
    }
`

const enlarge = keyframes`
    0% {
        width: 0%;
        height: 0%;
    }
    50% {
        width: 30%;
        height: 30%;
    }
    100% {
        width: 100%;
        height: 100%;
    }
`

export const KonvaContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    transition: .3s;
`;

export const WarnMessage = styled.div`
    position: absolute;
    background: rgba(0, 0, 0, .6);
    z-index: 50;
    border-radius: 5px;
    color: #ff5555;
    font-weight: 500;
    font-size: 14px;
    padding: 1rem 2rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

export const DetailBackground = styled('div')`
    width: 100%;
    height: 100%;
    z-index: 12;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .4);
    animation: ${padeIn} .5s ease-in-out 1;
`;


export const DetailWindow = styled('div')`
    position: fixed;
    min-height: 100vh;
    height: 100%;
    width: 400px;
    background: rgba(0, 0, 0, .85);
    top: 0;
    left: 0;
    z-index: 13;
    transition: .3s;
    color: #fff;
`;

export const DetailBox = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    padding: 1rem;
    padding-bottom: 4rem;
    overflow: auto;

    & > div {
        margin: 1rem 0;
    }
`;

export const TopFixContent = styled('div')`
    position: relative;
    width: 100%;
    overflow: hidden;
`;

export const BottomFixContent = styled('div')`
    position: fixed;
    bottom: 0;
    display: flex;
    overflow: hidden;
    height: 4rem;
    background: #000;
    padding: 1rem .5rem;

    & > input {
        width: calc(400px - 4rem);
        padding: 5px;
        border-radius: 5px;
        box-shadow: 0 0 4px 1px #ffffff;
        font-size: 14px;
        margin-right: .5rem;
    }

    & > div {
        width: 2rem;
        background: #radial-gradient(ellipse at bottom, #002534 0%, #090a0f 100%) no-repeat;
        cursor: pointer;
        color: #fff;
        transition: .3s;
        display: flex;
        justify-content: center;
        align-items: center;
        svg {
            fill: #fff;
        }
    }
`;

export const UserInfo = styled.div`
    width: 100%;
    height: 6rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    & > img {
        width: 5rem;
        height: 5rem;
        border-radius: 100%;
        margin-right: 1rem;
    }

    & > p {
        font-size: 18px;
        font-weight: 700;
        width: 100%;
    }
`;

export const UDButtonBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    & > button {
        background: transparent !important;
        cursor: pointer;
    }
`;


export const MomentBox = styled.div`
    margin-top: .5rem;
    margin-bottom: 1rem;

    & > div {
        font-size: 12px;
        display: flex;
        align-items: center;
        color: #d5d5d5;

        p {
            margin-left: .5rem;
            font-size: 14px;
            color: #fff;
        }
    }
`;

export const DetailContentBox = styled.div`
    border-radius: 5px;
    background: #fff;
    color: #000;
    margin-top: .5rem;
    overflow: hidden;

    & > pre {
        padding: 1rem .5rem;
        white-space: break-spaces;
    }

    & > img {
        width: 100%;
    }

    & > h2 {
        margin: 0 .5rem;
        padding: 1rem 0 .5rem 0;
        border-bottom: 1px solid #ddd;
    }

    & > div {
        padding: 1rem;
    }
`;


export const EditArea = styled.div`
    position: relative;
    padding: 0 !important;
    overflow: hidden;

    & > textarea {
        width: calc(100% - 50px);
        resize: none;
        padding: .5rem;
    }

    & > input {
        width: calc(100% - 50px);
        font-size: 24px;
        padding: .5rem;
        font-weight: 600;
        margin-bottom: 1rem;
    }
`;

export const EditButtonBox = styled.div`
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    // border-radius: 0 5px 5px 0;
    overflow: hidden;

    .button {
        height: 50%;
        background: #777;
        color: #fff;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        &.edit {
            background: #01babc;
            color: #000;
        }
    }
`;

export const ImageBox = styled.div`
    position: relative;
    width: calc(100% - 50px);
    height: fit-content;

    & > img {
        width: 100%;
    }

    .temp {
        width: 100%;
        height: 6rem;
        background: #eee;
    }
`;


export const CommentBox = styled.div`
`;

export const Comment = styled.div`
    display: flex;
    min-height: 3rem;
    margin-bottom: .5rem;
    animation: ${padeLeftToRight} .5s ease-in-out 1;

    & > img {
        width: 3rem;
        height: 3rem;
        border-radius: 100%;
        margin-right: 1rem;
    }

    .content {
        width: 100%;
        & > div
        {
            display: flex;
            align-items: flex-end;
            width: 100%;

            div {
                background: #f8f8f8;
                border-radius: 5px;
                color: #000;
                padding: .5rem;
                min-height: 100%;
                width: 100%;
                position: relative;

                &::before {
                    content: "";
                    transform: skewX(30deg);
                    width: 15px;
                    left: 0;
                    height: 15px;
                    background: #f8f8f8;
                    position: absolute;
                    top: 0;
                    z-index: -1;
                }
            }

            & > p {
                color: #777;
                height: fit-content;
                font-size: 10px;
                margin-left: .3rem;
                width: 8rem;
            }
        }
    }
`;

export const MenuBox = styled('div')<MenuPosition>`
    display: flex;
    flex-direction: column;
    position: absolute;
    background: rgba(0, 0, 0, .85);
    display: ${props => props.disp ? 'block' : 'none'};
    overflow: hidden;
    color: #efefef;
    border-radius: 5px;
    box-shadow: 0 0 8px 1px rgb(0, 0, 0);
    max-width: ${props => props.clicked ? '200px' : '0px'};
    max-height: ${props => props.clicked ? '200px' : '0px'};
    top: ${ props => props.y };
    left: ${ props => props.x };
    animation: ${ props => props.clicked ? apperMenu : disapperMenu } .3s ease-in-out 1;
    z-index: 10;
)`

export const MenuAttr = styled.div`
    width: 120px;
    padding: 1rem;
    cursor: pointer;
    position: relative;

    &:hover {
        background: rgba(20, 20, 20, .5);
    }

    @media screen and (max-width: 800px) {
        font-size: 12px;
        width: 100px;
        padding: .5rem;
    }
    @media screen and (max-width: 500px) {
        font-size: 10px;
        width: 80px;
        padding: .3rem;
    }
`;

export const ComponentBox = styled('div')<BoxPosition>`
    position: absolute;
    width: ${props => props.width};
    height: ${props => props.height};
    left: ${props => props.x};
    top: ${props => props.y};
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    z-index: 4;
    padding: 2px;
`;

export const AltBox = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .8);
    display: none;
    justify-content: center;
    align-items: center;
    color: #fff;

    & > div {
        display: flex;
    }
`;

export const TextComponent = styled('pre')`
    position: relative;
    border-radius: 5px;
    box-shadow: 0 0 4px 1px rgba(255, 255, 255, .3);
    background: rgba(0, 0, 0, .75);
    color: #fff;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    animation: ${enlarge} .3s ease-in-out 1;
    overflow: hidden;
    padding: 5px;
    white-space: break-spaces;

    &:hover {
        box-shadow: 0 0 20px 3px rgba(255, 255, 255, .3);
        z-index: 5;

        .alt {
            display: flex;
        }
    }

    @media screen and (max-width: 800px) {
        font-size: 10px;
    }

    @media screen and (max-width: 500px) {
        font-size: 8px;
    }
`;

export const ImageComponent = styled('div')`
    position: relative;
    border-radius: 5px;
    box-shadow: 0 0 4px 1px rgba(255, 255, 255, .3);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 5px;
    overflow: hidden;
    width: 100%;
    height: 100%;
    animation: ${enlarge} .3s ease-in-out 1;
    @media screen and (max-width: 800px) {
        font-size: 10px;
    }
    @media screen and (max-width: 500px) {
        font-size: 8px;
    }
    & > img {
        width: 100%;
        height: 100%;
    }
    &:hover {
        box-shadow: 0 0 20px 3px rgba(255, 255, 255, .3);
        z-index: 5;
        .alt {
            display: flex;
        }
    }
`;

export const NoteComponent = styled('div')<NoteProps>`
    position: relative;
    border-radius: 5px;
    box-shadow: 0 0 4px 1px rgba(255, 255, 255, .3);
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    animation: ${enlarge} .3s ease-in-out 1;
    width: 100%;
    height: 100%;
    background: ${props => props.src ? 'url(\''+props.src+'\') no-repeat center' : 'rgba(0, 0, 0, .75)'};
    background-size: cover;
    overflow: hidden;
    padding: 5px;
    &:hover {
        box-shadow: 0 0 20px 3px rgba(255, 255, 255, .3);
        z-index: 5;
        .alt {
            display: flex;
        }
    }
    .head {
        text-shadow: ${props => props.src ? '0 1px 5px #000' : 'none'};
        width: 100%;
        height: auto;
        font-size: 20px;
        font-weight: 600;
        padding-bottom: .5rem;
        white-space: break-spaces;
    }
    @media screen and (max-width: 800px) {
        font-size: 10px;
        div.head {
            font-size: 14px;
        }
    }
    @media screen and (max-width: 500px) {
        font-size: 8px;
        div.head {
            font-size: 12px;
        }
    }
    & > pre {
        text-shadow: ${props => props.src ? '0 1px 5px #000' : 'none'};
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 5px;
        white-space: break-spaces;
    }
`;


export const OnModeAlt = styled.div`
    position: relative;
    background: #000;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 21;
    color: #fff;
    padding: .5rem; 1rem;
    border-radius: 3px;
    line-height: 1.2;
    border: 1px solid #999;
    transition: .3s;
    cursor: pointer;
    width: fit-content;
    margin-bottom: 1rem;

    &.resize {
        flex-direction: column;
    }

    & > img {
        background: transparent;
    }

    & > span {
        width: 0;
        height: 1rem;
        overflow: hidden;
    }

    &:hover {
        & > img { margin-left: .5rem; }
        & > span {
            width: fit-content;
        }
    }
`;

export const ResizeRemote = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    & > span {
        width: 4rem;
    }

    & > button {
        width: 1.5rem;
        height: 1.5rem;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 600;
        background: transparent;
        cursor: pointer
    }

    button.decrease img{
        transform: rotate(180deg);
    }

    & > div {
        background: rgb(32, 178, 170);
        box-shadow: 0 0 3px 1px rgb(32, 178, 170);
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 1rem;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 600;
    }

    &:nth-of-type(2) {
        margin-top: .5rem;
    }
`;

export const BoardFooter = styled.div`
    width: 100%;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, .6);
    font-weight: 400;
    font-size: 12px;
    text-align: center;
    display: flex;
    padding: 1rem;
    height: 100%;
    background: rgba(0, 0, 0, .1);
`;


export const EditImageInput = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50%;
    padding: .5rem 1rem;
    background: rgba(0, 0, 0, 0.4);
    color: #fff;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2rem;
    cursor: pointer;

    & > svg {
        fill: #fff;
        height: 2rem;
    }
`;
