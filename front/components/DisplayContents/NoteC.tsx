import React, { FC, useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import useInput from '@hooks/useInput';
import { ImageBox, HeadBox, TextBox, EditArea, EditButtonBox, EditHead, EditImageBox } from './style';
import ImageEditButton from '@components/ImageEditButton';

interface ITF {
	isEdit: boolean;
	content: string | null | undefined;
	url: string | undefined;
	head: string | null | undefined;
	setEdit(flg: boolean): void;
	onSubmitEdit: (text: string, head: string, url: string) => void;
	board: string;
}

interface UploadProps {
	loading: boolean;
	success: boolean;
	imageURL: string;
	message: string;
}

const NoteC: FC<ITF> = ({ isEdit, head, content, url, onSubmitEdit, setEdit, board }: ITF) => {
	const [text, setText] = useState('');
	const [editHead, OCHead, setHead] = useInput('');
	const [TAH, setTAH] = useState('auto');
	const [uploading, setUploading] = useState<UploadProps>({
		loading: false,
		success: false,
		imageURL: '',
		message: '',
	});
	const textScrollRef = useRef() as React.MutableRefObject<HTMLTextAreaElement>;
	const imageInput = useRef() as React.MutableRefObject<HTMLInputElement>;

	const onClickImageUpload = useCallback(() => {
		imageInput.current.click();
	}, []);

	const OCText = React.useCallback(
		(e) => {
			setTAH(`${textScrollRef.current.scrollHeight}px`);
			setText(e.target.value);
		},
		[textScrollRef],
	);

	const onChangeImg = useCallback(
		async (e) => {
			const imageFormData = new FormData();
			imageFormData.append('image', e.target.files[0]);
			await setUploading({
				...uploading,
				loading: true,
			});
			await axios
				.post(`/api/uploadImage?type=upload&board=${board}&contentName=note`, imageFormData, {
					headers: { 'Access-Control-Allow-Origin': '*' },
				})
				.then((res) => {
					setUploading({
						...uploading,
						success: true,
						loading: false,
						imageURL: res.data.url,
					});
				})
				.catch((e) => {
					setUploading({
						...uploading,
						loading: false,
						message: e.response.data,
					});
				});
		},
		[board, uploading],
	);

	useEffect(() => {
		setText(typeof content === 'string' ? content : '');
		setHead(typeof head === 'string' ? head : '');
		setUploading({
			...uploading,
			imageURL: typeof url === 'string' ? url : '',
		});
	}, [isEdit, content, head]);

	if (isEdit) {
		return (
			<>
				<EditImageBox>
					{uploading.imageURL !== '' ? <img src={uploading.imageURL} /> : <div className="temp" />}
					<ImageEditButton onClick={onClickImageUpload} imageInput={imageInput} onChangeImg={onChangeImg} />
				</EditImageBox>
				<EditHead type="text" value={editHead} onChange={OCHead} />
				<EditArea>
					<textarea value={text} onChange={OCText} ref={textScrollRef} style={{ height: TAH }} />
				</EditArea>
				<EditButtonBox>
					<div
						className="button edit"
						onClick={() => {
							onSubmitEdit(text, editHead, uploading.imageURL);
						}}
					>
						수정
					</div>
					<div
						className="button"
						onClick={() => {
							setEdit(false);
						}}
					>
						취소
					</div>
				</EditButtonBox>
			</>
		);
	}
	return (
		<>
			{url && <ImageBox src={url} />}
			<HeadBox>
				<h2>{head}</h2>
			</HeadBox>
			<TextBox>{content}</TextBox>
		</>
	);
};

export default NoteC;
