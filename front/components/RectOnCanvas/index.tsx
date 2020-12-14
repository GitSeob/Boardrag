import React, { FC } from 'react';
import { Rect, Image } from 'react-konva';
import useImage from 'use-image';

import { IDetail, RectSize } from '@typings/datas';

interface Props {
    x: number,
    y: number,
    canMove: boolean,
    openDetail: IDetail,
    rectSize: RectSize,
    rectDE: (e:any) => void,
}

const RectOnCanvas:FC<Props> = ({
    x = 0, y = 0,
    canMove, openDetail, rectSize, rectDE
}) => {
    const color = canMove ? `rgba(32, 178, 170, .5)` : `rgba(255, 255, 255, 0.1)`;

    if ((openDetail?.category === 3  || openDetail?.category === 2) && canMove)
    {
        const imageSrc = openDetail.category === 3 ? openDetail.content?.url : openDetail.content?.background_img;
        const [image] = useImage(imageSrc ? imageSrc : '');

        return (
            <Image
                opacity={0.4}
                width={rectSize.width}
                height={rectSize.height}
                fill={ color }
                x={x}
                y={y}
                cornerRadius={5}
                image={image}
                draggable={canMove}
                onDragEnd={canMove ? rectDE : undefined}
            />
        )
    }
    return <Rect
        width={rectSize.width}
        height={rectSize.height}
        fill={ color }
        x={x}
        y={y}
        cornerRadius={5}
        draggable={canMove}
        onDragEnd={canMove ? rectDE : undefined}
    />
}

export default RectOnCanvas;
