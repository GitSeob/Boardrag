import React, { useState, useEffect, ReactNode } from 'react';
import { BoardCard, PersonCount, Container, NextBoardBtnBox, BeforeBoardBtnbox } from './style';
import { IBL } from '@typings/datas';

interface ICardWrap {
	children: ReactNode;
	type: string;
	onClickNewBoard?(board: any): void;
	board: IBL;
}

const CardWrap = ({ type, children, onClickNewBoard, board }: ICardWrap) => {
	if (type !== 'joined' && onClickNewBoard)
		return (
			<BoardCard
				url={board.background}
				key={board.id}
				onClick={() => {
					onClickNewBoard(board);
				}}
			>
				{children}
			</BoardCard>
		);
	else
		return (
			<BoardCard
				key={board.id}
				url={board.background}
				onClick={() => {
					location.href = `/board/${encodeURIComponent(board.name)}`;
				}}
			>
				{children}
			</BoardCard>
		);
};

interface IBCC {
	boards: IBL[] | undefined;
	type: string;
	onClickNewBoard?(board: IBL): void;
}
const BoardCardContainer = ({ boards, type, onClickNewBoard }: IBCC) => {
	const [nextBtn, setNextBtn] = useState(false);
	const [boxWidth, setBoxWidth] = useState(0);
	const [boxIndex, setBoxIndex] = useState(0);

	useEffect(() => {
		if (type === 'joined') {
			setBoxWidth(window.innerWidth - 248);
		}
	}, [window.innerWidth]);

	useEffect(() => {
		if (boards && type === 'joined') {
			const cardNum = boxWidth / 132;
			if (boards?.length > cardNum && (boxIndex + 1) * cardNum < boards?.length) setNextBtn(true);
			else setNextBtn(false);
		}
	}, [boards, nextBtn, boxWidth, boxIndex]);

	const linkBoard = () => {};

	return (
		<>
			<Container
				className={type}
				style={{
					transform: `translateX(-${boxWidth * boxIndex}px)`,
				}}
			>
				{boards?.map((board) => (
					<CardWrap
						key={board.id}
						board={board}
						type={type}
						onClickNewBoard={onClickNewBoard && onClickNewBoard}
					>
						<h3>{board.name}</h3>
						<div className="description">{board.description}</div>
						<div className="iconBox">
							<PersonCount>
								<img src="/public/person.svg" /> {board.memberCount}
							</PersonCount>
							{board.is_lock === true && <img className="lock" src="/public/lock.svg" />}
						</div>
					</CardWrap>
				))}
			</Container>
			{nextBtn && (
				<NextBoardBtnBox
					onClick={() => {
						setBoxIndex(boxIndex + 1);
					}}
				>
					<img src="/public/arrow.svg" />
				</NextBoardBtnBox>
			)}
			{boxIndex > 0 && (
				<BeforeBoardBtnbox
					onClick={() => {
						setBoxIndex(boxIndex - 1);
					}}
				>
					<img style={{ transform: 'rotate(180deg)' }} src="/public/arrow.svg" />
				</BeforeBoardBtnbox>
			)}
		</>
	);
};

export default BoardCardContainer;
