import React, { FC } from 'react';
import { IDetail } from '@typings/datas';
import TextC from '@components/board/DisplayContents/TextC';
import NoteC from '@components/board/DisplayContents/NoteC';
import ImageC from '@components/board/DisplayContents/ImageC';

interface IContentDetail {
	openDetail: IDetail;
	isEdit: boolean;
	setEdit(flg: boolean): void;
	onSubmitEdit: (text: string, head: string, url: string) => void;
	board: string;
}

const ContentDetail: FC<IContentDetail> = ({ openDetail, isEdit, setEdit, onSubmitEdit, board }) => {
	if (openDetail.content === undefined) return <></>;
	if (openDetail.category == 1) {
		return (
			<TextC
				isEdit={isEdit}
				setEdit={setEdit}
				onSubmitEdit={onSubmitEdit}
				content={openDetail.content?.content}
			/>
		);
	} else if (openDetail.category == 2) {
		return (
			<NoteC
				isEdit={isEdit}
				setEdit={setEdit}
				onSubmitEdit={onSubmitEdit}
				content={openDetail.content?.paragraph}
				head={openDetail.content?.head}
				url={openDetail.content?.background_img}
				board={board}
			/>
		);
	} else if (openDetail.category == 3) {
		return (
			<ImageC
				isEdit={isEdit}
				setEdit={setEdit}
				onSubmitEdit={onSubmitEdit}
				url={openDetail.content?.url}
				board={board}
			/>
		);
	} else return <></>;
};

export default ContentDetail;
