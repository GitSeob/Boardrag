import React, { FC } from 'react';
import {
	TextBox
} from './style';

interface ITF {
	isEdit:boolean,
	content: string | null | undefined
}

const TextC:FC<ITF> = ({ content }) => {
	//if (isEdit)
	//	return (
	//		<CContainer>

	//		</CContainer>
	//	);
	return (
		<TextBox>
			{content}
		</TextBox>
	);
}

export default TextC;
