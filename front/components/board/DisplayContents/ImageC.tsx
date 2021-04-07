import React, { FC, useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { EditImageBox, EditButtonBox, ImageBox } from './style';
import ImageEditButton from '@components/write/ImageEditButton';

interface ITF {
	isEdit: boolean;
	url: string | undefined;
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

const ImageC: FC<ITF> = ({ isEdit, url, setEdit, onSubmitEdit, board }: ITF) => {
	const [uploading, setUploading] = useState<UploadProps>({
		loading: false,
		success: false,
		imageURL: '',
		message: '',
	});
	const imageInput = useRef() as React.MutableRefObject<HTMLInputElement>;

	const onClickImageUpload = useCallback(() => {
		imageInput.current.click();
	}, []);

	const onChangeImg = async (e: any) => {
		const imageFormData = new FormData();
		imageFormData.append('image', e.target.files[0]);
		await setUploading({
			...uploading,
			loading: true,
		});
		await axios
			.post(`/api/uploadImage?type=upload&board=${board}&contentName=image`, imageFormData, {
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
	};

	useEffect(() => {
		setUploading({
			...uploading,
			imageURL: typeof url === 'string' ? url : '',
		});
	}, [isEdit, url]);

	if (isEdit) {
		return (
			<>
				<EditImageBox>
					{uploading.imageURL !== '' ? <img src={uploading.imageURL} /> : <div className="temp" />}
					<ImageEditButton onClick={onClickImageUpload} imageInput={imageInput} onChangeImg={onChangeImg} />
				</EditImageBox>
				<EditButtonBox>
					<div
						className="button edit"
						onClick={() => {
							onSubmitEdit('', '', uploading.imageURL);
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
	return <ImageBox src={url} />;
};

export default ImageC;
