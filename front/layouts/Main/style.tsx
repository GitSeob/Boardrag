import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

type BC = {
    url: string
}

export const Menu = styled.div`
    position: fixed;
    height: 100%;
    width: 200px;
    background: rgba(0, 0, 0, .5);

    @media screen and (max-width: 600px) {
        height: 2rem;
        display: flex;
        box-shadow: 0 0 4px 1px #888;
        width: 100%;
    }
`;

export const RelBox = styled.div`
    position: relative;
    width: 100%;
    height: 100%;

    & > div {
        padding: 1.5rem;
        width: 100%;
        display: flex;
        align-items: center;
        height: 2rem;
        cursor: pointer;
        font-size: 14px;

        &:hover {
            background: #222;
        }

        img {
            height: 1rem;
            margin-right: .3rem;
        }
    }

    .logout {
        position: absolute;
        bottom: 0;
    }

    .logo {
        padding: 2rem 1.5rem;
        img { height: 2rem; }
        &:hover {
            background: none;
        }
    }

    @media screen and (max-width: 600px) {
        display: flex;

        & > div {
            width: fit-content;
            padding: 1rem;
        }

        .logout {
            position: relative;
        }

        .logo {
            padding: 1rem;
            h2 { font-size: 16px; }
            img { height: 1.5rem; }
        }
    }
`;

export const Container = styled.div`
    margin-left: 200px;
    width: calc(100% - 200px);
    padding: 2rem;

    @media screen and (max-width: 600px) {
        margin-left: 0;
        margin-top: 2rem;
        width: 100%;
    }
`;

export const BCHeader = styled.div`
    position: relative;
    width: 100%;
`;

export const SearchForm = styled.form`
    position: absolute;
    display: flex;
    align-item: center;
    justify-content: center;
    background: rgba(255, 255, 255, .2);
    border-radius: 1rem;
    height: 1.5rem;
    padding: .25rem .5rem;
    right: 0;
    top: 0;
    font-size: 10px;

    img {
        height: 1rem;
        margin-right: .3rem;
    }

    input {
        background: transparent;
        padding: .1rem .5rem;
        color: #fff;
        width: 200px;
    }
`;

export const BoardContainer = styled.div`
    position: relative;
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    margin: 1rem 0;
    min-height: 10rem;

    & > .guide {
        height: 100%;
        display: flex;
        text-align: center;
        font-size: 12px;
        width: 100%;
        color: #555;
    }
`;

export const BoardCard = styled('div')<BC>`
    padding: 1rem;
    background: rgba(0, 0, 0, .5);
    border-radius: 10px;
    box-shadow: 0 0 4px 1px #aaa;
    cursor: pointer;
    margin: .5rem 1rem .5rem 0;
    transition: .3s;
    width: 120px;
    height: 12rem;
    overflow: hidden;
    position: relative;

    &::before {
        width: 100%;
        height: 100%;
        position: absolute;
        content: "";
        top: 0;
        left: 0;
        background: url(${props => props.url});
        background-size: cover;
        background-position: center;
        z-index: -1;
    }

    &:hover {
        box-shadow: 0 0 8px 1px #aaa;
        transform: scale(1.05);
    }

    .description {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 6;
        -webkit-box-orient: vertical;
        word-wrap:break-word;
        line-height: 1.2rem;
        height: 7.2rem;
        color: #999;
        margin: .5rem 0;
    }

    .iconBox {
        display: flex;
        color: #888;
        position: relative;

        & > img {
            height: .8rem;
            color: #ff0000;

            &.lock {
                position: absolute;
                right: 0;
            }
        }
    }
`;

export const DarkBackground = styled.div`
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: 20;
    background: rgba(0, 0, 0, .3);
    display: flex;
    align-items: center;
    justify-content: center;
`;
