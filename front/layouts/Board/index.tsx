import React, { FC, useEffect, useState } from 'react';
import { RouteComponentProps, useParams } from 'react-router';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import LoadingCircle from '@components/loading/LoadingCircle';
import { Redirect } from 'react-router-dom';
import useSocket from '@hooks/useSocket';
import { BoardHeader, DetailBackground } from './style';
import WorkSpace from '@pages/WorkSpace';
import { IUser, IBoard, IBM, IUserList } from '@typings/datas';
import { toast } from 'react-toastify';
import SideUserContainer from '@containers/board/SideUserContainer';

const Board: FC<RouteComponentProps> = ({ history }) => {
	const params = useParams<{ board: string }>();
	const board = encodeURIComponent(params.board);
	const [socket, disconnectSocket] = useSocket(board);
	const { data: userData } = useSWR<IUser | false>('/api/auth', fetcher);
	const { data: boardData, revalidate: BOARDRevalidate } = useSWR<IBoard | string>(
		userData ? `/api/board/${board}` : null,
		fetcher,
	);
	const { data: myDataInBoard } = useSWR<IBM | false>(
		boardData && userData ? `/api/board/${board}/me` : null,
		fetcher,
	);
	const [menuFlg, setMFlg] = useState<boolean>(false);
	const [userList, setUserList] = useState<IUserList[] | null | undefined>();

	if (boardData == '404') history.push('/404');

	useEffect(() => {
		return () => {
			console.info('disconnect socket', board);
			disconnectSocket();
		};
	}, [board, disconnectSocket]);

	useEffect(() => {
		if (boardData && userData && myDataInBoard) {
			console.info('로그인');
			socket?.emit('login', { id: myDataInBoard.id, username: myDataInBoard.username });
		}
	}, [socket, userData, boardData, myDataInBoard]);

	useEffect(() => {
		socket?.on('onlineList', async (data: IUserList[]) => {
			const rmDupData: IUserList[] = [];
			await data.forEach((elem) => {
				if (!rmDupData.find((v) => v.id === elem.id)) rmDupData.push(elem);
			});
			setUserList(rmDupData);
		});
		socket?.on('refresh', () => {
			console.log('refresh');
			BOARDRevalidate();
		});
		return () => {
			socket?.off('refresh');
		};
	}, [socket, BOARDRevalidate]);

	if (!userData) return <Redirect to={`/auth?prev=/board/${board}`} />;

	if (!boardData) return <LoadingCircle />;
	else if (boardData === 'not assigned' || !board) {
		alert('참여하지 않은 보드입니다.');
		return <Redirect to="/main" />;
	}
	if (!myDataInBoard) return <LoadingCircle />;

	return (
		<>
			{menuFlg && <DetailBackground style={{ zIndex: 8 }} onClick={() => setMFlg(false)} />}
			<SideUserContainer
				menuFlg={menuFlg}
				board={board}
				boardData={boardData}
				myDataInBoard={myDataInBoard}
				userList={userList}
				history={history}
				toast={toast}
			/>
			{typeof boardData !== 'string' && (
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<BoardHeader>
						<a className="logo" href="/main">
							<img src="/public/boardrag.svg" />
						</a>
						<div className="up" onClick={() => setMFlg(!menuFlg)}>
							{menuFlg ? <img src="/public/arrow.svg" /> : <img src="/public/person.svg" />}
						</div>
					</BoardHeader>
					<WorkSpace
						boardData={boardData}
						dataReval={BOARDRevalidate}
						userData={myDataInBoard}
						board={board ? board : ''}
					/>
				</div>
			)}
		</>
	);
};

export default React.memo(Board);
