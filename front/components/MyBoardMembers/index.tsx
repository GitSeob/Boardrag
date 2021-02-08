import React, { FC, useCallback } from 'react';
import { IBM } from '@typings/datas';
import axios from 'axios';
import { Container, MemberBlock } from './style';

interface IMBM {
	members: IBM[];
	myId: number;
	boardName: string;
	toast: any;
}

const MyBoardMembers: FC<IMBM> = ({ members, myId, boardName, toast }: IMBM) => {
	const kickMember = useCallback(
		(name) => {
			if (confirm(`${name} 님을 추방하시겠습니까?`)) {
				axios
					.delete(`/api/kick/${boardName}?username=${name}`)
					.then(() => {
						toast.dark(`${name} 님을 추방했습니다.`);
					})
					.catch((e) => {
						toast.error(e.response.data);
					});
			}
		},
		[boardName, toast],
	);

	return (
		<Container>
			{members.filter((member) => member.UserId !== myId).length === 0 && <p>참여 중인 맴버가 없습니다.</p>}
			{members
				.filter((member) => member.UserId !== myId)
				.map((member, i) => {
					return (
						<MemberBlock key={i}>
							{member.username}
							<div
								className="kick"
								onClick={() => {
									kickMember(member.username);
								}}
							>
								추방하기
							</div>
						</MemberBlock>
					);
				})}
		</Container>
	);
};

export default MyBoardMembers;
