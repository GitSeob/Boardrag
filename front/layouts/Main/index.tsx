import React, { useState, useCallback } from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import LoadingCircle from '@components/loading/LoadingCircle';
import { Redirect } from 'react-router-dom';
import { IUser, IBL } from '@typings/datas';
import CreateBoardForm from '@components/main/CreateBoardForm';
import JoinBoardForm from '@components/main/JoinBoardForm';
import InitName from '@components/main/InitName';
import TopComponentContainer from '@components/main/TopComponentContainer';
import MainPageHeader from '@containers/layout/MainPageHeader';
import PageFooter from '@containers/layout/PageFooter';
import MainPageContents from '@containers/main/MainPageContents';

const MainPage = () => {
	const { data: userData, revalidate: USERRevalidate } = useSWR<IUser | false>('/api/auth', fetcher);
	const { data: joinedBoardList, revalidate: BLRevalidate } = useSWR<IBL[]>('/api/board', fetcher);
	const { data: notJoinedBoardList } = useSWR<IBL[]>('/api/notJoinedBoards', fetcher);
	const [isAddBoard, setIsAddBoard] = useState(false);
	const [initName, setIN] = useState(false);
	const [joinInfo, setJI] = useState({
		clicked: false,
		board: null,
	});

	const onClickNewBoard = useCallback((board: any) => {
		setJI({
			clicked: true,
			board: board,
		});
	}, []);

	const setJIClicked = useCallback((value: any) => {
		setJI({
			board: null,
			clicked: value,
		});
	}, []);

	if (!userData) return <Redirect to="/auth" />;

	if (!joinedBoardList) <LoadingCircle />;

	return (
		<div>
			{isAddBoard && (
				<TopComponentContainer setValue={setIsAddBoard}>
					<CreateBoardForm BLRevalidate={BLRevalidate} username={userData.username} />
				</TopComponentContainer>
			)}
			{joinInfo.clicked && joinInfo.board && (
				<TopComponentContainer setValue={setJIClicked}>
					<JoinBoardForm userData={userData} board={joinInfo.board} />
				</TopComponentContainer>
			)}
			{!userData.username && !initName && (
				<TopComponentContainer setValue={() => {}}>
					<InitName userData={userData} flgNickname={setIN} />
				</TopComponentContainer>
			)}
			<MainPageHeader page="main" setIsAddBoard={setIsAddBoard} USERRevalidate={USERRevalidate} />
			<MainPageContents
				joinedBoards={joinedBoardList}
				notJoinedBoards={notJoinedBoardList}
				onClickNewBoard={onClickNewBoard}
			/>
			<PageFooter className="main" />
		</div>
	);
};

export default MainPage;
