import React, { useCallback } from 'react';
import axios from 'axios';
import { Menu, RelBox } from './style';

interface IMPH {
	setIsAddBoard?(flg: boolean): void;
	USERRevalidate: () => void;
	page: string;
}

const MainPageHeader = ({ setIsAddBoard, USERRevalidate, page }: IMPH) => {
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

	return (
		<Menu>
			<RelBox>
				<a className="logo" href="/main">
					<img src="/public/boardrag.svg" />
				</a>
				{page === 'main' && setIsAddBoard ? (
					<>
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
					</>
				) : (
					<a href="/main">
						<img src="/public/boards.svg" />
						<p>MAIN PAGE</p>
					</a>
				)}
				<div className="logout" onClick={logout}>
					<img src="/public/exit.svg" />
					<p>로그아웃</p>
				</div>
			</RelBox>
		</Menu>
	);
};

export default MainPageHeader;
