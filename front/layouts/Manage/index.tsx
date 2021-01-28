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
	BoardBar,
	BarContainer,
	ManageBoard,
	MBButton
} from './style';

const Manage = () => {
	const { data:userData, revalidate:USERRevalidate, error:UserError } = useSWR<IUser | false>('/api/auth', fetcher);
	const { data:joinedBoardList, revalidate:BLRevalidate} = useSWR<IBL[]>('/api/board', fetcher);
	const [openBId, setOpenBId] = useState(-1);

	const logout = useCallback(() => {
		axios.post(`/api/logout`).then(() => {
			USERRevalidate();
			window.location.reload(false);
		}).catch((e) => {
			console.error(e);
		});
	}, []);

	const removeBoard = useCallback((name) => {
		if (confirm(`정말 ${name} 보드를 삭제하시겠습니까?`))
		{
			axios.delete(`/api/deleteBoard/${name}`).then(() => {
				setOpenBId(-1);
				toast.dark(`${name} 보드가 삭제되었습니다.`);
			})
		}
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
										<BarContainer key={(c.id)}>
											<BoardBar onClick={() => { setOpenBId(c.id === openBId ? -1 : c.id); }}>
												{c.name}
											</BoardBar>
											{ openBId === c.id &&
												<ManageBoard>
													<div>
														<div>보드 이름</div>
														<div></div>
													</div>
													<div>
														<div>보드 description</div>
														<div></div>
													</div>
													<div>
														<div>보드 배경</div>
														<div></div>
													</div>
													<div>
														내 정보
														<div>내 프로필사진</div>
														<div>내 닉네임</div>
														<div>수정하기</div>
													</div>
													<div>
														참여 Member list
														<div>
															member map...
														</div>
													</div>
													<MBButton className="pw">비밀번호 변경하기</MBButton>
													<MBButton className="edit">수정사항 반영하기</MBButton>
													<MBButton className="delete" onClick={() => {removeBoard(c.name)}}>보드 삭제하기</MBButton>
												</ManageBoard>
											}
										</BarContainer>
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
						{
							joinedBoardList?.filter(board => board.AdminId !== userData.id).map(c => {
								return (
									<BoardBar key={(c.id)} onClick={() => { setOpenBId(c.id); }}>
										{c.name}
									</BoardBar>
								)
							})
						}
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
		</>
	);
}

export default Manage;
