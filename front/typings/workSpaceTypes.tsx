import { IBM, IBoard } from './datas';

export type Position = {
	x: number;
	y: number;
};

export type MenuPosition = {
	x: number;
	y: number;
	flg: boolean;
	disp: boolean;
};

export type DraggedRect = {
	x: number;
	y: number;
	dragged: boolean;
};

export type RectSize = {
	width: number;
	height: number;
};

export type Offset = {
	width: number;
	height: number;
	x: number;
	y: number;
};

export interface IBoardProps {
	boardData: IBoard | undefined;
	userData: IBM;
	dataReval: () => void;
	board: string;
}
