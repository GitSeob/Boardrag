export interface IUser {
    id: number,
    username: string,
    profile_img: string,
    is_admin: boolean
}

export interface Comment {
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

export interface RectSize {
    width: number,
    height: number,
}

export interface MenuPosition {
    x: number,
    y: number,
    flg: boolean,
    disp: boolean,
}

export interface DetailProps {
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

export interface Position {
    x: number,
    y: number
}
