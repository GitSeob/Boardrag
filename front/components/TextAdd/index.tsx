import React, { FC, useCallback, useRef, useState } from 'react';
// import toast from 'react-toastify';
import {
    boxProps,
    SubmitButton,
    TextArea,
    AddContainer,
    AddBox,
    WarnBox
} from '../addStyle';
import axios from 'axios';

type PostState = {
    loading: boolean,
    success: boolean,
    warning: string,
}

const TextAdd: FC<boxProps> = ({ toast, x, y, width, height, offset, initStates, board }) => {
    const [value, setValue] = useState('');
    const [postState, setPostState] = useState<PostState>({
        loading: false,
        success: false,
        warning: '',
    })
    const textScrollRef = useRef() as React.MutableRefObject<HTMLTextAreaElement>;
    const [TAH, setTAH] = useState('auto');

    const OCValue = useCallback((e) => {
        setTAH(`${textScrollRef.current.scrollHeight}px`);
        setValue(e.target.value);
    }, [textScrollRef]);

    const writeText = useCallback(async (e) => {
        e.preventDefault();
        setPostState({ ...postState, loading: true});
        await axios.post(`/api/board/${board}/write/text`, {
            content: value,
            x: offset.x,
            y: offset.y,
            width: offset.width,
            height: offset.height,
        }).then(res => {
            if (res.status === 202)
            {
                setPostState({ ...postState, warning: res.data.reason});
                return setTimeout(() => {
                    setPostState({ ...postState, warning: ''});
                }, 2000);
            }
            setPostState({...postState, loading: false, success: true});
            toast.dark(`남은 칸은 ${res.data}칸 입니다.`);
            initStates();
        }).catch((e) => {
            setPostState({...postState, loading: false, warning: e.response.data.reason});
            setTimeout(() => {
                setPostState({ ...postState, warning: ''});
            }, 2000);
        });
    }, [value, postState]);

    return (
        <AddContainer y={y} x={x} width={width} height={height}>
            { postState.warning === '' ?
                <AddBox>
                    { !postState.loading ?
                        <TextArea
                            style={{
                                height: TAH
                            }}
                            value={value}
                            onChange={OCValue}
                            autoFocus={true}
                            ref={textScrollRef}
                        />
                        :
                        <div>
                            loading...
                        </div>
                    }
                    <SubmitButton
                        size={width / offset.width}
                        onClick={writeText}
                        right={offset.x + offset.width < 32 ? -5 : width}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                    </SubmitButton>
                </AddBox>
                :
                <WarnBox>
                    {postState.warning}
                </WarnBox>
            }
        </AddContainer>
    );
}

export default TextAdd;
