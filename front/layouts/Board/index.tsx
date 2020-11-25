import React, {FC} from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import LoadingCircle from '@components/LoadingCircle';
import { Redirect } from 'react-router-dom';
import moment from 'moment';

import {Stage, Layer, Rect} from 'react-konva';
import Konva from 'konva';
import { Comment, CommentBox, DetailContentBox, ComponentBox, UDButtonBox, UserInfo, MomentBox, DetailBox, TopFixContent, BottomFixContent, DetailBackground, DetailWindow, NoteComponent, ImageComponent, MenuBox, KonvaContainer,BoardFooter, MenuAttr, WarnMessage, TextComponent } from './style';
import ImageAdd from '@components/ImageAdd';
import TextAdd from '@components/TextAdd';
import NoteAdd from '@components/NoteAdd';

const dummyComments = [{
    id: 1,
    UserId: 1,
    User: {
        id: 1,
        username: 'han',
        profile_img: 'https://cdn.intra.42.fr/users/han.jpg'
    },
    content: '우왕ㅋㅋ',
    createdAt: new Date(),
}]

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
    id: number,
    x: number,
    y: number,
    width: number,
    height: number,
    content: string,
    UserId: number,
    createdAt: Date,
    updatedAt: Date,
    expiry_date: Date
}

interface IImage {
    id: number,
    x: number,
    y: number,
    width: number,
    height: number,
    url: string,
    UserId: number,
    createdAt: Date,
    updatedAt: Date,
    expiry_date: Date
}

interface INote {
    id: number,
    x: number,
    y: number,
    width: number,
    height: number,
    head: string,
    paragraph: string,
    background_img: string,
    UserId: number,
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

interface IUser {
    id: number,
    username: string,
    profile_img: string,
    is_admin: boolean
}

interface IBoardProps {
    boardData: IBoard | undefined,
    userData: IUser,
    dataReval: () => void,
}

const WorkSpace:FC<IBoardProps> = ({ boardData, dataReval, userData }) => {
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
    const [openDetail, setOpenDetail] = React.useState({
        category: 0,
        id: 0,
        flg: false,
        loadComment: false,
        content: {
            UserId: 0,
            createdAt: '',
            updatedAt: '',
            expiry_date: '',
            content: '',
            head: '',
            paragraph: '',
            url: '',
        },
    })
    const [warning, setWarning] = React.useState<string>('');
    const [width, setWidth] = React.useState<number>(window.innerWidth);
    const [defaultRectSize, setDefaultRectSize] = React.useState<number>(width / 32);
    const [rectSize, setRectSize] = React.useState<RectSize>({
        width: defaultRectSize,
        height: defaultRectSize,
    });
    const [height, setHeight] = React.useState(defaultRectSize * 20);

    const detailWindowStyle = {
        transform: openDetail.flg ? 'translateX(0%)' : 'translateX(-100%)',
    }

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

    const openDetailWindow = React.useCallback((category, id, content) => {
        console.log(content);
        setOpenDetail({
            ...openDetail,
            flg: true,
            category: category,
            id: id,
            content: content,
        });
    }, [openDetail]);

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
            {openDetail.flg &&
                    <DetailBackground
                        onClick={() => setOpenDetail({
                            category: 0,
                            id: 0,
                            flg: false,
                            loadComment: false,
                            content: {
                                UserId: 0,
                                createdAt: '',
                                updatedAt: '',
                                expiry_date: '',
                                content: '',
                                head: '',
                                paragraph: '',
                                url: '',
                            },
                        })}
                    />
            }
            <DetailWindow style={detailWindowStyle}>
                <DetailBox>
                    { openDetail.id !== 0 &&
                    <>
                    <TopFixContent>
                        <UserInfo>
                            <img src={userData.profile_img} />
                            <p>{userData.username}</p>
                            {(openDetail.content && openDetail.content.UserId === userData.id ) &&
                                <UDButtonBox>
                                    <button>
                                        <img src="/public/edit.svg" />
                                    </button>
                                    <button>
                                        <img src="/public/delete.svg" />
                                    </button>
                                </UDButtonBox>
                            }
                        </UserInfo>
                        <MomentBox>
                            <div>작성일 : <p>{moment(openDetail.content.createdAt).format('YYYY년 MM월 DD일')}</p></div>
                            <div>만료일 : <p>{moment(openDetail.content.expiry_date).format('YYYY년 MM월 DD일')}</p></div>
                        </MomentBox>
                        Content :
                        <DetailContentBox>
                            {openDetail.category === 1 &&
                                <div>
                                    {openDetail.content.content}
                                </div>
                            }
                            {openDetail.category === 2 &&
                                <div>노트</div>
                            }
                            {openDetail.category === 3 &&
                                <div>이미지</div>
                            }
                        </DetailContentBox>
                    </TopFixContent>
                    <div
                        style={{borderBottom: '1px solid #444', padding: '.5rem 0'}}
                    >Comment:</div>
                    <CommentBox>
                        {dummyComments.map((c, i) => {
                            return (
                                <Comment
                                    key={(i)}
                                >
                                    <img src={c.User.profile_img} />
                                    <div className="content">
                                        <p>{c.User.username}</p>
                                        <div>
                                            <div>{c.content}</div>
                                            <p>{moment(c.createdAt).format('YYYY년 MM월 DD일')}</p>
                                        </div>
                                    </div>
                                </Comment>
                            );
                        })}
                    </CommentBox>
                    <BottomFixContent>
                        <input type="text" />
                        <div>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                        </div>
                    </BottomFixContent>
                    </>
                }
                </DetailBox>
            </DetailWindow>
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
                    <ComponentBox
                        key={(i)}
                        width= {defaultRectSize * c.width}
                        height= {defaultRectSize * c.height}
                        x= {defaultRectSize * c.x}
                        y= {defaultRectSize * c.y}
                    >
                        <TextComponent
                            onClick={() => openDetailWindow(1, c.id, c)}
                        >
                            {c.content}
                        </TextComponent>
                    </ComponentBox>
                );
            })}
            {boardData?.Images && boardData?.Images.map((c, i) => {
                return (
                    <ComponentBox
                        key={(i)}
                        width= {defaultRectSize * c.width}
                        height= {defaultRectSize * c.height}
                        x= {defaultRectSize * c.x}
                        y= {defaultRectSize * c.y}
                    >
                        <ImageComponent
                        >
                            <img src={c.url} />
                        </ImageComponent>
                    </ComponentBox>
                )
            })}
            {boardData?.Notes && boardData?.Notes.map((c, i) => {
                return (
                    <ComponentBox
                        key={(i)}
                        width= {defaultRectSize * c.width}
                        height= {defaultRectSize * c.height}
                        x= {defaultRectSize * c.x}
                        y= {defaultRectSize * c.y}
                    >
                        <NoteComponent
                            src={c.background_img ? c.background_img : ''}
                        >
                            <div className="head" style={{height: defaultRectSize}}>
                                {c.head}
                            </div>
                            <div style={{height: (defaultRectSize * c.height - 10)}}>
                                {c.paragraph}
                            </div>
                        </NoteComponent>
                    </ComponentBox>
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
    const { data:userData, revalidate:USERRevalidate, error:USERError } = useSWR<IUser>('/api/auth', fetcher);
    const { data:boardData, revalidate:BOARDRevalidate, error:BOARDError } = useSWR<IBoard>(userData ? `/api/board/${42}` : null, fetcher);

    if (USERError)
        return <Redirect to="/auth" />

    if (!userData)
        return <LoadingCircle />

    return (
        <>
        <WorkSpace
            boardData={boardData}
            dataReval={BOARDRevalidate}
            userData={userData}
        />
        </>
    );
}

export default React.memo(Board);
