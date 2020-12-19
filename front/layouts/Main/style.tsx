import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const lds_ellipsis1  = keyframes`
	0% {
		transform: scale(0);
	}
	100% {
		transform: scale(1);
	}
}`;

const lds_ellipsis3  = keyframes`
	0% {
		transform: scale(1);
	}
	100% {
		transform: scale(0);
	}
`;

const lds_ellipsis2  = keyframes`
	0% {
		transform: translate(0, 0);
	}
	100% {
		transform: translate(24px, 0);
	}
}
`;

const appearUp = keyframes`
    0% {
        opacity: 0;
        display: none;
        transform: translateY(10%);
    }
    50% {
        opacity: 1;
        display: block;
    }
`;

const appearDown = keyframes`
    0% {
        opacity: 0;
        display: none;
        transform: translateY(-10%);
    }
    50% {
        opacity: 1;
        display: block;
    }
`;

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

export const BoardCard = styled.div`
    padding: 1rem;
    background: rgba(0, 0, 0, .5);
    border-radius: 10px;
    box-shadow: 0 0 4px 1px #aaa;
    cursor: pointer;
    margin: .5rem 1rem .5rem 0;
    transition: .3s;
    width: 120px;
    height: 12rem;

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

export const FormBox = styled.div`
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

    input, h2 {
        width: 100%;
        margin-bottom: 1rem;
    }

    p.info {
        font-size: 10px;
        color: #aaa;

    }

    input {
        padding: .5rem;
        background: #fafafa;
        border-radius: 5px;
        margin-top: .5rem;
    }

    input[type="checkbox"] {
        width: fit-content;
        margin: 0;
        margin-right: .5rem;
    }

    input[type="password"]:disabled {
        background: #bababa;
        color: #444;
    }

    & > div {
        display: none;

        &.next {
            animation: ${appearUp} .6s ease-in-out 1;
            display: block;
        }

        &.before {
            animation: ${appearDown} .6s ease-in-out 1;
            display: block;
        }

        &.created {
            display: block;
        }
    }

    p.warn {
        color: #ff4444;
        font-size: 10px;
    }

    @media screen and (max-width: 600px) {
        width: 300px;
    }
`;

export const PageButtonBox = styled.div`
    position: relative;
    display: flex !important;
    align-items: center;
    width: 100%;
    padding: .5rem 0;
    min-height: 2rem;

    & > div {
        cursor: pointer;
        transition: .3s;
        display: flex;
        align-items: center;

        &.next {
            position: absolute;
            right: 0;
        }

        img {
            transition: .3s;
            width: 0;
            height: 1rem;
        }

        &:hover {
            img {
                width: 1rem;
            }
        }
    }
`

export const LoadingBalls = styled.div`
	position: relative;
	margin: 0 auto;
	width: 80px;
	height: 80px;

	& > div {
		position: absolute;
		top: 33px;
		width: 13px !important;
		height: 13px !important;
		border-radius: 50%;
		background: #7990ff;
		animation-timing-function: cubic-bezier(0, 1, 1, 0);

		&:nth-of-type(1) {
			left: 8px;
			animation: ${lds_ellipsis1} 0.6s infinite;
		}
		&:nth-of-type(2) {
			left: 8px;
			animation: ${lds_ellipsis2} 0.6s infinite;
		}
		&:nth-of-type(3) {
			left: 32px;
			animation: ${lds_ellipsis2} 0.6s infinite;
		}
		&:nth-of-type(4) {
			left: 56px;
			animation: ${lds_ellipsis3} 0.6s infinite;
		}
	}
`;
