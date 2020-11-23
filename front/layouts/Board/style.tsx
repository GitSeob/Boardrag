import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { relative } from 'path';

type MenuPosition = {
    x: number,
    y: number,
    clicked: boolean,
    disp: boolean
}

type AddedComponentInfo = {
    width: number,
    height: number,
    x: number,
    y: number,
    color: string
}

type BoxPosition = {
    width: number,
    height: number,
    x: number,
    y: number,
}

type NoteProps = {
    width: number,
    height: number,
    x: number,
    y: number,
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

const leftToRight = keyframes`
    from {
        transform: translateX(-100%);
    }
    to {
        transform: translateX(0%);
    }
`

const enlarge = keyframes`
    0% {
        max-width: 0;
        max-height: 0;
    }
    50% {
        max-width: 50px;
        max-height: 50px;
    }
    100% {
        max-width: 100%;
        max-height: 100%;
    }
`

export const KonvaContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`

export const MenuBox = styled('div')<MenuPosition>`
    display: flex;
    flex-direction: column;
    position: absolute;
    background: rgba(0, 0, 0, .7);
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
    width: 140px;
    padding: 1rem;
    cursor: pointer;
    position: relative;

    &:hover {
        background: rgba(20, 20, 20, .5);
    }
`

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
`

export const TextComponent = styled('div')<BoxPosition>`
    position: absolute;
    border-radius: 5px;
    box-shadow: 0 0 4px 1px rgba(255, 255, 255, .3);
    background: rgba(0, 0, 0, .75);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 4;
    cursor: pointer;
    animation: ${enlarge} .3s ease-in-out 1;
    width: ${props => props.width};
    height: ${props => props.height};
    left: ${props => props.x};
    top: ${props => props.y};
    overflow: hidden;

    &:hover {
        box-shadow: 0 0 20px 3px rgba(255, 255, 255, .3);
        z-index: 5;
    }
`;

export const ImageComponent = styled('div')<BoxPosition>`
    position: absolute;
    border-radius: 5px;
    box-shadow: 0 0 4px 1px rgba(255, 255, 255, .3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 4;
    cursor: pointer;
    border-radius: 5px;
    overflow: hidden;
    width: ${props => props.width};
    height: ${props => props.height};
    left: ${props => props.x};
    top: ${props => props.y};
    animation: ${enlarge} .3s ease-in-out 1;

    & > img {
        width: 100%;
        height: 100%;
    }

    &:hover {
        box-shadow: 0 0 20px 3px rgba(255, 255, 255, .3);
        z-index: 5;
    }
`;

export const WarnMessage = styled.div`
    position: absolute;
    background: rgba(0, 0, 0, .6);
    z-index: 5;
    border-radius: 5px;
    color: #ff5555;
    font-weight: 500;
    font-size: 14px;
    padding: 1rem 2rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

export const NoteComponent = styled('div')<NoteProps>`
    position: absolute;
    border-radius: 5px;
    box-shadow: 0 0 4px 1px rgba(255, 255, 255, .3);
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 4;
    cursor: pointer;
    animation: ${enlarge} .3s ease-in-out 1;
    width: ${props => props.width};
    height: ${props => props.height};
    left: ${props => props.x};
    top: ${props => props.y};
    background: ${props => props.src ? 'url(\''+props.src+'\') no-repeat center' : 'rgba(0, 0, 0, .75)'};
    background-size: cover;
    padding: 5px;

    &:hover {
        box-shadow: 0 0 20px 3px rgba(255, 255, 255, .3);
        z-index: 5;
    }

    & > div {
        text-shadow: ${props => props.src ? '0 3px 10px #000' : 'none'};
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;

        &.head {
            white-space: nowrap;
            font-size: 20px;
            font-weight: 600;
        }
    }
`;

export const DetailBackground = styled('div')`
    width: 100%;
    height: 100%;
    z-index: 12;
    position: absolute;
    top: 0;
    left: 0;
    background: transparent;
    animation: ${padeIn} .5s ease-in-out 1;
`;

export const DetailWindow = styled('div')`
    position: absolute;
    min-height: 100vh;
    height: 100%;
    width: 400px;
    background: rgba(0, 0, 0, .7);
    top: 0;
    left: 0;
    z-index: 13;
    animation: ${leftToRight} .5s ease-in-out 1;
    color: #fff;
    overflow: auto;
`;

export const DetailBox = styled.div`
    position: relative;
    width: 100%;
    height: 100%;

    & > div {
        padding: 1rem;
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
    width: 400px;
    display: flex;
    overflow: hidden;
    height: 5rem;
    padding: 1rem .5rem;

    & > input {
        width: calc(400px - 3rem);
        padding: 5px;
        box-shadow: 0 0 4px 1px #ffffff;
        font-size: 14px;
    }

    & > div {
        width: 4rem;
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

        &:hover {
            box-shadow: 0 0 8px 1px #ffffff;
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
        border-radius: 20px;
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

        &:nth-child(1) {
            margin-right: .5rem;
        }
    }
`;
