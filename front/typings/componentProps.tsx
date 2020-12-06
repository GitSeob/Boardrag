import { Position, DetailProps, IUser, RectSize, MenuPosition, Comment } from '@typings/datas';

export interface IDetail {
    category: number,
    id: number,
    flg: boolean,
    loadComment: boolean,
    content: DetailProps | null
}

export interface DetailContainerProps {
    openDetail: IDetail,
    userData: IUser,
    defaultRectSize: number,
    menuState: MenuPosition,
    comments: Comment[],
    setOpenDetail: (openDetail:IDetail) => void,
    setMenu: (menuState: MenuPosition) => void,
    setRPos: (rPos:Position) => void,
    setRectSize: (rectSize:RectSize) => void,
    setWarning: (warn:string) => void,
    onInitContent: () => void,
    dataReval: () => void,
}
