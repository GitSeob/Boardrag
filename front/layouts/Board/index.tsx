import React, {FC, useEffect, useCallback, useState, useRef, MutableRefObject, ChangeEvent} from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import LoadingCircle from '@components/LoadingCircle';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import {Stage, Layer, Rect, Group, Image} from 'react-konva';
import Konva from 'konva';

import useSocket from '@hooks/useSocket';
import { ChatForm, ChatRoom, ResizeRemote, OnModeAlt ,AltBox, UserList, LogOutButton, MenuContainer, UserMenu, EditImageInput, ImageBox, EditButtonBox, EditArea, Comment, CommentBox, DetailContentBox, ComponentBox, UDButtonBox, UserInfo, MomentBox, DetailBox, TopFixContent, BottomFixContent, DetailBackground, DetailWindow, NoteComponent, ImageComponent, MenuBox, KonvaContainer,BoardFooter, MenuAttr, WarnMessage, TextComponent } from './style';
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
    expiry_date: Date,
    Comments: Comment[],
    User: IUser,
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
    expiry_date: Date,
    Comments: Comment[],
    User: IUser,
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
    expiry_date: Date,
    Comments: Comment[],
    User: IUser,
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
    x: number,
    y: number,
    width: number,
    height: number,
    createdAt: Date,
    updatedAt: Date,
    expiry_date: Date,
    UserId: number,
    content: null | string,
    head: null | string,
    paragraph: null | string,
    url: string,
    background_img: string,
    Comments: Comment[],
    User: IUser,
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

interface IUuserList {
    id: number,
    username: string,
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
                accept=".gif, .jpg, .png"
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

    const [mPos, setMPos] = useState<Position>({
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
    const [canMove, setCanMove] = useState(false);
    const [isEditSize, setIsEditSize] = useState(false);
    const textScrollRef = useRef() as React.MutableRefObject<HTMLTextAreaElement>;
    const imageInput = useRef() as React.MutableRefObject<HTMLInputElement>;

    const now = new Date();

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
        if (isDragged && !canMove)
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
    }, [mPos, isDragged, rPos, defaultRectSize]);

    const rectDE = (e:any) => {
        setRPos({
            x: e.target.x() - e.target.x() % defaultRectSize,
            y: e.target.y() - e.target.y() % defaultRectSize,
        });
    };

    const RectOnCanvas = ({x = 0, y = 0}) => {
        const color = canMove ? `rgba(32, 178, 170, .5)` : `rgba(255, 255, 255, 0.1)`;

        return <Rect
            width={rectSize.width}
            height={rectSize.height}
            fill={ color }
            x={x}
            y={y}
            cornerRadius={5}
            draggable
            onDragEnd={rectDE}

        />
    }

    const checkVertexInRect = useCallback((v:number, left:number, right: number) => {
        if (v > left && v < right)
            return (true);
        return (false);
    }, []);

    const checkAllBox = useCallback(() => {
        if (boardData?.TextContents && boardData.TextContents.filter(elem => !(openDetail.category === 1 && elem.id === openDetail.id)).find(e =>
            ((
                    checkVertexInRect(e.x * defaultRectSize, rPos.x, rPos.x + rectSize.width)
                    ||
                    checkVertexInRect((e.x + e.width) * defaultRectSize, rPos.x, rPos.x + rectSize.width)
                ) && (
                    checkVertexInRect(e.y * defaultRectSize, rPos.y, rPos.y + rectSize.height)
                    ||
                    checkVertexInRect((e.y + e.height) * defaultRectSize, rPos.y, rPos.y + rectSize.height)
            ))
            ||
            ((
                checkVertexInRect(e.x * defaultRectSize, rPos.x, rPos.x + rectSize.width)
                ||
                checkVertexInRect((e.x + e.width) * defaultRectSize, rPos.x, rPos.x + rectSize.width)
                ) && (
                    checkVertexInRect(rPos.y, e.y * defaultRectSize, (e.y + e.height) * defaultRectSize)
                    ||
                    checkVertexInRect(rPos.y + rectSize.height, e.y * defaultRectSize, (e.y + e.height) * defaultRectSize)
            ))
            ||
            ((
                    checkVertexInRect(rPos.x, e.x * defaultRectSize, (e.x + e.width) * defaultRectSize)
                    ||
                    checkVertexInRect(rPos.x + rectSize.width, e.x * defaultRectSize, (e.x + e.width) * defaultRectSize)
                ) && (
                    checkVertexInRect(e.y * defaultRectSize, rPos.y, rPos.y + rectSize.height)
                    ||
                    checkVertexInRect((e.y + e.height) * defaultRectSize, rPos.y, rPos.y + rectSize.height)
            ))
        ))
            return (false);
        if (boardData?.Images && boardData.Images.filter(elem => !(openDetail.category === 3 && elem.id === openDetail.id)).find(e =>
            ((
                checkVertexInRect(e.x * defaultRectSize, rPos.x, rPos.x + rectSize.width)
                ||
                checkVertexInRect((e.x + e.width) * defaultRectSize, rPos.x, rPos.x + rectSize.width)
            ) && (
                checkVertexInRect(e.y * defaultRectSize, rPos.y, rPos.y + rectSize.height)
                ||
                checkVertexInRect((e.y + e.height) * defaultRectSize, rPos.y, rPos.y + rectSize.height)
        ))
        ||
        ((
            checkVertexInRect(e.x * defaultRectSize, rPos.x, rPos.x + rectSize.width)
            ||
            checkVertexInRect((e.x + e.width) * defaultRectSize, rPos.x, rPos.x + rectSize.width)
            ) && (
                checkVertexInRect(rPos.y, e.y * defaultRectSize, (e.y + e.height) * defaultRectSize)
                ||
                checkVertexInRect(rPos.y + rectSize.height, e.y * defaultRectSize, (e.y + e.height) * defaultRectSize)
        ))
        ||
        ((
                checkVertexInRect(rPos.x, e.x * defaultRectSize, (e.x + e.width) * defaultRectSize)
                ||
                checkVertexInRect(rPos.x + rectSize.width, e.x * defaultRectSize, (e.x + e.width) * defaultRectSize)
            ) && (
                checkVertexInRect(e.y * defaultRectSize, rPos.y, rPos.y + rectSize.height)
                ||
                checkVertexInRect((e.y + e.height) * defaultRectSize, rPos.y, rPos.y + rectSize.height)
        ))
    ))
            return (false);
        if (boardData?.Notes && boardData.Notes.filter(elem => !(openDetail.category === 2 && elem.id === openDetail.id)).find(e =>
            ((
                checkVertexInRect(e.x * defaultRectSize, rPos.x, rPos.x + rectSize.width)
                ||
                checkVertexInRect((e.x + e.width) * defaultRectSize, rPos.x, rPos.x + rectSize.width)
            ) && (
                checkVertexInRect(e.y * defaultRectSize, rPos.y, rPos.y + rectSize.height)
                ||
                checkVertexInRect((e.y + e.height) * defaultRectSize, rPos.y, rPos.y + rectSize.height)
        ))
        ||
        ((
            checkVertexInRect(e.x * defaultRectSize, rPos.x, rPos.x + rectSize.width)
            ||
            checkVertexInRect((e.x + e.width) * defaultRectSize, rPos.x, rPos.x + rectSize.width)
            ) && (
                checkVertexInRect(rPos.y, e.y * defaultRectSize, (e.y + e.height) * defaultRectSize)
                ||
                checkVertexInRect(rPos.y + rectSize.height, e.y * defaultRectSize, (e.y + e.height) * defaultRectSize)
        ))
        ||
        ((
                checkVertexInRect(rPos.x, e.x * defaultRectSize, (e.x + e.width) * defaultRectSize)
                ||
                checkVertexInRect(rPos.x + rectSize.width, e.x * defaultRectSize, (e.x + e.width) * defaultRectSize)
            ) && (
                checkVertexInRect(e.y * defaultRectSize, rPos.y, rPos.y + rectSize.height)
                ||
                checkVertexInRect((e.y + e.height) * defaultRectSize, rPos.y, rPos.y + rectSize.height)
        ))
    ))
            return (false);
        return (true);
    }, [boardData, rPos, defaultRectSize, rectSize, openDetail]);

    const testF = (x:number, y:number, w:number, h:number, rx:number, ry:number, rw:number, rh:number) => {
        if (rx >= x && ry >= y && rx + rw <= x + w && ry + rh <= y + h)
            return false;
        return true;
    };

    const isAvailPos = useCallback(() => {
        if (!checkAllBox())
            return false;
        if (boardData?.TextContents?.filter(elem => !(openDetail.category === 1 && elem.id === openDetail.id)).find((e) => (
            !testF(e.x * defaultRectSize, e.y* defaultRectSize, e.width* defaultRectSize, e.height* defaultRectSize, rPos.x, rPos.y, rectSize.width, rectSize.height)
        )))
            return false;
        if (boardData?.Images?.filter(elem => !(openDetail.category === 3 && elem.id === openDetail.id)).find((e) => (
            !testF(e.x * defaultRectSize, e.y* defaultRectSize, e.width* defaultRectSize, e.height* defaultRectSize, rPos.x, rPos.y, rectSize.width, rectSize.height)
        )))
            return false;
        if (boardData?.Notes?.filter(elem => !(openDetail.category === 2 && elem.id === openDetail.id)).find((e) => (
            !testF(e.x * defaultRectSize, e.y* defaultRectSize, e.width* defaultRectSize, e.height* defaultRectSize, rPos.x, rPos.y, rectSize.width, rectSize.height)
        )))
            return false;
        return true;
    }, [boardData, rPos, rectSize, defaultRectSize, openDetail]);

    const openAddComponent = useCallback((number:number) => {
        if (!checkAllBox())
            setWarning('겹치는 영역이 존재합니다.');
        else
            viewAddComponent(number);
    }, [rectSize, rPos, defaultRectSize, rectSize]);

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
            }).then(() => {
                setCC('');
                dataReval();
            }). catch((e) => {
                console.error(e);
            })
        }
    }, [commentContent, openDetail]);

    const deleteBox = useCallback(() => {
        if (!confirm('정말 삭제하시겠습니까?'))
            return ;
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
        await axios.post('/api/uploadImage', imageFormData, {
            headers: {'Access-Control-Allow-Origin': '*'}
        }).then(res => {
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
                message: e.response.data
            });
        })
    }, []);

    const onSubmitEdit = useCallback(async () => {
        let requestURL = '';
        let data = {
            x: openDetail.content?.x,
            y: openDetail.content?.y,
            width: openDetail.content?.width,
            height: openDetail.content?.height,
            content: '',
            head: '',
            paragraph: '',
            background_img: '',
            url: '',
        };
        if (openDetail.category === 1) {
            requestURL = `/api/text/${openDetail.id}`;
            data = {
                ...data,
                content: text
            };
        } else if (openDetail.category === 2) {
            requestURL = `/api/note/${openDetail.id}`;
            data = {
                ...data,
                background_img: uploading.imageURL,
                head: head,
                paragraph: text
            };
        } else if (openDetail.category === 3) {
            if (uploading.imageURL === '')
            {
                await setWarning('이미지를 다시 업로드해주세요');
                await setTimeout(() => {
                    setWarning('');
                }, 2000);
                return ;
            }
            requestURL = `/api/image/${openDetail.id}`;
            data = { ...data, url: uploading.imageURL };
        } else {
            await setWarning('잘못된 접근입니다.');
            await setTimeout(() => {
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
            setWarning(e.response.data);
            setTimeout(() => {
                setWarning('');
            }, 2000);
        });
        cencelEdit();
    }, [text, head, openDetail, uploading]);

    const moveMode = useCallback(( ) => {
        if (openDetail.content)
        {
            setMenu({...menuState, flg: false, disp: false});
            setOpenDetail({
                ...openDetail, flg: false
            });
            setCanMove(true);
            setRPos({
                x: openDetail.content.x * defaultRectSize,
                y: openDetail.content.y * defaultRectSize
            });
            setRectSize({
                width: openDetail.content.width * defaultRectSize,
                height: openDetail.content.height * defaultRectSize,
            });
        }
    }, [openDetail, defaultRectSize]);

    useEffect(() => {
        if (addState == 0 && !canMove)
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

    const mouseMove = (e:any) => {
        if (!menuState.flg)
        {
            const transform = layerRef.current.getAbsoluteTransform().copy();
            transform.invert();
            const pos = e.target.getStage()?.getPointerPosition();
            setMPos({
                x: pos?.x as number,
                y: pos?.y as number,
            })
        }
    };

    const mouseDown = () => {
        if (addState === 0 && !canMove)
            setDragged({
                x: mPos.x,
                y: mPos.y,
                dragged: true,
            })
    }

    const mouseUp = () => {
        if (canMove)
            return ;
        else if (!menuState.flg && addState == 0)
        {
            const mX = mPos.x > window.innerWidth - 140 ? mPos.x - 140 : mPos.x;
            const mY = mPos.y > window.innerHeight - 140 ? mPos.y - 140 : mPos.y;
            setMenu({
                x: mX,
                y: mY,
                flg: true,
                disp: true,
            });
        } else {
            initStates();
        }
    };

    const UpdatePosition = async () => {
        if (!isAvailPos())
            return setWarning('이동할 수 없는 위치입니다.');
        let requestURL = '';
        const selectWidth = rectSize.width / defaultRectSize;
        const selectHeight = rectSize.height / defaultRectSize;
        if ((selectHeight * selectWidth) < 4)
            return setWarning('최소 4칸의 영역을 선택해야합니다.');
        else if (openDetail.category === 3 && (selectHeight * selectWidth) < 6)
            return setWarning('이미지는 최소 6칸의 영역을 선택해야합니다.');
        else if (openDetail.category === 2 && (selectHeight * selectWidth) < 20)
            return setWarning('노트는 최소 20칸이상의 영역을 선택해야합니다.');
        else if (openDetail.category === 2 && (selectHeight < 3 || selectWidth < 4))
            return setWarning('노트는 4x3이상의 영역을 선택해야합니다.');
        let data = {
            x: rPos.x / defaultRectSize,
            y: rPos.y / defaultRectSize,
            width: rectSize.width / defaultRectSize,
            height: rectSize.height / defaultRectSize,
            content: openDetail.content?.content,
            head: openDetail.content?.head,
            paragraph: openDetail.content?.paragraph,
            background_img: openDetail.content?.background_img,
            url: openDetail.content?.url,
        };
        if (openDetail.category === 1) {
            requestURL = `/api/text/${openDetail.id}`;
        } else if (openDetail.category === 2) {
            requestURL = `/api/note/${openDetail.id}`;
        } else if (openDetail.category === 3) {
            requestURL = `/api/image/${openDetail.id}`;
        } else {
            await setWarning('잘못된 접근입니다.');
            await setTimeout(() => {
                setWarning('');
            }, 2000);
            return ;
        }
        await axios.patch(requestURL, data).then(() => {
            dataReval();
        }).catch((e) => {
            setWarning(e.response.data);
            setTimeout(() => {
                setWarning('');
            }, 2000);
        });
        onInitContent();
        setWarning('');
        setCanMove(false);
        initStates();
        axios.patch
    }

    useEffect(() => {
        if (addState !== 0)
            setMenu({
                ...menuState, flg: false
            });
    }, [addState]);

    useEffect(() => {
        let editedContent;
        if (openDetail.category === 1) {
            editedContent = boardData?.TextContents?.find(v => v.id === openDetail.id)?.Comments;
        } else if (openDetail.category === 2) {
            editedContent = boardData?.Notes?.find(v => v.id === openDetail.id)?.Comments;
        } else if (openDetail.category === 3) {
            editedContent = boardData?.Images?.find(v => v.id === openDetail.id)?.Comments;
        }
        if (editedContent)
            setComments(editedContent);
    }, [boardData, openDetail]);

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
                            <img src={openDetail.content?.User.profile_img} />
                            <p>{openDetail.content?.User.username}</p>
                            {( userData.is_admin || (openDetail.content && openDetail.content.UserId === userData.id )) &&
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
                                    <button
                                        onClick={moveMode}
                                    >
                                        <img src="/public/resize.svg" />
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
                                    <pre>
                                        {openDetail.content?.content}
                                    </pre>
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
                                        <pre>
                                            {openDetail.content?.paragraph}
                                        </pre>
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
                                            <p>{moment(c.createdAt).diff(now, 'days') > -1 ? moment(c.createdAt).format('LT') : moment(c.createdAt).format('YYYY년 MM월 DD일')}</p>
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
                    <input
                        type="text"
                        value={commentContent}
                        onChange={OCCC}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                submitComment(e);
                            }
                        }}
                    />
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
                            <AltBox className="alt">
                                {c.User.username}
                            </AltBox>
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
                            <AltBox className="alt">
                                {c.User.username}
                            </AltBox>
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
                            <AltBox className="alt">
                                {c.User.username}
                            </AltBox>
                            <h3 className="head">
                                {c.head}
                            </h3>
                            <pre className="para" style={{height: (defaultRectSize * c.height - 10)}}>
                                <p>{c.paragraph}</p>
                            </pre>
                        </NoteComponent>
                    </ComponentBox>
                )
            })}
            <Stage
                style={{
                    height: height,
                    zIndex: (canMove) ? 20 : 1,
                    background: canMove ? 'rgba(0, 0, 0, .2)' : ''
                }}
                width={width}
                height={height}
                onMouseMove={!canMove ? mouseMove : undefined}
                onMouseDown={!canMove ? mouseDown : undefined}
                onMouseUp={!canMove ? mouseUp : undefined}
            >
                <Layer ref={layerRef}>
                    <Group>
                        <RectOnCanvas x={rPos.x} y={rPos.y}/>
                    </Group>
                </Layer>
            </Stage>
            { canMove &&
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px'
                }}>
                    <OnModeAlt
                        onClick={() => {
                            setCanMove(false);
                            initStates();
                        }}>
                        <span>돌아가기</span>
                        <img src="/public/close.svg" />
                    </OnModeAlt>
                    <OnModeAlt
                        onClick={UpdatePosition}>
                        <span>수정하기</span>
                        <img src="/public/check.svg" />
                    </OnModeAlt>
                    { !isEditSize ?
                        <OnModeAlt
                            onClick={() => setIsEditSize(true)}>
                            <span>크기 변경하기</span>
                            <img src="/public/resize.svg" />
                        </OnModeAlt>
                        :
                        <OnModeAlt className="resize" style={{cursor: 'none'}}>
                            <ResizeRemote>
                                <span>WIDTH -</span>
                                <button
                                    className="decrease"
                                    onClick={() => setRectSize({...rectSize, width: rectSize.width - defaultRectSize })}
                                >
                                    <img src="/public/arrow.svg" />
                                </button>
                                <div>{rectSize.width / defaultRectSize}</div>
                                <button
                                    onClick={() => setRectSize({...rectSize, width: rectSize.width + defaultRectSize})}
                                >
                                    <img src="/public/arrow.svg" />
                                </button>
                            </ResizeRemote>
                            <ResizeRemote>
                                <span>HEIGHT -</span>
                                <button
                                    className="decrease"
                                    onClick={() => setRectSize({...rectSize, height: rectSize.height - defaultRectSize})}
                                >
                                    <img src="/public/arrow.svg" />
                                </button>
                                <div>{rectSize.height / defaultRectSize}</div>
                                <button onClick={() => setRectSize({...rectSize, height: rectSize.height + defaultRectSize})} >
                                    <img src="/public/arrow.svg" />
                                </button>
                            </ResizeRemote>
                        </OnModeAlt>
                    }
                </div>
            }
            <BoardFooter>
                designed by @han
            </BoardFooter>
        </KonvaContainer>
    )
};

interface IChat {
    id: number,
    username: string,
    chat: string
}

const Board:FC = () => {
    const [socket, disconnectSocket] = useSocket(42);
    const { data:userData, revalidate:USERRevalidate } = useSWR<IUser | false>('/api/auth', fetcher);
    const { data:boardData, revalidate:BOARDRevalidate, error:BOARDError } = useSWR<IBoard>(userData ? `/api/board/${42}` : null, fetcher);
    const [menuFlg, setMFlg] = useState<boolean>(false);
    const [userList, setUserList] = useState<IUuserList[] | null | undefined>();
    // const [isOUL, setOUL] = useState(false);
    const [chatData, setChatData] = useState<any[]>();
    const [chat, OCChat, setChat] = useInput('');

    const logout = useCallback(() => {
        axios.post(`/api/logout`).then(() => {
            USERRevalidate();
            window.location.reload(false);
        }).catch((e) => {
            console.error(e);
        });
    }, []);

    const submitMessage = useCallback((e) => {
        e.preventDefault();
        console.log('submit emit');
        userData && socket?.emit('chat', {
            id: userData.id,
            username: userData.username,
            chat: chat
        });
        setChat('');
    }, [userData, chat])

    const onKeydownChat = useCallback((e) => {
        if (e.key === 'Enter') {
            if (!e.shiftKey) {
                e.preventDefault();
                submitMessage(e);
            }
        }
    }, [chat]);

    useEffect(() => {
        return () => {
            console.info('disconnect socket', 42);
            disconnectSocket();
        };
    }, [disconnectSocket]);

    useEffect(() => {
        if (boardData && userData) {
            console.info('로그인');
            socket?.emit('login', { id: userData?.id, username: userData?.username, boards: 42 });
        }
    }, [socket, userData, boardData]);

    useEffect(() => {
        socket?.on('onlineList', async (data: IUuserList[]) => {
            const rmDupData:IUuserList[] = [];
            await data.forEach((elem) => {
                if (!rmDupData.find(v => v.id === elem.id))
                    rmDupData.push(elem);
            });
            setUserList(rmDupData);
        });
        socket?.on('refresh', () => {
            console.log('refresh');
            BOARDRevalidate();
        })
    }, [socket]);

    useEffect(() => {
        socket?.on("newChat", (data:IChat) => {
            console.log(data);
            chatData ? setChatData([...Array.from(chatData), data]) : setChatData([data]);
        });
    }, [socket, chatData])

    if (!userData)
        return <Redirect to="/auth" />

    if (!boardData)
        return <LoadingCircle />

    return (
        <>
        {menuFlg &&
            <DetailBackground
                style={{zIndex: 8}}
                onClick={() => setMFlg(false)}
            />
        }
        <UserMenu
            style={{transform: `translateX(${menuFlg ? '0' : '100%'})`}}
        >
            <MenuContainer>
                <LogOutButton
                    onClick={logout}
                >
                    로그아웃
                </LogOutButton>
                <UserList>
                    <p>User List</p>
                    <ul>
                        {userList?.map((c, i) => {
                            return (
                                <li key={(i)}>
                                    {c.id === userData.id ? `${c.username} (me)` : c.username}
                                </li>
                            );
                        })}
                    </ul>
                </UserList>
                <ChatRoom>
                    {chatData && chatData.map((c, i) => {
                        return (
                            <div key={(i)}>
                                {c.id}
                                {c.username}
                                {c.chat}
                            </div>
                        )
                    })}
                    <ChatForm
                        onSubmit={submitMessage}
                    >
                        <input
                            type="text"
                            onChange={OCChat}
                            onKeyPress={onKeydownChat}
                        />
                    </ChatForm>
                </ChatRoom>
                <div className="up"
                    onClick={() => setMFlg(!menuFlg)}
                >
                    {menuFlg ?
                        <img src="/public/arrow.svg" />
                        :
                        <img src="/public/person.svg" />
                    }
                </div>
            </MenuContainer>
        </UserMenu>
        <WorkSpace
            boardData={boardData}
            dataReval={BOARDRevalidate}
            userData={userData}
        />
        </>
    );
}

export default React.memo(Board);
