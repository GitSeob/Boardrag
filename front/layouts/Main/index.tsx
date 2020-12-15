import React from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

import LoadingCircle from '@components/LoadingCircle';
import { Redirect } from 'react-router-dom';
import { IUser, IBoard } from '@typings/datas';
import {
    Menu,
    Container
} from './style';

interface IBL {
    name: string,
}

const MainPage = () => {
    const { data:userData, revalidate:USERRevalidate, error:UserError } = useSWR<IUser | false>('/api/auth', fetcher);
    const { data:boardList, revalidate:BLRevalidate} = useSWR<IBL[]>('/api/board', fetcher);

    if (!userData)
        return <Redirect to="/auth" />

    if (!boardList)
        <LoadingCircle />

    console.log(boardList);

    return (
        <>
            <Menu>
                <div>
                    <h2>LOGO</h2>
                </div>
            </Menu>
            <Container>
                <div>
                    <h3>My Boards</h3>
                    {boardList?.map((c, i) => {
                        return (
                            <div
                                onClick={e => {
                                    location.href = `/board/${c.name}`
                                }}
                            >
                                {c.name}
                            </div>
                        );
                    })}
                </div>
                <div>New Boards</div>
            </Container>
        </>
    )
}

export default MainPage;
