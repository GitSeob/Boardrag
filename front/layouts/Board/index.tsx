import React, {FC, useEffect, useCallback, useState, useRef, TextareaHTMLAttributes, MutableRefObject, ChangeEvent} from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import LoadingCircle from '@components/LoadingCircle';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';

import {Stage, Layer, Rect} from 'react-konva';
import Konva from 'konva';
import { EditImageInput, ImageBox, EditButtonBox, EditArea, Comment, CommentBox, DetailContentBox, ComponentBox, UDButtonBox, UserInfo, MomentBox, DetailBox, TopFixContent, BottomFixContent, DetailBackground, DetailWindow, NoteComponent, ImageComponent, MenuBox, KonvaContainer,BoardFooter, MenuAttr, WarnMessage, TextComponent } from './style';
import ImageAdd from '@components/ImageAdd';
import TextAdd from '@components/TextAdd';
import NoteAdd from '@components/NoteAdd';
import useInput from '@hooks/useInput';

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

interface UploadProps {
    loading: boolean,
    success: boolean,
    imageURL: string,
    message: string,
}

interface Comment {
    id: number,
    createdAt: Date,
    updatedAt: Date,
    TextContentId: null | number,
    ImageId: null | number,
    NoteId: null | number,
    BoardId: number,
    deletedAt: Date,
    content: string,
    content_category: number,
    content_id: number,
    User: IUser,
}

interface DetailProps {
    id: number,
    createdAt: Date,
    updatedAt: Date,
    expiry_date: Date,
    UserId: number,
    content: null | string,
    head: null | string,
    paragraph: null | string,
    url: string,
    background_img: string,
    Comments: Comment[]
}

interface IDetail {
    category: number,
    id: number,
    flg: boolean,
    loadComment: boolean,
    content: DetailProps | null
}

interface IIEB {
    imageInput: MutableRefObject<HTMLInputElement>,
    onChangeImg: ( e:ChangeEvent<HTMLInputElement>) => void
    onClick: () => void;
}

const ImageEditButton:FC<IIEB> = ({ imageInput, onChangeImg, onClick}) => {
    return (
        <EditImageInput
            onClick={onClick}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="black"
                width="18px"
                height="18px"
            >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M18 13v7H4V6h5.02c.05-.71.22-1.38.48-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-5l-2-2zm-1.5 5h-11l2.75-3.53 1.96 2.36 2.75-3.54zm2.8-9.11c.44-.7.7-1.51.7-2.39C20 4.01 17.99 2 15.5 2S11 4.01 11 6.5s2.01 4.5 4.49 4.5c.88 0 1.7-.26 2.39-.7L21 13.42 22.42 12 19.3 8.89zM15.5 9C14.12 9 13 7.88 13 6.5S14.12 4 15.5 4 18 5.12 18 6.5 16.88 9 15.5 9z" />
            </svg>
            <p>이미지 변경하기</p>
            <input
                style={{
                    width: 0,
                    height: 0,
                }}
                type="file"
                ref={imageInput}
                onChange={onChangeImg}
            />
        </EditImageInput>
    )
}

const WorkSpace:FC<IBoardProps> = ({ boardData, dataReval, userData }) => {
    const layerRef = React.useRef() as React.MutableRefObject<Konva.Layer>;
    const [isDragged, setDragged] = useState<DraggedRect>({
        x: 0,
        y: 0,
        dragged: false,
    });

    const [mPos, setMPost] = useState<Position>({
        x: 0,
        y: 0,
    });

    const [rPos, setRPos] = useState<Position>({
        x: 0,
        y: 0
    });

    const [menuState, setMenu] = useState<MenuPosition>({
        x: 0,
        y: 0,
        flg: false,
        disp: false,
    });
    const [offset, setOffset] = useState<offset>({
        x: 0,
        y: 0,
        width: 0,
        height: 0
    });
    const [addState, setAdd] = useState<number>(0);
    const [openDetail, setOpenDetail] = useState<IDetail>({
        category: 0,
        id: 0,
        flg: false,
        loadComment: false,
        content: null,
    })
    const [warning, setWarning] = useState<string>('');
    const [width, setWidth] = useState<number>(window.innerWidth);
    const [defaultRectSize, setDefaultRectSize] = useState<number>(width / 32);
    const [rectSize, setRectSize] = useState<RectSize>({
        width: defaultRectSize,
        height: defaultRectSize,
    });
    const [commentContent, OCCC, setCC] = useInput('');
    const [height, setHeight] = useState(defaultRectSize * 20);
    const [comments, setComments] = useState<Comment[] | null>();
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [text, setText] = useState('');
    const [head, OCHead, setHead] = useInput('');
    const [editUrl, setEditUrl] = useState<string>('');
    const [uploading, setUploading] = useState<UploadProps>({
        loading: false,
        success: false,
        imageURL: '',
        message: '',
    });
    const textScrollRef = useRef() as React.MutableRefObject<HTMLTextAreaElement>;
    const imageInput = useRef() as React.MutableRefObject<HTMLInputElement>;

    const detailWindowStyle = {
        transform: openDetail.flg ? 'translateX(0%)' : 'translateX(-100%)',
    }

    useEffect(() => {
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

    const viewAddComponent = useCallback((number:number) => {
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

    const getRectSize = useCallback(() => {
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

    const checkVertexInRect = useCallback((v:number, left:number, right: number) => {
        if (v > left && v < right)
            return (true);
        return (false);
    }, []);

    const openAddComponent = useCallback((number:number) => {
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

    const initStates = useCallback(() => {
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

    const openDetailWindow = useCallback((category, id, content) => {
        setOpenDetail({
            ...openDetail,
            flg: true,
            category: category,
            id: id,
            content: content,
        });
        setComments(content.Comments);
    }, [openDetail]);

    const submitComment = useCallback((e) => {
        e.preventDefault();
        if (commentContent !== '') {
            axios.post(`/api/comment/${openDetail.category}/${openDetail.content?.id}`, {
                content: commentContent
            }).then((res) => {
                setCC('');
                axios.get(`api/comment/${openDetail.category}/${openDetail.content?.id}`).then(res => {
                    setComments(res.data);
                }).catch((e) => {
                    console.error(e);
                })
                dataReval();
            }). catch((e) => {
                console.error(e);
            })
        }
    }, [commentContent, openDetail]);

    const deleteBox = useCallback(() => {
        let category = '';
        if (openDetail.category === 1)
            category = 'text';
        else if (openDetail.category === 2)
            category = 'note';
        else if (openDetail.category === 3)
            category = 'image';
        else
            return ;
        axios.delete(`api/delete/${category}/${openDetail.content?.id}`).then(() => {
            dataReval();
            setOpenDetail({
                category: 0,
                id: 0,
                flg: false,
                loadComment: false,
                content: null,
            })
        }).catch((e) => {
            console.error(e);
        })
    }, [openDetail]);

    const onEdit = useCallback((cid) => {
        setIsEdit(!isEdit);
        if (isEdit) {
            setText('');
            setHead('');
            setEditUrl('');
        }
        else if (cid === 1)
        {
            setText(typeof openDetail.content?.content === 'string' ? openDetail.content?.content : '');
            if (isEdit) setTAH(`${textScrollRef.current.scrollHeight}px`);
        }
        else if (cid === 2)
        {
            setHead(typeof openDetail.content?.head === 'string' ? openDetail.content?.head : '');
            setText(typeof openDetail.content?.paragraph === 'string' ? openDetail.content?.paragraph : '');
            setUploading({
                ...uploading,
                imageURL: typeof openDetail.content?.background_img === 'string' ? openDetail.content?.background_img : '',
            });
            if (isEdit) setTAH(`${textScrollRef.current.scrollHeight}px`);
        }
        else if (cid === 3)
        {
            setUploading({
                ...uploading,
                imageURL: typeof openDetail.content?.url === 'string' ? openDetail.content?.url : '',
            });
        }
    }, [isEdit, openDetail, textScrollRef]);

    const [TAH, setTAH] = useState('auto');

    const OCText = useCallback((e) => {
        setTAH(`${textScrollRef.current.scrollHeight}px`);
        setText(e.target.value);
    }, [textScrollRef]);

    const onInitContent = useCallback(() => {
        setOpenDetail({
            category: 0,
            id: 0,
            flg: false,
            loadComment: false,
            content: null,
        })
        setHead('');
        setText('');
        setUploading({
            loading: false,
            success: false,
            message: '',
            imageURL: ''
        });
        setIsEdit(false);
    }, []);

    const cencelEdit = useCallback(() => {
        setHead('');
        setText('');
        setUploading({
            loading: false,
            success: false,
            message: '',
            imageURL: ''
        });
        setIsEdit(false);
    }, []);

    const onClickImageUpload = useCallback(() => {
		imageInput.current.click();
    }, [imageInput.current]);

    const onChangeImg = useCallback( async (e) => {
		const imageFormData = new FormData();
        imageFormData.append('image', e.target.files[0]);
        await setUploading({
            ...uploading,
            loading: true
        });
		await axios.post('/api/uploadImage', imageFormData).then(res => {
            setUploading({
                ...uploading,
                success: true,
                loading: false,
                imageURL: res.data.url
            });
        }).catch(e => {
            setUploading({
                ...uploading,
                loading: false,
                message: e.response.message
            });
        })
    }, []);

    const onSubmitEdit = useCallback(async () => {
        let requestURL = '';
        let data = {};
        if (openDetail.category === 1) {
            requestURL = `/api/text/${openDetail.id}`;
            data = { content: text };
        } else if (openDetail.category === 2) {
            requestURL = `/api/note/${openDetail.id}`;
            data = {
                background_img: uploading.imageURL,
                head: head,
                paragraph: text
            };
        } else if (openDetail.category === 3) {
            requestURL = `/api/image/${openDetail.id}`;
            data = { url: uploading.imageURL };
        } else {
            await setWarning('잘못된 접근입니다.');
            setTimeout(() => {
                setWarning('');
            }, 2000);
            return ;
        }
        await axios.patch(requestURL, data).then(() => {
            setOpenDetail({
                category: 0,
                id: 0,
                flg: false,
                loadComment: false,
                content: null,
            });
            dataReval();
        }).catch((e) => {
            setWarning(e.response.message);
            setTimeout(() => {
                setWarning('');
            }, 2000);
        });
        cencelEdit();
    }, [text, head, openDetail, uploading]);

    useEffect(() => {
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

    useEffect(() => {
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
                    onClick={onInitContent}
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
                                    <button
                                        onClick={() => onEdit(openDetail.category)}
                                    >
                                        <img src="/public/edit.svg" />
                                    </button>
                                    <button
                                        onClick={deleteBox}
                                    >
                                        <img src="/public/delete.svg" />
                                    </button>
                                </UDButtonBox>
                            }
                        </UserInfo>
                        <MomentBox>
                            <div>작성일 : <p>{moment(openDetail.content?.createdAt).format('YYYY년 MM월 DD일')}</p></div>
                            <div>만료일 : <p>{moment(openDetail.content?.expiry_date).format('YYYY년 MM월 DD일')}</p></div>
                        </MomentBox>
                        Content :
                        <DetailContentBox>
                            {openDetail.category === 1 &&
                                (!isEdit ?
                                    <div>
                                        {openDetail.content?.content}
                                    </div>
                                    :
                                    <>
                                        <EditArea>
                                            <textarea
                                                value={text}
                                                onChange={OCText}
                                                ref={textScrollRef}
                                                style={{height: TAH}}
                                            />
                                            <EditButtonBox>
                                                <div
                                                    className="button edit"
                                                    onClick={onSubmitEdit}
                                                >수정</div>
                                                <div
                                                    className="button"
                                                    onClick={cencelEdit}
                                                >취소</div>
                                            </EditButtonBox>
                                        </EditArea>
                                    </>
                                )
                            }
                            {openDetail.category === 2 &&
                                ( !isEdit ?
                                    <>
                                        {openDetail.content?.background_img && <img src={openDetail.content?.background_img} />}
                                        <h2>
                                            {openDetail.content?.head}
                                        </h2>
                                        <div>
                                            {openDetail.content?.paragraph}
                                        </div>
                                    </>
                                    :
                                    <>
                                        <EditArea>
                                            <ImageBox>
                                                {uploading.imageURL !== '' ?
                                                    <img src={uploading.imageURL} />
                                                    :
                                                    <div className="temp"/>
                                                }
                                                <ImageEditButton
                                                    onClick={onClickImageUpload}
                                                    imageInput={imageInput}
                                                    onChangeImg={onChangeImg}
                                                />
                                            </ImageBox>
                                            <input
                                                value={head}
                                                onChange={OCHead}
                                            />
                                            <textarea
                                                value={text}
                                                onChange={OCText}
                                                ref={textScrollRef}
                                                style={{height: TAH}}
                                            />
                                            <EditButtonBox>
                                                <div
                                                    className="button edit"
                                                    onClick={onSubmitEdit}
                                                >수정</div>
                                                <div
                                                    className="button"
                                                    onClick={cencelEdit}
                                                >취소</div>
                                            </EditButtonBox>
                                        </EditArea>
                                    </>
                                )
                            }
                            {openDetail.category === 3 &&
                                ( !isEdit ?
                                    <img src={openDetail.content?.url} />
                                    :
                                    <>
                                        <EditArea>
                                            <ImageBox>
                                                <img src={uploading.imageURL} />
                                                <ImageEditButton
                                                    onClick={onClickImageUpload}
                                                    imageInput={imageInput}
                                                    onChangeImg={onChangeImg}
                                                />
                                            </ImageBox>
                                            <EditButtonBox>
                                                <div
                                                    className="button edit"
                                                    onClick={onSubmitEdit}
                                                >수정</div>
                                                <div
                                                    className="button"
                                                    onClick={cencelEdit}
                                                >취소</div>
                                            </EditButtonBox>
                                        </EditArea>
                                    </>
                                )
                            }
                        </DetailContentBox>
                    </TopFixContent>
                    <div
                        style={{borderBottom: '1px solid #444', padding: '.5rem 0'}}
                    >Comment:</div>
                    <CommentBox>
                        {comments?.map((c, i) => {
                            return (
                                <Comment
                                    key={(i)}
                                >
                                    <img src={c.User.profile_img} />
                                    <div className="content">
                                        <p>{c.User.username}</p>
                                        <div>
                                            <div>{c.content}</div>
                                            <p>{moment(c.createdAt).diff(new Date(), 'days') < 1 ? moment(c.createdAt).format('LT') : moment(c.createdAt).format('YYYY년 MM월 DD일')}</p>
                                        </div>
                                    </div>
                                </Comment>
                            );
                        })}
                    </CommentBox>
                    </>
                }
                </DetailBox>
                <BottomFixContent
                    onClick={submitComment}
                >
                    <input type="text" value={commentContent} onChange={OCCC}/>
                    <div>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                    </div>
                </BottomFixContent>
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
                            onClick={() => openDetailWindow(3, c.id, c)}
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
                            onClick={() => openDetailWindow(2, c.id, c)}
                            src={c.background_img ? c.background_img : ''}
                        >
                            <div className="head" style={{height: 'fit-content'}}>
                                <p>{c.head}</p>
                            </div>
                            <div className="para" style={{height: (defaultRectSize * c.height - 10)}}>
                                <p>{c.paragraph}</p>
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
    const { data:userData, revalidate:USERRevalidate } = useSWR<IUser | false>('/api/auth', fetcher);
    const { data:boardData, revalidate:BOARDRevalidate, error:BOARDError } = useSWR<IBoard>(userData ? `/api/board/${42}` : null, fetcher);

    if (userData === false)
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
