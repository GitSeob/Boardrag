import React, { FC } from 'react';
import {
	CContainer,
	ImageBox,
} from './style';

interface ITF {
	isEdit:boolean,
	url: string | undefined,
}

const ImageC:FC<ITF> = ({isEdit, url}) => {
	//if (isEdit)
	//	return (
	//		<CContainer>

	//		</CContainer>
	//	);
	return (
		<ImageBox src={url} />
	);
}

export default ImageC;
