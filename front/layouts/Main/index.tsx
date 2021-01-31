import React, {FC, useState, useCallback, Children} from 'react';
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
} from './style';
import useInput from '@hooks/useInput';
import InitName from '@components/InitName';

interface ITCC {
	setValue: (data:boolean) => void
}

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

const MainPage = () => {
	const { data:userData, revalidate:USERRevalidate, error:UserError } = useSWR<IUser | false>('/api/auth', fetcher);
	const { data:joinedBoardList, revalidate:BLRevalidate} = useSWR<IBL[]>('/api/board', fetcher);
	const { data:notJoinedBoardList, revalidate:NJBLRevalidate} = useSWR<IBL[]>('/api/notJoinedBoards', fetcher);
	const [isAddBoard, setIsAddBoard] = useState(false);
	const [initName, setIN] = useState(false);
	const [text, OCText] = useInput('');
	const [joinInfo, setJI] = useState({
		clicked: false,
		board: null
	});

	const logout = useCallback(() => {
		axios.post(`/api/logout`).then(() => {
			USERRevalidate();
			window.location.reload(false);
		}).catch((e) => {
			console.error(e);
		});
	}, []);
	const setJIClicked = useCallback((value:any) => {
		setJI({
			board: null,
			clicked: value,
		})
	}, []);

	const onClickNewBoard = useCallback((board:any) => {
		setJI({
			clicked: true,
			board: board
		});
	}, []);

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
			{ (joinInfo.clicked && joinInfo.board) &&
				<TopComponentContainer
					setValue={setJIClicked}
				>
					<JoinBoardForm
						userData={userData}
						board={joinInfo.board}
					/>
				</TopComponentContainer>
			}
			{
				(!userData.username && !initName) &&
				<TopComponentContainer
					setValue={() => {}}
				>
					<InitName
						userData={userData}
						flgNickname={setIN}
					/>
				</TopComponentContainer>
			}
			<Menu>
				<RelBox>
					<div className="logo">
						<h2>BOXLOT</h2>
					</div>
					<div
						onClick={() => { setIsAddBoard(true) }}
					>
						<img src="/public/board_add.svg" /><p>BOARD 만들기</p>
					</div>
					<div onClick={() => { location.href = "/manage" }}>
						<img src="/public/setting.svg" />
						<p>BOARD 관리</p>
					</div>
					<div className="logout" onClick={logout}>
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
								url={c.background}
								onClick={() => {
									location.href = `/board/${c.name}`
								}}
							>
								<h3>{c.name}</h3>
								<div className="description">
									{c.description}
								</div>
								<div className="iconBox">
									<PersonCount>
										<img src="/public/person.svg" /> {c.memberCount}
									</PersonCount>
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
								url={c.background}
								key={(i)}
								onClick={() => {
									onClickNewBoard(c)
								}}
							>
								<h3>
									{c.name}
								</h3>
								<div className="description">
									{c.description}
								</div>
								<div className="iconBox">
									<PersonCount>
										<img src="/public/person.svg" /> {c.memberCount}
									</PersonCount>
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
