export interface IUser {
	id: number;
	username: string;
	profile_img: string;
	is_admin: boolean;
}

export interface Comment {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	TextContentId: null | number;
	ImageId: null | number;
	NoteId: null | number;
	BoardId: number;
	deletedAt: Date;
	content: string;
	content_category: number;
	content_id: number;
	User: IUser;
}

export interface RectSize {
	width: number;
	height: number;
}

export interface MenuPosition {
	x: number;
	y: number;
	flg: boolean;
	disp: boolean;
}

export interface Position {
	x: number;
	y: number;
}

export interface IBoard {
	id: number;
	name: string;
	AdminId: number;
	TextContents: IText[];
	Images: IImage[];
	Notes: INote[];
	background: string;
}

export interface IBM {
	id: number;
	username: string;
	profile_img: string;
	avail_blocks: number;
	UserId: number;
	BoardId: number;
}

export interface IText {
	id: number;
	x: number;
	y: number;
	width: number;
	height: number;
	content: string;
	UserId: number;
	createdAt: Date;
	updatedAt: Date;
	expiry_date: Date;
	Comments: IComment[];
	BoardMember: IBM;
	BoardMemberId: number;
}

export interface IImage {
	id: number;
	x: number;
	y: number;
	width: number;
	height: number;
	url: string;
	UserId: number;
	createdAt: Date;
	updatedAt: Date;
	expiry_date: Date;
	Comments: IComment[];
	BoardMember: IBM;
	BoardMemberId: number;
}

export interface INote {
	id: number;
	x: number;
	y: number;
	width: number;
	height: number;
	head: string;
	paragraph: string;
	background_img: string;
	UserId: number;
	createdAt: Date;
	updatedAt: Date;
	expiry_date: Date;
	Comments: IComment[];
	BoardMember: IBM;
	BoardMemberId: number;
}

export interface IComment {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	TextContentId: null | number;
	ImageId: null | number;
	NoteId: null | number;
	BoardId: number;
	deletedAt: Date;
	content: string;
	content_category: number;
	content_id: number;
	BoardMember: IUser;
	BoardMemberId: number;
}

export interface IDetail {
	category: number;
	id: number;
	flg: boolean;
	loadComment: boolean;
	content: DetailProps | null;
}

export interface DetailProps {
	id: number;
	x: number;
	y: number;
	width: number;
	height: number;
	createdAt: Date;
	updatedAt: Date;
	expiry_date: Date;
	BoardMemberId: number;
	content: null | string;
	head: null | string;
	paragraph: null | string;
	url: string;
	background_img: string;
	Comments: IComment[];
	BoardMember: IBM;
}

export interface IBL {
	id: number;
	name: string;
	description: string;
	is_lock: boolean;
	memberCount: number;
	background: string;
	recent_time: Date;
	AdminId: number;
	Member: IBM[];
}

export interface IUserList {
	id: number;
	username: string;
}
