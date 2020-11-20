import React, {FC} from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import LoadingCircle from '@components/LoadingCircle';
import { Redirect } from 'react-router-dom';

import {Stage, Layer, Rect} from 'react-konva';
import Konva from 'konva';
import { MenuBox, KonvaContainer,BoardFooter, MenuAttr, WarnMessage, TextComponent } from './style';
import AddComponent from '@components/AddComponent';

const dummyTest = [{
    x: 10,
    y: 7,
    width: 3,
    height: 2,
    content: 'Hello 42Board',
    userId: 1,
    expiryDate: '2020-12-31'
}];

type DummyType = {
    x: number,
    y: number,
    width: number,
    height: number,
    userId: number,
    content: string,
    expiryDate: string
}

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

type offset = {
    width: number,
    height: number,
    x: number,
    y: number
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
    const [offset, setOffset] = React.useState<offset>({
        x: 0,
        y: 0,
        width: 0,
        height: 0
    });
    const [addState, setAdd] = React.useState<number>(0);
    const [warning, setWarning] = React.useState<string>('');
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

    const viewAddComponent = React.useCallback((number:number) => {
        const selectSize = (rectSize.width / defaultRectSize) * (rectSize.height / defaultRectSize);
        if (selectSize < 4)
            setWarning('최소 4칸의 영역을 선택해야합니다.');
        else if (number === 3 && selectSize < 6)
            setWarning('이미지는 최소 6칸의 영역을 선택해야합니다.');
        else if (number === 2 && selectSize < 20)
            setWarning('노트는 최소 20칸의 영역을 선택해야합니다.');
        else {
            setOffset({
                x: rPos.x / defaultRectSize,
                y: rPos.y / defaultRectSize,
                width: rectSize.width / defaultRectSize,
                height: rectSize.height / defaultRectSize
            })
            setAdd(number);
        }
    }, [rectSize, defaultRectSize]);

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

    const checkVertexInRect = React.useCallback((v:number, left:number, right: number) => {
        if (v > left && v < right)
            return (true);
        return (false);
    }, []);

    const openAddComponent = React.useCallback((number:number) => {
        if (dummyTest.find(e =>
            (
                checkVertexInRect(e.x * defaultRectSize, rPos.x, rPos.x + rectSize.width)
                ||
                checkVertexInRect((e.x + e.width) * defaultRectSize, rPos.x, rPos.x + rectSize.width))
            &&
            (
                checkVertexInRect(e.y * defaultRectSize, rPos.y, rPos.y + rectSize.height)
                ||
                checkVertexInRect((e.y + e.height) * defaultRectSize, rPos.y, rPos.y + rectSize.height)
            )
        ))
            setWarning('곂치는 영역이 존재합니다.');
        else
            viewAddComponent(number);
    }, [rectSize, rPos, defaultRectSize]);

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
            {warning !== ''&&
                <WarnMessage>
                    {warning}
                </WarnMessage>
            }
            <MenuBox clicked={menuState.flg} x={menuState.x} y={menuState.y} disp={menuState.disp}>
                <MenuAttr onClick={() => openAddComponent(1)}>Text</MenuAttr>
                <MenuAttr onClick={() => openAddComponent(2)}>Note</MenuAttr>
                <MenuAttr onClick={() => openAddComponent(3)}>Image</MenuAttr>
            </MenuBox>
            { addState !== 0 &&
                <AddComponent
                    width={rectSize.width}
                    height={rectSize.height}
                    x={rPos.x}
                    y={rPos.y}
                    category={addState}
                    offset={offset}
                />
            }
            { dummyTest.map((c, i) => {
                return (
                    <TextComponent
                        key={(i)}
                        style={{
                            width: defaultRectSize * c.width - 10,
                            height: defaultRectSize * c.height - 10,
                            left: defaultRectSize * c.x + 5,
                            top: defaultRectSize * c.y + 5,
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
                onMouseDown={() => {
                    if (addState === 0)
                        setDragged({
                            x: mPos.x,
                            y: mPos.y,
                            dragged: true,
                        })
                }}
                onMouseUp={() => {
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
                        setWarning('');
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
