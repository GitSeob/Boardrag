import React, { useCallback } from 'react';
import { IBL } from '@typings/datas';
import { Container, BoardContainer, BCHeader, SearchForm } from './style';
import useInput from '@hooks/useInput';
import BoardCardContainer from '@containers/main/BoardCardContainer';

interface IMainPageContents {
	joinedBoards: IBL[] | undefined;
	notJoinedBoards: IBL[] | undefined;
	onClickNewBoard(board: any): void;
}

const MainPageContents = ({ joinedBoards, notJoinedBoards, onClickNewBoard }: IMainPageContents) => {
	const [text, OCText] = useInput('');

	return (
		<Container>
			<BCHeader>참여한 보드들</BCHeader>
			<BoardContainer>
				{joinedBoards?.length === 0 && (
					<div className="guide">새로운 보드를 만드시거나 다른 보드에 참여해보세요</div>
				)}
				<BoardCardContainer boards={joinedBoards} type="joined" />
			</BoardContainer>
			<BCHeader>
				다른 보드들
				<SearchForm>
					<img src="/public/search.svg" />
					<input type="text" value={text} onChange={OCText} placeholder="Search" />
				</SearchForm>
			</BCHeader>
			<BoardContainer>
				{notJoinedBoards?.length === 0 && (
					<div className="guide">새로운 보드를 만드시거나 다른 보드에 참여해보세요</div>
				)}
				<BoardCardContainer
					boards={notJoinedBoards?.filter(
						(board) => board.name.indexOf(text) !== -1 || board.description.indexOf(text) !== -1,
					)}
					type="notJoined"
					onClickNewBoard={onClickNewBoard}
				/>
			</BoardContainer>
		</Container>
	);
};

export default MainPageContents;
