import styled from '@emotion/styled';
import {keyframes} from '@emotion/react';

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

const padeRightToLeft = keyframes`
    from {
        opacity: 0;
        transform: translateX(10%);
    }
    to {
        opacity: 1;
        transform: translateX(0%);
    }
`


export const ChatRoom = styled.div`
    height: calc(80% - 98px);
`;

export const ChatForm = styled.form`
    width: 100%;
    display: flex;
    align-items: center;
    padding: 3px 10px;

    & > input {
        width: 100%;
        padding: .5rem;
        font-size: 14px;
        border-radius: 5px;
    }
`;

export const Chat = styled.li`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: .5rem;
    margin-left: 1rem;
    animation: ${padeLeftToRight} .3s ease-in-out 1;

    & > div{
        display: flex;
        align-items: flex-end;

        div {
            background: #fafafa;
            padding: .5rem;
            border-radius: 5px;
            color: #111;
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
            font-size: 8px;
            color: #777;
            margin-left: 5px;
            word-break: keep-all;
        }
    }

    &.myChat {
        align-items: flex-end;
        margin-right: 1rem;
        margin-left: 0;
        animation: ${padeRightToLeft} .3s ease-in-out 1;

        & > div {
            flex-direction: row-reverse;

            div {
                background: #c7efdf;

                &::before {
                    display: none;
                }

                &::after {
                    content: "";
                    transform: skewX(-30deg);
                    width: 15px;
                    right: 0;
                    height: 15px;
                    background: #c7efdf;
                    position: absolute;
                    top: 0;
                    z-index: -1;
                }
            }

            & > p {
                margin-right: 5px;
            }
        }
    }
`;

export const StickyHeader = styled.div`
    display: flex;
    justify-content: center;
    flex: 1;
    width: 100%;
    position: sticky;
    top: 14px;
    font-weight: bold;
    font-size: 8px;
    height: 20px;
    line-height: 27px;
    padding: 0 16px;
    --saf-0: rgba(var(--sk_foreground_low, 29, 28, 29), 0.13);
    box-shadow: 0 0 0 1px var(--saf-0), 0 1px 3px 0 rgba(0, 0, 0, 0.08);
    border-radius: 24px;
`;
