import React, { FC } from 'react';
import { IBL, IUser } from '@typings/datas';
import EditMyInfo from '@components/EditMyInfo';
import { BarContainer, BoardBar, ManageBoard } from '@components/MyBoardContainer/style';

interface IJBF {
	openBId: number;
	setOpenBId(id: number): void;
	c: IBL;
	setLoading(flg: boolean): void;
	toast: any;
	userData: IUser;
}

const JoinedBoardForm: FC<IJBF> = ({ userData, openBId, setOpenBId, c, setLoading, toast }: IJBF) => {
	return (
		<BarContainer key={c.id}>
			<BoardBar
				onClick={() => {
					setOpenBId(c.id === openBId ? -1 : c.id);
				}}
			>
				<img src="/public/arrow.svg" style={{ transform: `rotate(${c.id === openBId ? 270 : 90}deg)` }} />
				{c.name}
			</BoardBar>
			{openBId === c.id && (
				<ManageBoard>
					<EditMyInfo
						myData={c.Member.find((mb) => mb.UserId === userData.id)}
						boardData={c}
						setLoading={setLoading}
						setOpen={() => {}}
						toast={toast}
					/>
				</ManageBoard>
			)}
		</BarContainer>
	);
};

export default JoinedBoardForm;
