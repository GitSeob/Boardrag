import React, { FC, useRef, useCallback, useState } from 'react';
import useSocket from '@hooks/useSocket';
import axios from 'axios';
import {
    boxProps,
    SubmitButton,
    ImageInputButton,
    ImageAddBox,
    AddContainer,
    AddBox,
    WarnBox
} from '../addStyle';
import { Redirect } from 'react-router-dom';

interface UploadProps {
    loading: boolean,
    success: boolean,
    imageURL: string,
    message: string,
}

const TextAdd: FC<boxProps> = ({ toast, x, y, width, height, offset, initStates, board }) => {
    const imageInput = useRef() as React.MutableRefObject<HTMLInputElement>;
    const [uploading, setUploading] = useState<UploadProps>({
        loading: false,
        success: false,
        imageURL: '',
        message: '',
    });

	const onClickImageUpload = useCallback(() => {
		imageInput.current.click();
    }, [imageInput.current]);

    const onChangeImg = useCallback( async (e) => {
		const imageFormData = new FormData();
        imageFormData.append('image', e.target.files[0]);
        await setUploading({
            ...uploading,
            loading: true
        });
		await axios.post('/api/uploadImage', imageFormData).then(res => {
            setUploading({
                ...uploading,
                success: true,
                loading: false,
                imageURL: res.data.url
            });
        }).catch(e => {
            setUploading({
                ...uploading,
                loading: false,
                message: e.response.data
            });
        })
	}, []);

    const submitImage = useCallback(async () => {
        setUploading({
            ...uploading,
            loading: true,
        })
        await axios.post(`/api/board/${board}/write/image`, {
            url: uploading.imageURL,
            x: offset.x,
            y: offset.y,
            width: offset.width,
            height: offset.height,
        }).then(res => {
            if (res.status === 202) {
                setUploading({
                    ...uploading,
                    loading: false,
                    message: res.data.reason
                });
                return setTimeout(() => {
                    setUploading({ ...uploading, message: ''});
                }, 2000);
            }
            setUploading({
                ...uploading,
                loading: false,
                success: true
            });
            toast.dark(`남은 칸은 ${res.data}칸 입니다.`);
            initStates();
        }).catch((e) => {
            if (e.response.status === 401)
            {
                alert('로그인을 해주세요.');
                <Redirect to="/auth" />
            }
            setUploading({
                ...uploading,
                loading: false,
                message: e.response.data.reason
            })
        });
    }, [uploading]);

    return (
        <AddContainer y={y} x={x} width={width} height={height}>
            { uploading.message === '' ?
                <AddBox>
                    { uploading.imageURL === '' ?
                        <ImageAddBox>오른쪽 버튼을 클릭해서 사진을 업로드해주세요.</ImageAddBox>
                        :
                        <img src={uploading.imageURL} />
                    }
                    <SubmitButton
                        size={width / offset.width}
                        onClick={submitImage}
                        right={offset.x + offset.width < 32 ? -5 : width}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                    </SubmitButton>
                    <ImageInputButton
                        onClick={onClickImageUpload}
                        size={width / offset.width}
                        right={offset.x + offset.width < 32 ? -5 : width}
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
                    </ImageInputButton>
                </AddBox>
            :
                <WarnBox>
                    {uploading.message}
                </WarnBox>
            }
        </AddContainer>
    );
}

export default TextAdd;
