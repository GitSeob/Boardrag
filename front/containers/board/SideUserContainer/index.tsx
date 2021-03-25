import React, { useCallback } from 'react';
import { UserMenu, MenuContainer, UserList, LogOutButton } from './style';
import ChatBox from '@components/board/ChatBox';
import { IUserList } from '@typings/datas';
import axios from 'axios';
import * as H from 'history';

interface ISideUserContainer {
	menuFlg: boolean;
	board: any;
	boardData: any;
	myDataInBoard: any;
	userList: IUserList[] | null | undefined;
	history: H.History;
	toast: any;
}

const SideUserContainer = ({
	menuFlg,
	board,
	boardData,
	myDataInBoard,
	userList,
	history,
	toast,
}: ISideUserContainer) => {
	const quit = useCallback(() => {
		if (typeof boardData !== 'string' && boardData.AdminId === myDataInBoard.UserId) {
			alert('현재 관리자는 보드에서 나갈 수 없습니다.');
			return;
		}
		axios
			.delete(`/api/quitBoard/${board}`)
			.then(() => {
				toast.dark(`${board} 보드에서 나갔습니다.`);
				history.push('/main');
			})
			.catch((e) => {
				toast.error(e.response.data);
			});
	}, [boardData, board]);

	return (
		<UserMenu style={{ transform: `translateX(${menuFlg ? '0' : '100%'})` }}>
			<MenuContainer>
				<UserList>
					<p>User List</p>
					<ul>
						{userList?.map((c, i) => {
							return (
								<li key={i}>
									{c.username === myDataInBoard?.username ? `${c.username} (me)` : c.username}
								</li>
							);
						})}
					</ul>
				</UserList>
				{board && myDataInBoard && boardData && <ChatBox userData={myDataInBoard} board={board} />}
				<LogOutButton onClick={quit}>보드에서 나가기</LogOutButton>
			</MenuContainer>
		</UserMenu>
	);
};

export default SideUserContainer;
