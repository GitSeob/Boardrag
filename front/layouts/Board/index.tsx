import React, {FC} from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import LoadingCircle from '@components/LoadingCircle';
import { Redirect } from 'react-router-dom';

import {Stage, Layer, Rect} from 'react-konva';
import Konva from 'konva';
import { MenuBox, KonvaContainer,BoardFooter, MenuAttr, AddComponent, TextComponent } from './style';

const dummyTest = [{
    x: 2,
    y: 1,
    width: 3,
    height: 2,
    content: 'Hello 42Board',
    userId: 1,
    expiryDate: '2020-12-31'
}];

type Position = {
    x: number,
    y: number
};

type MenuPosition = {
    x: number,
    y: number,
    flg: boolean,
    disp: boolean,
}

type DraggedRect = {
    x: number,
    y: number,
    dragged: boolean
}

type RectSize = {
    width: number,
    height: number,
}

const WorkSpace:FC = () => {
    const layerRef = React.useRef() as React.MutableRefObject<Konva.Layer>;
    const [isDragged, setDragged] = React.useState<DraggedRect>({
        x: 0,
        y: 0,
        dragged: false,
    });

    const [mPos, setMPost] = React.useState<Position>({
        x: 0,
        y: 0,
    });

    const [rPos, setRPos] = React.useState<Position>({
        x: 0,
        y: 0
    });

    const [menuState, setMenu] = React.useState<MenuPosition>({
        x: 0,
        y: 0,
        flg: false,
        disp: false,
    });
    const [addState, setAdd] = React.useState(0);

    const [width, setWidth] = React.useState<number>(window.innerWidth);
    const [defaultRectSize, setDefaultRectSize] = React.useState<number>(width / 32);

    const [rectSize, setRectSize] = React.useState<RectSize>({
        width: defaultRectSize,
        height: defaultRectSize,
    });
    const [height, setHeight] = React.useState(defaultRectSize * 20);

    React.useEffect(() => {
        setRPos({
            x: rPos.x / defaultRectSize * window.innerWidth / 32,
            y: rPos.y / defaultRectSize * window.innerWidth / 32
        });
        setRectSize({
            width: rectSize.width / defaultRectSize * window.innerWidth / 32,
            height: rectSize.height / defaultRectSize * window.innerWidth / 32,
        })
        setWidth(window.innerWidth);
        setDefaultRectSize(window.innerWidth/32);
        setHeight(window.innerWidth/32*20);
    }, [window.innerWidth, defaultRectSize]);

    const getRectSize = React.useCallback(() => {
        if (isDragged)
        {
            let w = defaultRectSize * Math.floor((Math.abs( mPos.x - mPos.x % defaultRectSize - isDragged.x) / defaultRectSize ) + 1);
            let h = defaultRectSize * Math.floor((Math.abs( mPos.y - mPos.y % defaultRectSize - isDragged.y) / defaultRectSize ) + 1);

            const xdif = mPos.x - isDragged.x;
            const ydif = mPos.y - isDragged.y;

            if (xdif < 0 && ydif > 0)
            {
                setRPos({
                    ...rPos,
                    x: mPos.x - mPos.x % defaultRectSize,
                })
            }
            else if (xdif > 0 && ydif < 0)
            {
                setRPos({
                    ...rPos,
                    y: mPos.y - mPos.y % defaultRectSize
                })
            }
            else if (xdif < 0 && ydif < 0)
            {
                setRPos({
                    x: mPos.x - mPos.x % defaultRectSize,
                    y: mPos.y - mPos.y % defaultRectSize
                })
            }

            if (xdif > defaultRectSize) {
                w += defaultRectSize;
            }
            if (ydif > defaultRectSize) {
                h += defaultRectSize;
            }

            setRectSize({
                width: w,
                height: h
            })
        }
    }, [mPos, isDragged, rPos, defaultRectSize])

    const RectOnCanvas = ({x = 0, y = 0}) => {
        return <Rect
            width={rectSize.width}
            height={rectSize.height}
            fill='rgba(255, 255, 255, 0.1)'
            x={x}
            y={y}
            cornerRadius={5}
            />
    }

    React.useEffect(() => {
        if (addState == 0)
        {
            if (isDragged.dragged)
                getRectSize();
            else {
                setRPos({
                    x: mPos.x - mPos.x % defaultRectSize,
                    y: mPos.y - mPos.y % defaultRectSize
                })
            }
        }
    }, [mPos, isDragged, addState]);

    React.useEffect(() => {
        if (addState !== 0)
            setMenu({
                ...menuState, flg: false
            });
    }, [addState]);

    return (
        <KonvaContainer>
            <MenuBox clicked={menuState.flg} x={menuState.x} y={menuState.y} disp={menuState.disp}>
                <MenuAttr onClick={() => setAdd(1)}>Text</MenuAttr>
                <MenuAttr onClick={() => setAdd(2)}>Component</MenuAttr>
                <MenuAttr onClick={() => setAdd(3)}>Image</MenuAttr>
            </MenuBox>
            { addState !== 0 &&
                <AddComponent
                    style={{
                        width: rectSize.width,
                        height: rectSize.height,
                        left: rPos.x,
                        top: rPos.y
                    }}
                >
                    hi
                </AddComponent>
            }
            { dummyTest.map((c, i) => {
                return (
                    <TextComponent
                        style={{
                            width: defaultRectSize * c.width,
                            height: defaultRectSize * c.height,
                            left: defaultRectSize * c.x,
                            top: defaultRectSize * c.y,
                            backgroundColor:"#7990ff"
                        }}
                    />
                );
            })}
            <Stage
                style={{
                    height: height,
                    zIndex: 1,
                }}
                width={width}
                height={height}
                onMouseMove={(e) => {
                    if (!menuState.flg)
                    {
                        const transform = layerRef.current.getAbsoluteTransform().copy();
                        transform.invert();
                        const pos = e.target.getStage()?.getPointerPosition();
                        setMPost({
                            x: pos?.x as number,
                            y: pos?.y as number,
                        })
                    }
                }}
                onMouseDown={(e) => {
                    if (addState === 0)
                        setDragged({
                            x: mPos.x,
                            y: mPos.y,
                            dragged: true,
                        })
                }}
                onMouseUp={(e) => {
                    if (!menuState.flg && addState == 0)
                    {
                        setMenu({
                            x: mPos.x,
                            y: mPos.y,
                            flg: true,
                            disp: true,
                        });
                    } else {
                        setRectSize({
                            width: defaultRectSize,
                            height: defaultRectSize,
                        })
                        setDragged({
                            ...isDragged, dragged: false
                        })
                        setMenu({
                            ...menuState, flg: false,
                        })
                        setAdd(0);
                    }
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
