import React, {FC} from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import LoadingCircle from '@components/LoadingCircle';
import { Redirect } from 'react-router-dom';

import {Stage, Layer, Rect} from 'react-konva';
import Konva from 'konva';
import { MenuBox, KonvaContainer,BoardFooter } from './style';

type Position = {
    x: number,
    y: number
};

type MenuPosition = {
    x: number,
    y: number,
    flg: boolean,
}

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
    const [menuState, setMenu] = React.useState<MenuPosition>({
        x: 0,
        y: 0,
        flg: false
    });
    const width = window.innerWidth;
    const rectSize = width / 20;
    const height = (width * 10 / 16) - (width * 10 / 16) % rectSize;

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
        <KonvaContainer>
            <MenuBox clicked={menuState.flg} x={menuState.x} y={menuState.y}>
                <div style={{width: '100px', height: '100px'}}>
                    hi
                </div>
            </MenuBox>
            <Stage
                style={{
                    height: height,
                    zIndex: 1,
                }}
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
                onMouseDown={(e) => {
                    setMenu({
                        x: mPos.x,
                        y: mPos.y,
                        flg: true
                    });
                }}
            >
                <Layer ref={layerRef}>
                    <RectOnCanvas x={rPos.x} y={rPos.y}/>
                </Layer>
            </Stage>
            <BoardFooter>
                designed by @han
            </BoardFooter>
        </KonvaContainer>
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
