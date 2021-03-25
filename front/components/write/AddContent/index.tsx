import React from 'react';
import { MenuPosition, Offset, Position, RectSize } from '@typings/workSpaceTypes';
import { MenuBox, MenuAttr } from './style';
import ImageAdd from '@components/write/ImageAdd';
import TextAdd from '@components/write/TextAdd';
import NoteAdd from '@components/write/NoteAdd';

interface IAddContent {
	board: string;
	BMID: number;
	addState: number;
	menuState: MenuPosition;
	rectSize: RectSize;
	rPos: Position;
	offset: Offset;
	initStates: () => void;
	openAddComponent(index: number): void;
	toast: any;
}

const AddContent = ({
	board,
	BMID,
	addState,
	menuState,
	rectSize,
	rPos,
	offset,
	initStates,
	openAddComponent,
	toast,
}: IAddContent) => {
	return (
		<>
			<MenuBox clicked={menuState.flg} x={menuState.x} y={menuState.y} disp={menuState.disp}>
				<MenuAttr onClick={() => openAddComponent(1)}>Text</MenuAttr>
				<MenuAttr onClick={() => openAddComponent(2)}>Note</MenuAttr>
				<MenuAttr onClick={() => openAddComponent(3)}>Image</MenuAttr>
			</MenuBox>
			{addState === 1 && (
				<TextAdd
					toast={toast}
					width={rectSize.width}
					height={rectSize.height}
					x={rPos.x}
					y={rPos.y}
					offset={offset}
					initStates={initStates}
					board={board}
					BMID={BMID}
				/>
			)}
			{addState === 2 && (
				<NoteAdd
					toast={toast}
					width={rectSize.width}
					height={rectSize.height}
					x={rPos.x}
					y={rPos.y}
					offset={offset}
					initStates={initStates}
					board={board}
					BMID={BMID}
				/>
			)}
			{addState === 3 && (
				<ImageAdd
					toast={toast}
					width={rectSize.width}
					height={rectSize.height}
					x={rPos.x}
					y={rPos.y}
					offset={offset}
					initStates={initStates}
					board={board}
					BMID={BMID}
				/>
			)}
		</>
	);
};

export default AddContent;
