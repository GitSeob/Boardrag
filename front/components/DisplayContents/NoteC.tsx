import React, { FC } from 'react';
import {
	CContainer,
	ImageBox,
	HeadBox,
	TextBox
} from './style';

interface ITF {
	isEdit:boolean,
	content: string | null | undefined,
	url: string | undefined,
	head: string | null | undefined,
}

const NoteC:FC<ITF> = ({isEdit, head, content, url}) => {
	//if (isEdit)
	//	return (
	//		<CContainer>

	//		</CContainer>
	//	);
	return (
		<>
			<ImageBox src={url} />
			<HeadBox>
				<h2>{head}</h2>
			</HeadBox>
			<TextBox>
				{content}
			</TextBox>
		</>
	);
}

export default NoteC;
