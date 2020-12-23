import React, {FC, useState} from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

import {
    IBL, IUser
} from '@typings/datas';
import {
    Box
} from './style';
import useInput from '@hooks/useInput';

interface IJBF {
    board: IBL | null,
    userData: IUser
}

const JoinBoardForm:FC<IJBF> = ({ board, userData}) => {
    const [pw, OCPW] = useInput('');
    const [nickname, OCNN] = useInput(userData.username);
    const [result, setResult] = useState({
        loading: false,
        success: false,
        error: '',
        boardName: ''
    })
    const requestJoin = async () => {
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
    return (
        <>
            <Box>
                <h2>{board.name}</h2>
                <div className="description">{board.description}</div>
                { result.loading ?
                    <div>loading...</div>
                    :
                    <>
                        <p>보드에서 사용하실 닉네임을 설정해주세요.</p>
                        <input
                            type="text"
                            value={nickname}
                            onChange={OCNN}
                        />
                        { board.is_lock ?
                            <>
                                <div className="row">
                                    <img src="/public/lock.svg"/>
                                    <p>이 보드는 비공개 보드입니다.</p>
                                </div>
                                <p>접속하시려면 비밀번호를 입력해주세요.</p>
                                <input type="password"
                                    value={pw}
                                    onChange={OCPW}
                                />
                            </>
                            :
                            <div>
                                이 보드는 공개 보드입니다.
                            </div>
                        }
                        <button
                            onClick={() => { requestJoin() }}
                        >
                            JOIN
                        </button>
                    </>
                }
            </Box>
        </>
    );
}

export default JoinBoardForm;
