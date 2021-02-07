import React, { FC, MutableRefObject, useRef, useCallback, useState, useEffect } from 'react';
import {
	TextBox,
	EditArea,
	EditButtonBox
} from './style';

interface ITF {
	isEdit:boolean,
	content: string | null | undefined,
	setEdit(flg: boolean): void,
	onSubmitEdit: (text: string, head: string, url: string) => void,
	board: string,
}

const TextC:FC<ITF> = ({ content, isEdit, setEdit, onSubmitEdit, board }) => {
	const [text, setText] = useState('');
	const [TAH, setTAH] = useState('auto');
	const textScrollRef = useRef() as React.MutableRefObject<HTMLTextAreaElement>;

	const OCText = React.useCallback((e) => {
		setTAH(`${textScrollRef.current.scrollHeight}px`);
		setText(e.target.value);
	}, [textScrollRef]);

	useEffect(() => {
		setText(typeof content === 'string' ? content : "");
	}, [isEdit]);

	if (isEdit)
	{
		return (
			<>
			<EditArea>
				<textarea
					value={text}
					onChange={OCText}
					ref={textScrollRef}
					style={{height: TAH}}
				/>
			</EditArea>
			<EditButtonBox>
				<div
					className="button edit"
					onClick={() => {onSubmitEdit(text, "", "") }}
				>수정</div>
				<div
					className="button"
					onClick={() => { setEdit(false); }}
				>취소</div>
			</EditButtonBox>
			</>
		);
	}
	return (
		<TextBox>
			{content}
		</TextBox>
	);
}

export default TextC;
