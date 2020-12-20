import React, {FC, useState, useCallback, Children} from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import LoadingCircle from '@components/LoadingCircle';
import { Redirect } from 'react-router-dom';
import { IUser, IBoard } from '@typings/datas';
import {
    Menu,
    Container,
    RelBox,
    BoardContainer,
    BoardCard,
    BCHeader,
    SearchForm,
    DarkBackground,
    FormBox,
    PageButtonBox,
    LoadingBalls
} from './style';
import useInput from '@hooks/useInput';

interface IBL {
    name: string,
    description: string,
    is_lock: boolean,
    memberCount: number
}

interface ITCC {
    setValue: (data:boolean) => void
}

const LoadingBall = () => {
	return (
		<div>
			<LoadingBalls>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</LoadingBalls>
		</div>
	);
};

const TopComponentContainer:FC<ITCC> = ({ children, setValue }) => {
    return (
        <>
        <DarkBackground
            onClick={() => { setValue(false) }}
        />
        {children}
        </>
    )
}

interface ICBF {
    BLRevalidate: () => void,
    username: string
}

const CreateBoardForm:FC<ICBF> = ({ BLRevalidate, username }) => {
    const [title, OCTitle] = useInput('');
    const [des, OCDes] = useInput('');
    const [defaultBlocks, OCDB] = useInput(30);
    const [ETime, OCETime] = useInput(14);
    const [pw, OCPW] = useInput('');
    const [is_lock, set_lock] = useState(false);
    // const [tags, setTags] = useState([]);
    const [pageState, setPS] = useState(0);
    const [aniCN, setAniCN] = useState('next');
    const [warn, setWarn] = useState('');
    const [nickName, OCNN] = useInput(username);
    const [createState, setCS] = useState({
        loading: false,
        success: false,
        error: ''
    });

    const NextPage = () => {
        if (pageState === 0 && (title.trim() === '' || des.trim() === ''))
            return setWarn('작성되지 않은 항목이 있습니다.');
        else if (pageState === 0 && title.length < 2 )
            return setWarn('Board 이름은 최소 2자 이상으로 설정해야합니다.');
        else if (pageState === 0) {
            return axios.get(`/api/checkBoardName/${title}`).then(res => {
                if (res)
                {
                    setWarn('');
                    setAniCN('next');
                    setPS(pageState + 1);
                }
                else
                    setWarn('이미 존재하는 Board name입니다.');
            }).catch(e => { setWarn( e.response.data )});
        } else if (pageState === 2 && (is_lock && pw.length < 8)) {
            return setWarn('비밀번호는 최소 8자 이상으로 설정해야합니다.');
        }
        setWarn('');
        setAniCN('next');
        if (pageState === 3)
        {
            setCS({
                ...createState,
                loading: true,
            });
            axios.post(`/api/createBoard`, {
                title, des, defaultBlocks, is_lock, pw, ETime, nickName
            }).then(() => {
                setCS({
                    ...createState,
                    loading: false,
                    success: true,
                })
                BLRevalidate();
            }).catch(e => {
                setCS({
                    ...createState,
                    loading: false,
                    error: e.response.data
                })
            })
        }
        setPS(pageState + 1);
    };

    return (
        <>
            <FormBox>
                <h2>New Board</h2>
                <div className={`${pageState === 0 ? aniCN : ""}`}>
                    <p>Board Name</p>
                    <input
                        type="text"
                        value={title}
                        onChange={OCTitle}
                        placeholder="Board 이름을 정해주세요."
                    />
                    <p>Board Description</p>
                    <input
                        type="text"
                        value={des}
                        onChange={OCDes}
                        placeholder="Board 설명을 작성해주세요."
                    />
                    {warn !== '' && <p className="warn">{warn}</p> }
                </div>
                <div className={`${pageState === 1 ? aniCN : ""}`}>
                    <p>Availble Blocks</p>
                    <p className="info">각 사용자별 할당할 블럭 수를 설정해주세요. (기본 30칸)</p>
                    <p className="info">Board는 '32 x 20' 크기로 최대 640칸입니다.</p>
                    <input
                        type="number"
                        value={defaultBlocks}
                        onChange={OCDB}
                        placeholder="각 사용자별 할당할 블럭 수를 설정해주세요. (기본 30칸)"
                        min="0"
                        max="640"
                    />
                    <p>Expiry Days</p>
                    <p className="info">블럭 등록 일 수를 설정해주세요.(최대 60일)</p>
                    <p className="info">0으로 설정하면 블럭이 삭제되지 않도록 설정됩니다.</p>
                    <input
                        type="number"
                        value={ETime}
                        onChange={OCETime}
                        min="0"
                        max="60"
                    />
                </div>
                <div className={`${pageState === 2 ? aniCN : ""}`}>
                    <p>Board Private</p>
                    <div style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center', padding: '.5rem .5rem .5rem 0'}}>
                        <input
                            type="checkbox"
                            checked={is_lock}
                            onChange={() => { set_lock(!is_lock) }}
                        />
                        <p>비밀번호를 설정하시겠습니까?</p>
                    </div>
                    <p>Board Password</p>
                    <input
                        type="password"
                        value={pw}
                        onChange={OCPW}
                        disabled={!is_lock}
                        placeholder="Board 비밀번호를 설정해주세요."
                    />
                </div>
                <div className={`${pageState === 3 ? aniCN : ""}`}>
                    <p>User nickname in Board</p>
                    <input
                        type="text"
                        value={nickName}
                        onChange={OCNN}
                        placeholder="Board에서 사용할 닉네임을 입력해주세요."
                    />
                </div>
                <div className={`${pageState === 4 ? 'created' : ""}`}>
                    { createState.loading && <LoadingBall /> }
                    { createState.success && '생성완료!' }
                </div>
                <PageButtonBox>
                    { pageState < 4 &&
                        <div className="next" onClick={NextPage}>
                            {pageState < 3 ? 'Next' : 'Create'}
                            <img src="/public/arrow.svg" />
                        </div>
                    }
                    { 4 > pageState && pageState > 0 &&
                        <div onClick={() => {setAniCN('before'); setPS(pageState - 1);}}>
                            <img src="/public/arrow.svg" style={{transform: "rotate(180deg)"}}/>
                            Prev
                        </div>
                    }
                </PageButtonBox>
            </FormBox>
        </>
    )
}

const MainPage = () => {
    const { data:userData, revalidate:USERRevalidate, error:UserError } = useSWR<IUser | false>('/api/auth', fetcher);
    const { data:joinedBoardList, revalidate:BLRevalidate} = useSWR<IBL[]>('/api/board', fetcher);
    const { data:notJoinedBoardList, revalidate:NJBLRevalidate} = useSWR<IBL[]>('/api/notJoinedBoards', fetcher);
    const [isAddBoard, setIsAddBoard] = useState(false);
    const [text, OCText] = useInput('');

    if (!userData)
        return <Redirect to="/auth" />

    if (!joinedBoardList)
        <LoadingCircle />

    return (
        <>
            { isAddBoard &&
                <TopComponentContainer
                    setValue={setIsAddBoard}
                >
                    <CreateBoardForm
                        BLRevalidate={BLRevalidate}
                        username={userData.username}
                    />
                </TopComponentContainer>
            }
            <Menu>
                <RelBox>
                    <div className="logo">
                        <img src="/public/42_logo.svg" />
                        <h2>BOARD</h2>
                    </div>
                    <div
                        onClick={() => { setIsAddBoard(true) }}
                    >
                        <img src="/public/board_add.svg" /><p>BOARD 만들기</p>
                    </div>
                    <div>
                        <img src="/public/setting.svg" />
                        <p>BOARD 관리</p>
                    </div>
                    <div className="logout">
                        <img src="/public/exit.svg" /><p>로그아웃</p>
                    </div>
                </RelBox>
            </Menu>
            <Container>
                <BCHeader>
                    참여한 보드들
                </BCHeader>
                <BoardContainer>
                    {joinedBoardList?.length === 0 &&
                        <div className="guide">새로운 보드를 만드시거나 다른 보드에 참여해보세요</div>
                    }
                    {joinedBoardList?.map((c, i) => {
                        return (
                            <BoardCard
                                key={(i)}
                                onClick={() => {
                                    location.href = `/board/${c.name}`
                                }}
                            >
                                <h3>{c.name}</h3>
                                <div className="description">
                                    {c.description}
                                </div>
                                <div className="iconBox">
                                    <img src="/public/person.svg" /> {c.memberCount}
                                    { c.is_lock === true && <img className="lock" src="/public/lock.svg" /> }
                                </div>
                            </BoardCard>
                        );
                    })}
                </BoardContainer>
                <BCHeader>
                    다른 보드들
                    <SearchForm>
                        <img src="/public/search.svg" />
                        <input
                            type="text"
                            value={text}
                            onChange={OCText}
                            placeholder="Search Board"
                        />
                    </SearchForm>
                </BCHeader>
                <BoardContainer>
                    {notJoinedBoardList?.length === 0 &&
                        <div className="guide">새로운 보드를 만드시거나 다른 보드에 참여해보세요</div>
                    }
                    {notJoinedBoardList?.map((c, i) => {
                        return (
                            <BoardCard
                                key={(i)}
                                onClick={() => {
                                    location.href = `/board/${c.name}`
                                }}
                            >
                                <h3>
                                    {c.name}
                                </h3>
                                <div className="description">
                                    {c.description}
                                </div>
                                <div className="iconBox">
                                    <img src="/public/person.svg" /> {c.memberCount}
                                    { c.is_lock === true && <img className="lock" src="/public/lock.svg" /> }
                                </div>
                            </BoardCard>
                        );
                    })}
                </BoardContainer>
            </Container>
        </>
    )
}

export default MainPage;
