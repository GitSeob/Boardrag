import React, {FC, MutableRefObject, ChangeEvent} from 'react';
import {EditImageInput} from './style';

interface IIEB {
	imageInput: MutableRefObject<HTMLInputElement>,
	onChangeImg: ( e:ChangeEvent<HTMLInputElement>) => void,
	onClick: () => void,
}

const ImageEditButton:FC<IIEB> = ({ imageInput, onChangeImg, onClick}) => {
	return (
		<EditImageInput
			onClick={onClick}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="black"
				width="18px"
				height="18px"
			>
				<path d="M0 0h24v24H0z" fill="none" />
				<path d="M0 0h24v24H0V0z" fill="none" />
				<path d="M18 13v7H4V6h5.02c.05-.71.22-1.38.48-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-5l-2-2zm-1.5 5h-11l2.75-3.53 1.96 2.36 2.75-3.54zm2.8-9.11c.44-.7.7-1.51.7-2.39C20 4.01 17.99 2 15.5 2S11 4.01 11 6.5s2.01 4.5 4.49 4.5c.88 0 1.7-.26 2.39-.7L21 13.42 22.42 12 19.3 8.89zM15.5 9C14.12 9 13 7.88 13 6.5S14.12 4 15.5 4 18 5.12 18 6.5 16.88 9 15.5 9z" />
			</svg>
			<p>이미지 변경하기</p>
			<input
				style={{
					width: 0,
					height: 0,
				}}
				type="file"
				accept=".gif, .jpg, .png"
				ref={imageInput}
				onChange={onChangeImg}
			/>
		</EditImageInput>
	)
}

export default ImageEditButton;
