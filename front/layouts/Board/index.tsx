import React, {FC, useEffect, useCallback, useState, useRef, MutableRefObject, ChangeEvent} from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import LoadingCircle from '@components/LoadingCircle';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import useSocket from '@hooks/useSocket';
import { BoardHeader, UserList, LogOutButton, MenuContainer, UserMenu, DetailBackground } from './style';
import ChatBox from '@components/ChatBox';
import WorkSpace from '@pages/WorkSpace';
import { IUser, IBoard, IBM } from '@typings/datas';

interface IUserList {
	id: number,
	username: string,
}

const Board:FC = () => {
	const params = useParams<{ board?: string }>();
	const { board } = params;
	const [socket, disconnectSocket] = useSocket(board);
	const { data:userData, revalidate:USERRevalidate, error:UserError } = useSWR<IUser | false>('/api/auth', fetcher);
	const { data:boardData, revalidate:BOARDRevalidate } = useSWR<IBoard | string>(userData ? `/api/board/${board}` : null, fetcher);
	const { data:myDataInBoard, revalidate: MDIBReval} = useSWR<IBM | false>((boardData && userData) ? `/api/board/${board}/me` : null, fetcher);
	const [menuFlg, setMFlg] = useState<boolean>(false);
	const [userList, setUserList] = useState<IUserList[] | null | undefined>();

	const logout = useCallback(() => {
		axios.post(`/api/logout`).then(() => {
			USERRevalidate();
			window.location.reload(false);
		}).catch((e) => {
			console.error(e);
		});
	}, []);

	useEffect(() => {
		return () => {
			console.info('disconnect socket', 42);
			disconnectSocket();
		};
	}, [disconnectSocket]);

	useEffect(() => {
		if (boardData && userData && myDataInBoard) {
			console.info('로그인');
			socket?.emit('login', { id: myDataInBoard.id, username: myDataInBoard.username });
		}
	}, [socket, userData, boardData, myDataInBoard]);

	useEffect(() => {
		socket?.on('onlineList', async (data: IUserList[]) => {
			const rmDupData:IUserList[] = [];
			await data.forEach((elem) => {
				if (!rmDupData.find(v => v.id === elem.id))
					rmDupData.push(elem);
			});
			setUserList(rmDupData);
		});
		socket?.on('refresh', () => {
			console.log('refresh');
			BOARDRevalidate();
		})
		return () => {
			socket?.off('refresh');
		}
	}, [socket]);

	if (!userData)
		return <Redirect to={`/auth?prev=/board/${board}`} />

	if (!boardData)
		return <LoadingCircle />
	else if (boardData === 'not assigned')
	{
		alert("참여하지 않은 보드입니다.");
		return <Redirect to="/main" />
	}
	if (!myDataInBoard)
		return <LoadingCircle />

	return (
		<>
		{menuFlg &&
			<DetailBackground
				style={{zIndex: 8}}
				onClick={() => setMFlg(false)}
			/>
		}
		<UserMenu
			style={{transform: `translateX(${menuFlg ? '0' : '100%'})`}}
		>
			<MenuContainer>
				<UserList>
					<p>User List</p>
					<ul>
						{userList?.map((c, i) => {
							return (
								<li key={(i)}>
									{c.username === myDataInBoard?.username ? `${c.username} (me)` : c.username}
								</li>
							);
						})}
					</ul>
				</UserList>
				{(board && myDataInBoard && boardData ) &&
					<ChatBox
						userData={myDataInBoard}
						board={board}
					/>
				}
				<LogOutButton
					onClick={logout}
				>
					로그아웃
				</LogOutButton>
			</MenuContainer>
		</UserMenu>
		{ typeof(boardData) !== 'string' &&
		<div style={{display: 'flex', flexDirection: 'column'}}>
			<BoardHeader >
				<div
					className="logo"
					onClick={() => {
						location.href = "/"
					}}
				>
					<h2>BOXLOT</h2>
				</div>
				<div className="up"
					onClick={() => setMFlg(!menuFlg)}
				>
					{menuFlg ?
						<img src="/public/arrow.svg" />
						:
						<img src="/public/person.svg" />
					}
				</div>
			</BoardHeader>
			<WorkSpace
				boardData={boardData}
				dataReval={BOARDRevalidate}
				userData={myDataInBoard}
				board={board ? board : ''}
			/>
			</div>
		}
		</>
	);
}

export default React.memo(Board);
