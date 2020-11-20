import React, {FC} from 'react';
import { AddComponent, boxProps, offset } from './style';

interface Props {
    category: number,
    offset: offset
}

const InputForm:FC<Props> = ({ category, offset }) => {
    if (category === 1)
        return (
            <div>Text</div>
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
            style={{
                top: y,
                left: x,
                width: width,
                height: height,
            }}
        >
            <InputForm
                category={category}
                offset={offset}
            />
        </AddComponent>
    );
}

export default TextAddComponent;
