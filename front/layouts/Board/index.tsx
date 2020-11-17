import React, {FC, useEffect} from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import LoadingCircle from '@components/LoadingCircle';
import { Redirect } from 'react-router-dom';

const Board:FC = () => {
    const { data:userData, revalidate, error:error } = useSWR('/api/auth', fetcher);

    if (error)
        return <Redirect to="/auth" />

    if (!userData)
        return <LoadingCircle />

    return (
        <>
        <div style={{color: "#fff"}}>{userData.username}</div>
        </>
    );
}

export default Board;
