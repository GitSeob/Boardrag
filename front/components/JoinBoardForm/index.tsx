import React, {FC, useState, useCallback} from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);

import {
    IBL, IUser
} from '@typings/datas';
import {
    Box,
    FLEXDIV,
    PageButton,
    Input
} from './style';
import { PersonCount } from '@layouts/Main/style';
import { ProfileImageBox } from '@components/CreateBoardForm/style'

import useInput from '@hooks/useInput';
import LoadingBall from '@components/LoadingBall';
interface IJBF {
    board: IBL | null,
    userData: IUser
}

const JoinBoardForm:FC<IJBF> = ({ board, userData}) => {
    const [pw, OCPW] = useInput('');
    const [nickname, OCNN] = useInput(userData.username);
    const [page, setPage] = useState(0);
    const [warn, setWarn] = useState('');
    const [result, setResult] = useState({
        loading: false,
        success: false,
        error: '',
        boardName: ''
    })
    const [profileImage, setPI] = useState({
        url: '',
        loading: false,
    });
    const imageInput = React.useRef() as React.MutableRefObject<HTMLInputElement>;

    const onClickImageUpload = useCallback(() => {
		imageInput.current.click();
    }, [imageInput.current]);

    const onChangeProfileImg = useCallback( async (e) => {
		const imageFormData = new FormData();
        imageFormData.append('image', e.target.files[0]);
        await setPI({
            ...profileImage,
            loading: true
        });
		await axios.post(`/api/uploadProfileImage?name=${board?.name}`, imageFormData).then(res => {
            setPI({
                url: res.data.url,
                loading: false
            });
        }).catch(e => {
            setPI({
                ...profileImage,
                loading: false,
            });
        })
    }, [board]);

    const requestJoin = async () => {
        setPage(3);
        setWarn('');
        setResult({
            ...result,
            loading: true
        });
        await axios.post(`/api/join/${board?.name}`, {
            pw, nickname
        }).then(res => {
            setResult({
                ...result,
                loading: false,
                success: true,
                boardName: res.data
            })
        }).catch(e => {
            setResult({
                ...result,
                loading: false,
                error: e.response.data
            })
        });
    }

    if (!board)
        return <Redirect to="/main" />
    if (page < 3) {
        return (
            <>
                <Box
                    style={{
                        left: `${50 - 100 * page}%`
                    }}
                >
                    <div>
                        <div
                            style={{
                                position: "relative",
                                paddingRight: "3rem",
                                marginBottom: ".5rem",
                            }}
                        >
                            <p>보드 이름</p>
                            <h2>{board.name}</h2>
                            <PersonCount
                                style={{
                                    position: "absolute",
                                    bottom: 0,
                                    right: 0,
                                }}
                            >
                                {board.is_lock && <img src="/public/lock.svg" /> }
                                <img src="/public/person.svg"/> {board.memberCount}
                            </PersonCount>
                        </div>
                        <FLEXDIV>
                            <p>최근 활동 시간 : {dayjs(board.recent_time).format("YYYY.MM.DD LT")}</p>
                        </FLEXDIV>
                        <p>보드 설명</p>
                        <div className="description">{board.description}</div>
                        <PageButton
                            onClick={() => { setPage(1) }}
                        >
                            참가
                        </PageButton>
                    </div>
                </Box>
                <Box
                    style={{
                        left: `${150 - 100 * page}%`,
                    }}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column"
                        }}
                    >
                        <p
                            style={{
                                textAlign: "center"
                            }}>
                            보드에서 사용할 프로필 이미지를 업로드해주세요.
                        </p>
                        <ProfileImageBox>
                            {profileImage.loading ? (
                                "loading..."
                            ) : (
                                <div
                                    style={profileImage.url !== '' ? {
                                        backgroundImage: `url(${profileImage.url})`,
                                    } : {
                                        background: `linear-gradient(#002534 , #090a0f) no-repeat`
                                    }}
                                >
                                    {profileImage.url === '' && <img src="/public/person.svg" />}
                                    <button onClick={onClickImageUpload}>
                                        <img src="/public/camera.svg" style={{ color: 'white' }} />
                                    </button>
                                    <input
                                        type="file"
                                        accept=".jpg, .png"
                                        ref={imageInput}
                                        onChange={onChangeProfileImg}
                                    />
                                </div>
                            )}
                        </ProfileImageBox>
                        <p
                            style={{
                                textAlign: "center",
                                marginTop: "1rem"
                            }}
                        >보드에서 사용할 닉네임을 입력해주세요.</p>
                        <Input
                            type="text"
                            className="nickname"
                            value={nickname}
                            onChange={OCNN}
                            placeholder="Board에서 사용할 닉네임을 입력해주세요."
                        />
                        { warn && <p style={{color: "#ff4444", textAlign: "center"}}>{warn}</p>}
                        <PageButton
                            onClick={() => {
                                if (nickname.trim().length < 2)
                                    return setWarn("닉네임은 2자 이상으로 설정해야합니다.");
                                if (board.is_lock)
                                    setPage(2);
                                else
                                    setPage(3);
                                setWarn('');
                            }}
                        >
                            {board.is_lock ? "다음" : "참여하기" }
                        </PageButton>
                    </div>
                </Box>
                <Box
                    style={{
                        left: `${250 - 100 * page}%`
                    }}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column"
                        }}
                    >
                        <p>해당 보드는 비공개 보드입니다.</p>
                        <p>참여하시려면 비밀번호를 입력해주세요.</p>
                        <Input
                            type="password"
                            value={pw}
                            onChange={OCPW}
                            onKeyPress={(e) => {
                                if(e.key === "Enter")
                                {
                                    if (pw.length > 7) {
                                        requestJoin();
                                    }
                                    else
                                        setWarn("비밀번호는 8자 이상입니다.");
                                }
                            }}
                        />
                        { warn && <p style={{color: "#ff4444", textAlign: "center"}}>{warn}</p>}
                        <PageButton
                            onClick={() => {
                                if (pw.length > 7) {
                                    requestJoin();
                                }
                                else
                                    setWarn("비밀번호는 8자 이상입니다.");
                            }}
                        >
                            참여하기
                        </PageButton>
                    </div>
                </Box>
            </>
        );
    }
    else {
        if (result.loading)
            return (<LoadingBall />)
        else if (result.success) {
            return (
                <Box>
                    <p style={{ textAlign: "center" }}>보드에 참여되었습니다.</p>
                    <PageButton
                        onClick={() => {
                            location.href = `/board/${result.boardName}`
                        }}
                    >
                        "{result.boardName}" 보드로 이동하기
                    </PageButton>
                </Box>
            );
        }
        return (
            <Box>
                실패 ㅠㅠ
                <PageButton
                    onClick={() => {
                        if (board.is_lock)
                            setPage(2);
                        else
                            setPage(1)
                    }}
                >
                    뒤로가기
                </PageButton>
            </Box>
        )
    }
}

export default JoinBoardForm;
