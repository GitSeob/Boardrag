import React, {FC} from 'react';
import { AddComponent, boxProps } from './style';

interface Props {
    category: number
}

const InputForm:FC<Props> = ({ category }) => {
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

const TextAddComponent = (data: boxProps) => {
    return (
        <AddComponent
            style={{
                top: data.y,
                left: data.x,
                width: data.width,
                height: data.height,
            }}
        >
            <InputForm
                category={data.category}
            />
        </AddComponent>
    );
}

export default TextAddComponent;
