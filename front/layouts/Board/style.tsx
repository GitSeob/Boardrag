import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { relative } from 'path';

type MenuPosition = {
    x: number,
    y: number,
    clicked: boolean
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

export const KonvaContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
`

export const MenuBox = styled('div')<MenuPosition>`
        position: absolute;
        background: rgba(0, 0, 0, .7);
        color: #fff;
        border-radius: 5px;
        box-shadow: 0 0 8px 1px rgb(0, 0, 0);
        cursor: pointer;
        display: ${props => props.clicked ? 'block' : 'none'};
        top: ${ props => props.y };
        left: ${ props => props.x };
        animation: ${ props => props.clicked ? apperMenu : disapperMenu } .3s ease-in-out 1;
        z-index: 3;
)`

export const BoardFooter = styled.div`
    width: 100%;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, .6);
    font-weight: 400;
    font-size: 12px;
    text-align: center;
    display: flex;
    height: -webkit-fill-available;
`
