import React, {FC} from 'react';
import { AddBox, AddComponent, boxProps, offset, SubmitButton } from './style';

interface SwitchProps {
    category: number,
    offset: offset
}

interface InputProps {
    offset: offset
}

const TextComponent:FC<InputProps> = ({ offset }) => {
    return (
        <div>text</div>
    );
}

const InputForm:FC<SwitchProps> = ({ category, offset }) => {
    if (category === 1)
        return (
            <TextComponent
                offset={offset}
            />
        )
    else if (category === 2)
        return (
            <div>Note</div>
        )
    return (
        <div>Image</div>
    )
}

const TextAddComponent:FC<boxProps> = ({x, y, width, height, category, offset}) => {
    return (
        <AddComponent
            y= {y}
            x= {x}
            width= {width}
            height= {height}
        >
            <AddBox>
                <InputForm
                    category={category}
                    offset={offset}
                />
                <SubmitButton
                    size={width / offset.width}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </SubmitButton>
            </AddBox>
        </AddComponent>
    );
}

export default TextAddComponent;
