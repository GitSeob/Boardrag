import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { relative } from 'path';

type MenuPosition = {
    x: number,
    y: number,
    clicked: boolean,
    disp: boolean
}

type ComponentInfo = {
    width: number,
    height: number,
    x: number,
    y: number,
}

type AddedComponentInfo = {
    width: number,
    height: number,
    x: number,
    y: number,
    color: string
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
    z-index: 3;
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
    // margin: auto;
    background: rgba(0, 0, 0, .1);
`

export const AddComponent = styled('div')`
    position: absolute;
    border-radius: 5px;
    background: rgba(255, 255, 255, .6);
    box-shadow: 0 0 4px 1px rgba(255, 255, 255, .5);
    color: #000;
    padding: 5px;
    z-index: 4;
`;

export const TextComponent = styled('div')`
    position: absolute;
    border-radius: 5px;
    box-shadow: 0 0 4px 1px rgba(255, 255, 255, .5);
    color: #000;
    padding: 5px;
    z-index: 4;
`;
