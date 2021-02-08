import React, { FC, useState, useCallback, useEffect, ReactNode } from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import LoadingCircle from '@components/LoadingCircle';
import { Redirect } from 'react-router-dom';
import { IUser, IBL } from '@typings/datas';
import CreateBoardForm from '@components/CreateBoardForm';
import JoinBoardForm from '@components/JoinBoardForm';
import {
	Menu,
	Container,
	RelBox,
	BoardContainer,
	BoardCard,
	BCHeader,
	SearchForm,
	DarkBackground,
	PersonCount,
	NextBoardBtnBox,
	BeforeBoardBtnbox,
} from './style';
import useInput from '@hooks/useInput';
import InitName from '@components/InitName';

interface ITCC {
	setValue: (data: boolean) => void;
	children: ReactNode;
}

export const TopComponentContainer: FC<ITCC> = ({ children, setValue }: ITCC) => {
	return (
		<>
			<DarkBackground
				onClick={() => {
					setValue(false);
				}}
			/>
			{children}
		</>
	);
};

const MainPage = () => {
	const { data: userData, revalidate: USERRevalidate } = useSWR<IUser | false>('/api/auth', fetcher);
	const { data: joinedBoardList, revalidate: BLRevalidate } = useSWR<IBL[]>('/api/board', fetcher);
	const { data: notJoinedBoardList } = useSWR<IBL[]>('/api/notJoinedBoards', fetcher);
	const [isAddBoard, setIsAddBoard] = useState(false);
	const [initName, setIN] = useState(false);
	const [text, OCText] = useInput('');
	const [joinInfo, setJI] = useState({
		clicked: false,
		board: null,
	});
	const [nextBtn, setNextBtn] = useState(false);
	const [move, setMove] = useState({
		width: 0,
		page: 0,
	});

	const logout = useCallback(() => {
		axios
			.post(`/api/logout`)
			.then(() => {
				USERRevalidate();
				window.location.reload(false);
			})
			.catch((e) => {
				console.error(e);
			});
	}, []);
	const setJIClicked = useCallback((value: any) => {
		setJI({
			board: null,
			clicked: value,
		});
	}, []);

	const onClickNewBoard = useCallback((board: any) => {
		setJI({
			clicked: true,
			board: board,
		});
	}, []);

	useEffect(() => {
		setMove({
			...move,
			width: window.innerWidth - 248,
		});
	}, [window.innerWidth]);

	useEffect(() => {
		if (joinedBoardList) {
			const cardNum = move.width / 132;
			if (joinedBoardList?.length > cardNum && (move.page + 1) * cardNum < joinedBoardList?.length)
				setNextBtn(true);
			else setNextBtn(false);
		}
	}, [joinedBoardList, nextBtn, move]);

	if (!userData) return <Redirect to="/auth" />;

	if (!joinedBoardList) <LoadingCircle />;

	return (
		<>
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
			<Menu>
				<RelBox>
					<a className="logo" href="/main">
						<h2>BOXLOT</h2>
					</a>
					<div
						onClick={() => {
							setIsAddBoard(true);
						}}
					>
						<img src="/public/board_add.svg" />
						<p>BOARD 만들기</p>
					</div>
					<div
						onClick={() => {
							location.href = '/manage';
						}}
					>
						<img src="/public/setting.svg" />
						<p>BOARD 관리</p>
					</div>
					<div className="logout" onClick={logout}>
						<img src="/public/exit.svg" />
						<p>로그아웃</p>
					</div>
				</RelBox>
			</Menu>
			<Container>
				<BCHeader>참여한 보드들</BCHeader>
				<BoardContainer>
					{joinedBoardList?.length === 0 && (
						<div className="guide">새로운 보드를 만드시거나 다른 보드에 참여해보세요</div>
					)}
					{nextBtn && (
						<NextBoardBtnBox
							onClick={() => {
								setMove({ ...move, page: move.page + 1 });
							}}
						>
							<img src="/public/arrow.svg" />
						</NextBoardBtnBox>
					)}
					{move.page > 0 && (
						<BeforeBoardBtnbox
							onClick={() => {
								setMove({ ...move, page: move.page - 1 });
							}}
						>
							<img style={{ transform: 'rotate(180deg)' }} src="/public/arrow.svg" />
						</BeforeBoardBtnbox>
					)}
					<div
						style={{
							width: 'fit-content',
							transition: '.3s',
							transform: `translateX(-${move.width * move.page}px)`,
						}}
					>
						{joinedBoardList?.map((c, i) => {
							return (
								<BoardCard
									key={i}
									url={c.background}
									onClick={() => {
										location.href = `/board/${c.name}`;
									}}
								>
									<h3>{c.name}</h3>
									<div className="description">{c.description}</div>
									<div className="iconBox">
										<PersonCount>
											<img src="/public/person.svg" /> {c.memberCount}
										</PersonCount>
										{c.is_lock === true && <img className="lock" src="/public/lock.svg" />}
									</div>
								</BoardCard>
							);
						})}
					</div>
				</BoardContainer>
				<BCHeader>
					다른 보드들
					<SearchForm
						style={{
							right: move.width - 132 * parseInt(move.width / 132 + ''),
						}}
					>
						<img src="/public/search.svg" />
						<input type="text" value={text} onChange={OCText} placeholder="Search Board" />
					</SearchForm>
				</BCHeader>
				<BoardContainer>
					{notJoinedBoardList?.length === 0 && (
						<div className="guide">새로운 보드를 만드시거나 다른 보드에 참여해보세요</div>
					)}
					<div className="notJoin">
						{notJoinedBoardList
							?.filter((njb) => njb.name.includes(text) || njb.description.includes(text))
							.map((c, i) => {
								return (
									<BoardCard
										url={c.background}
										key={i}
										onClick={() => {
											onClickNewBoard(c);
										}}
									>
										<h3>{c.name}</h3>
										<div className="description">{c.description}</div>
										<div className="iconBox">
											<PersonCount>
												<img src="/public/person.svg" /> {c.memberCount}
											</PersonCount>
											{c.is_lock === true && <img className="lock" src="/public/lock.svg" />}
										</div>
									</BoardCard>
								);
							})}
					</div>
				</BoardContainer>
			</Container>
		</>
	);
};

export default MainPage;
