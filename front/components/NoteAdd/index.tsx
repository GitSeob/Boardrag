import React, { FC, useRef, useCallback, useState } from 'react';
import axios from 'axios';
import {
    boxProps,
    SubmitButton,
    TextArea,
    AddContainer,
    AddBox,
    NoteAddBox,
    InputBox,
    InputArea,
    ImageInputButton,
    WarnBox
} from '../addStyle';
import useInput from '@hooks/useInput';

interface UploadProps {
    loading: boolean,
    success: boolean,
    imageURL: string,
    message: string,
}

const TextAdd: FC<boxProps> = ({ toast, x, y, width, height, offset, initStates, board }) => {
    const [head, OCHead] = useInput('');
    const [para, OCPara] = useInput('');
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
    }, [uploading]);

    const submitNote = useCallback(async () => {
        setUploading({
            ...uploading,
            loading: true,
        })
        await axios.post(`/api/board/${board}/write/note`, {
            background_img: uploading.imageURL,
            head: head,
            paragraph: para,
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
            setUploading({
                ...uploading,
                loading: false,
                message: e.response.data.reason
            })
        });
    }, [uploading, para, head]);

    return (
        <AddContainer y={y} x={x} width={width} height={height}>
            { uploading.message === '' ?
                <AddBox className="note">
                    <NoteAddBox src={
                        uploading.imageURL !== '' ? uploading.imageURL : null
                    }>
                        <InputBox
                            size={height / offset.height}
                        >
                            <InputArea
                                key="headerInput"
                                type="text"
                                placeholder="타이틀을 입력해주세요."
                                value={head}
                                onChange={OCHead}
                            />
                        </InputBox>
                        <InputBox
                            size={height - (height / offset.height) - 20}
                        >
                            <TextArea
                                value={para}
                                onChange={OCPara}
                                autoFocus={true}
                                placeholder="본문 내용을 입력해주세요."
                                style={{
                                    textAlign: 'left'
                                }}
                            />
                        </InputBox>
                    </NoteAddBox>
                    <SubmitButton
                        size={width / offset.width}
                        onClick={submitNote}
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
