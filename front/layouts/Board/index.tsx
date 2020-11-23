import React, {FC} from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import LoadingCircle from '@components/LoadingCircle';
import { Redirect } from 'react-router-dom';

import {Stage, Layer, Rect} from 'react-konva';
import Konva from 'konva';
import { ImageComponent, MenuBox, KonvaContainer,BoardFooter, MenuAttr, WarnMessage, TextComponent } from './style';
import ImageAdd from '@components/ImageAdd';
import TextAdd from '@components/TextAdd';
import NoteAdd from '@components/NoteAdd';

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

interface IText {
    x: number,
    y: number,
    width: number,
    height: number,
    content: string,
    userId: number,
    createdAt: Date,
    updatedAt: Date,
    expiry_date: Date
}

interface IImage {
    x: number,
    y: number,
    width: number,
    height: number,
    url: string,
    userId: number,
    createdAt: Date,
    updatedAt: Date,
    expiry_date: Date
}

interface INote {
    x: number,
    y: number,
    width: number,
    height: number,
    head: string,
    paragraph: string,
    background_img: string,
    userId: number,
    createdAt: Date,
    updatedAt: Date,
    expiry_date: Date
}

interface IBoard {
    id: number,
    name: string,
    TextContents: IText[] | undefined,
    Images: IImage[] | undefined,
    Notes: INote[] | undefined,
}

interface IBoardProps {
    boardData: IBoard | undefined
    dataReval: () => void
}

const WorkSpace:FC<IBoardProps> = ({ boardData, dataReval }) => {
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
        const selectWidth = rectSize.width / defaultRectSize;
        const selectHeight = rectSize.height / defaultRectSize;
        if ((selectHeight * selectWidth) < 4)
            setWarning('최소 4칸의 영역을 선택해야합니다.');
        else if (number === 3 && (selectHeight * selectWidth) < 6)
            setWarning('이미지는 최소 6칸의 영역을 선택해야합니다.');
        else if (number === 2 && (selectHeight * selectWidth) < 20)
            setWarning('노트는 최소 20칸이상의 영역을 선택해야합니다.');
        else if (number === 2 && (selectHeight < 3 || selectWidth < 4))
            setWarning('노트는 4x3이상의 영역을 선택해야합니다.');
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
        if (boardData?.TextContents && boardData.TextContents.find(e =>
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

    const initStates = React.useCallback(() => {
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
    }, [defaultRectSize, isDragged, menuState]);

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
            { addState === 1 &&
                <TextAdd
                    width={rectSize.width}
                    height={rectSize.height}
                    x={rPos.x}
                    y={rPos.y}
                    offset={offset}
                    initStates={initStates}
                    dataReval={dataReval}
                />
            }
            { addState === 2 &&
                <NoteAdd
                    width={rectSize.width}
                    height={rectSize.height}
                    x={rPos.x}
                    y={rPos.y}
                    offset={offset}
                    initStates={initStates}
                    dataReval={dataReval}
                />
            }
            { addState === 3 &&
                <ImageAdd
                    width={rectSize.width}
                    height={rectSize.height}
                    x={rPos.x}
                    y={rPos.y}
                    offset={offset}
                    initStates={initStates}
                    dataReval={dataReval}
                />
            }
            { boardData?.TextContents  && boardData?.TextContents.map((c, i) => {
                return (
                    <TextComponent
                        key={(i)}
                        width= {defaultRectSize * c.width - 10}
                        height= {defaultRectSize * c.height - 10}
                        x= {defaultRectSize * c.x + 5}
                        y= {defaultRectSize * c.y + 5}
                    >
                        {c.content}
                    </TextComponent>
                );
            })}
            {boardData?.Images && boardData?.Images.map((c, i) => {
                return (
                    <ImageComponent
                        key={(i)}
                        width= {defaultRectSize * c.width - 10}
                        height= {defaultRectSize * c.height - 10}
                        x= {defaultRectSize * c.x + 5}
                        y= {defaultRectSize * c.y + 5}
                    >
                        <img src={c.url} />
                    </ImageComponent>
                )
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
                        initStates();
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
    const { data:userData, revalidate:USERRevalidate, error:USERError } = useSWR('/api/auth', fetcher);
    const { data:boardData, revalidate:BOARDRevalidate, error:BOARDError } = useSWR<IBoard>(userData ? `/api/board/${42}` : null, fetcher);

    if (USERError)
        return <Redirect to="/auth" />

    if (!userData)
        return <LoadingCircle />

    if (boardData)
        console.log(boardData);
    return (
        <>
        <WorkSpace
            boardData={boardData}
            dataReval={BOARDRevalidate}
        />
        </>
    );
}

export default React.memo(Board);
