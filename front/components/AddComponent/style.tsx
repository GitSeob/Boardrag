import styled from '@emotion/styled';

export type boxProps = {
    x: number,
    y: number,
    width: number,
    height: number,
    category: number,
}

export const AddComponent = styled('div')`
    position: absolute;
    border-radius: 5px;
    background: rgba(255, 255, 255, .6);
    box-shadow: 0 0 4px 1px rgba(255, 255, 255, .5);
    color: #000;
    padding: 5px;
    z-index: 4;
`;
