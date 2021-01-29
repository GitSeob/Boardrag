import React, { useCallback, useState } from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LoadingCircle from '@components/LoadingCircle';
import { Redirect } from 'react-router-dom';
import { IUser, IBL } from '@typings/datas';
import {
	Menu, RelBox, Container
} from '../Main/style';
import {
	ListBox,
	LoadingBG
} from './style';
import LoadingBall from '@components/LoadingBall';
import MyBoardContainer from '@components/MyBoardContainer';

const Manage = () => {
	const { data:userData, revalidate:USERRevalidate, error:UserError } = useSWR<IUser | false>('/api/auth', fetcher);
	const { data:joinedBoardList, revalidate:BLRevalidate} = useSWR<IBL[]>('/api/manageBoards', fetcher);
	const [openBId, setOpenBId] = useState(-1);
	const [loading, setLoading] = useState(false);

	const logout = useCallback(() => {
		axios.post(`/api/logout`).then(() => {
			USERRevalidate();
			window.location.reload(false);
		}).catch((e) => {
			console.error(e);
		});
	}, []);

	if (!userData)
		return <Redirect to="/auth?prev=/manage" />

	if (!joinedBoardList)
		<LoadingCircle />

	return (
		<>
			<Menu>
				<RelBox>
					<div className="logo">
						<h2>BOXLOT</h2>
					</div>
					<div onClick={() => { location.href = "/main" }}>
						<img src="/public/boards.svg" />
						<p>MAIN PAGE</p>
					</div>
					<div className="logout" onClick={logout}>
						<img src="/public/exit.svg" /><p>로그아웃</p>
					</div>
					<div onClick={()=>{toast.dark("test")}}>
						<p>hi</p>
					</div>
				</RelBox>
			</Menu>
			<Container>
				<div style={{width: "100%"}}>
					<p>내가 만든 보드</p>
					{ joinedBoardList?.filter(board => board.AdminId === userData.id).length === 0 ?
						<p style={{fontWeight: 400, color: "#777", margin: "12px 0 24px 0"}}>생성한 Board가 없습니다.</p>
					:
						<ListBox>
							{
								joinedBoardList?.filter(board => board.AdminId === userData.id).map(c => {
									return (
										<MyBoardContainer
											key={(c.id)}
											openBId={openBId}
											setOpenBId={setOpenBId}
											c={c}
											setLoading={setLoading}
											toast={toast}
											userData={userData}
											BLRevalidate={BLRevalidate}
										/>
									)
								})
							}
						</ListBox>
					}
				</div>
				<div style={{width: "100%"}}>
					<p>내가 참여중인 보드</p>
					{ joinedBoardList?.filter(board => board.AdminId !== userData.id).length === 0 ?
						<p style={{fontWeight: 400, color: "#777", margin: "12px 0 24px 0"}}>참여한 다른 유저의 Board가 없습니다.</p>
					:
						<ListBox>
						{/*{
							joinedBoardList?.filter(board => board.AdminId !== userData.id).map(c => {
								return (
									<BoardBar key={(c.id)} onClick={() => { setOpenBId(c.id); }}>
										{c.name}
									</BoardBar>
								)
							})
						}*/}
						</ListBox>
					}
				</div>
			</Container>
			<ToastContainer
				position="bottom-left"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop
				closeOnClick={false}
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
			{loading &&
				<>
					<LoadingBG/>
					<LoadingBall />
				</>
			}
		</>
	);
}

export default Manage;
