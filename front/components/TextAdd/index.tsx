import React, { FC } from 'react';
import {
    boxProps,
    SubmitButton,
    TextArea,
    AddContainer,
    AddBox
} from '../addStyle';
import useInput from '@hooks/useInput';

const TextAdd: FC<boxProps> = ({ x, y, width, height, offset }) => {
    const [value, OCValue] = useInput('');

    return (
        <AddContainer y={y} x={x} width={width} height={height}>
            <AddBox>
                <TextArea
                    value={value}
                    onChange={OCValue}
                    autoFocus={true}
                />
                <SubmitButton size={width / offset.width}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                </SubmitButton>
            </AddBox>
        </AddContainer>
    );
}

export default TextAdd;
