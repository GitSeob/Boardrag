import React from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

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
    SearchForm
} from './style';
import useInput from '@hooks/useInput';

interface IBL {
    name: string,
}

const MainPage = () => {
    const { data:userData, revalidate:USERRevalidate, error:UserError } = useSWR<IUser | false>('/api/auth', fetcher);
    const { data:boardList, revalidate:BLRevalidate} = useSWR<IBL[]>('/api/board', fetcher);

    const [text, OCText] = useInput('');

    if (!userData)
        return <Redirect to="/auth" />

    if (!boardList)
        <LoadingCircle />

    console.log(boardList);

    return (
        <>
            <Menu>
                <RelBox>
                    <div className="logo">
                        <img src="/public/42_logo.svg" />
                        <h2>BOARD</h2>
                    </div>
                    <div>
                        <img src="/public/add.svg" />BOARD 만들기
                    </div>
                    <div className="logout">
                        <img src="/public/exit.svg" />로그아웃
                    </div>
                </RelBox>
            </Menu>
            <Container>
                <BCHeader>
                    My Boards
                </BCHeader>
                <BoardContainer>
                    {boardList?.map((c, i) => {
                        return (
                            <BoardCard
                                key={(i)}
                                onClick={() => {
                                    location.href = `/board/${c.name}`
                                }}
                            >
                                {c.name}
                            </BoardCard>
                        );
                    })}
                </BoardContainer>
                <BCHeader>
                    New Boards
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
                    <div></div>
                </BoardContainer>
            </Container>
        </>
    )
}

export default MainPage;
