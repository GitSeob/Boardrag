import React, {FC} from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import LoadingCircle from '@components/LoadingCircle';
import { Redirect } from 'react-router-dom';

import {Stage, Layer, Rect} from 'react-konva';
import Konva from 'konva';

type Position = {
    x: number,
    y: number
};

const WorkSpace:FC = () => {
    const layerRef = React.useRef() as React.MutableRefObject<Konva.Layer>;
    const [mPos, setMPost] = React.useState<Position>({
        x: 0,
        y: 0,
    })
    const [rPos, setRPos] = React.useState<Position>({
        x: 0,
        y: 0
    })
    const height = window.innerHeight;
    const width = height * 16 / 10;

    const rectSize = width / 20;

    const RectOnCanvas = ({x = rectSize, y = rectSize}) => {
        return <Rect
            width={rectSize}
            height={rectSize}
            fill='rgba(255, 255, 255, 0.1)'
            x={x}
            y={y}
            cornerRadius={5}
            />
    }

    React.useEffect(() => {
        setRPos({
            x: mPos.x - mPos.x % rectSize,
            y: mPos.y - mPos.y % rectSize
        })
    }, [mPos]);

    return (
        <>
            <Stage
                width={width}
                height={height}
                onMouseMove={(e) => {
                    const transform = layerRef.current.getAbsoluteTransform().copy();
                    transform.invert();
                    const pos = e.target.getStage()?.getPointerPosition();
                    setMPost({
                        x: pos?.x as number,
                        y: pos?.y as number,
                    })
                }}
            >
                <Layer ref={layerRef}>
                    <RectOnCanvas x={rPos.x} y={rPos.y}/>
                </Layer>
            </Stage>
        </>
    )
}

const Board:FC = () => {
    const { data:userData, revalidate, error:error } = useSWR('/api/auth', fetcher);

    if (error)
        return <Redirect to="/auth" />

    if (!userData)
        return <LoadingCircle />

    return (
        <>
        <WorkSpace />
        </>
    );
}

export default Board;
