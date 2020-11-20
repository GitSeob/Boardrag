import React, {FC} from 'react';
import { AddBox, AddComponent, boxProps, offset } from './style';

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
            </AddBox>
        </AddComponent>
    );
}

export default TextAddComponent;
