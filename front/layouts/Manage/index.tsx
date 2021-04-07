import React, { useCallback, useState } from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LoadingCircle from '@components/loading/LoadingCircle';
import { Redirect } from 'react-router-dom';
import { IUser, IBL } from '@typings/datas';
import { Container, ListBox, LoadingBG } from './style';
import LoadingBall from '@components/loading/LoadingBall';
import MyBoardContainer from '@components/manage/MyBoardContainer';
import JoinedBoardForm from '@components/manage/JoinedBoardForm';
import ChangePW from '@components/manage/ChangePW';
import MainPageHeader from '@containers/layout/MainPageHeader';
import PageFooter from '@containers/layout/PageFooter';

const Manage = () => {
	const { data: userData, revalidate: USERRevalidate } = useSWR<IUser | false>('/api/auth', fetcher);
	const { data: joinedBoardList, revalidate: BLRevalidate } = useSWR<IBL[]>('/api/manageBoards', fetcher);
	const [openBId, setOpenBId] = useState(-1);
	const [loading, setLoading] = useState(false);
	const [changePWFlg, setCPWF] = useState({
		flg: false,
		name: '',
		is_lock: true,
	});

	if (!userData) return <Redirect to="/auth?prev=/manage" />;

	if (!userData.username) return <Redirect to="/main" />;

	if (!joinedBoardList) <LoadingCircle />;

	return (
		<div>
			<MainPageHeader page="manage" USERRevalidate={USERRevalidate} />
			<Container>
				<div style={{ width: '100%' }}>
					<p>내가 만든 보드</p>
					{joinedBoardList?.filter((board) => board.AdminId === userData.id).length === 0 ? (
						<p style={{ fontWeight: 400, color: '#777', margin: '12px 0 24px 0' }}>
							생성한 Board가 없습니다.
						</p>
					) : (
						<ListBox>
							{joinedBoardList
								?.filter((board) => board.AdminId === userData.id)
								.map((c) => {
									return (
										<MyBoardContainer
											key={c.id}
											openBId={openBId}
											setOpenBId={setOpenBId}
											c={c}
											setLoading={setLoading}
											toast={toast}
											userData={userData}
											BLRevalidate={BLRevalidate}
											setChangePW={setCPWF}
										/>
									);
								})}
						</ListBox>
					)}
				</div>
				<div style={{ width: '100%' }}>
					<p>내가 참여중인 보드</p>
					{joinedBoardList?.filter((board) => board.AdminId !== userData.id).length === 0 ? (
						<p style={{ fontWeight: 400, color: '#777', margin: '12px 0 24px 0' }}>
							참여한 다른 유저의 Board가 없습니다.
						</p>
					) : (
						<ListBox>
							{joinedBoardList
								?.filter((board) => board.AdminId !== userData.id)
								.map((c) => {
									return (
										<JoinedBoardForm
											key={c.id}
											openBId={openBId}
											setOpenBId={setOpenBId}
											c={c}
											setLoading={setLoading}
											toast={toast}
											userData={userData}
											BLRevalidate={BLRevalidate}
										/>
									);
								})}
						</ListBox>
					)}
				</div>
			</Container>
			<PageFooter className="manage" />
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
			{loading && (
				<LoadingBG>
					<LoadingBall />
				</LoadingBG>
			)}
			{changePWFlg.flg && (
				<ChangePW value={changePWFlg} setValue={setCPWF} toast={toast} BLRevalidate={BLRevalidate} />
			)}
		</div>
	);
};

export default Manage;
