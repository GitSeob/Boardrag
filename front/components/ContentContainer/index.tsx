import React, {FC, useEffect, useCallback, useState, useRef} from 'react';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);
import axios from 'axios';
import Scrollbars from 'react-custom-scrollbars';
import useInput from '@hooks/useInput';
import ImageEditButton from '@components/ImageEditButton';

import {
	ContentBox,
	UserInfoBox,
	DetailContentBox,
	CommentBox,
	MoreButton,
	Comment,
	WriteComment
} from './style';
import { IDetail, IBM, IComment, DetailProps } from '@typings/datas';
import TextC from '@components/DisplayContents/TextC';
import NoteC from '@components/DisplayContents/NoteC';
import ImageC from '@components/DisplayContents/ImageC';

interface ISC {
	openDetail: IDetail
}

const SwitchContent:FC<ISC> = ({ openDetail }) => {
	if (openDetail.content === undefined)
		return (<></>);
	if (openDetail.category == 1)
	{
		return (
			<TextC
				isEdit={false}
				content={openDetail.content?.content}
			/>
		);
	}
	else if (openDetail.category == 2)
	{
		return (
			<NoteC
				isEdit={false}
				content={openDetail.content?.paragraph}
				head={openDetail.content?.head}
				url={openDetail.content?.background_img}
			/>
		);
	}
	else if (openDetail.category == 3)
	{
		return (
			<ImageC
				isEdit={false}
				url={openDetail.content?.url}
			/>
		)
	}
	else return (<></>);
};

interface ICContainer {
	openDetail: IDetail,
	userData: IBM,
	board: string,
	toast: any,
	onSubmitEdit: (text: string, head: string, url: string) => void,
	cancelEdit: () => void,
	onEdit: (cid: number) => void,
	dataReval: () => void,
	setOpenDetail(props: object): void,
	comments: IComment[] | undefined,
}

const ContentContainer:FC<ICContainer> = ({
	openDetail, userData, board, toast, onSubmitEdit, cancelEdit, dataReval, setOpenDetail, onEdit, comments
}) => {
	const [editCommnetIdx, setEditCommentIdx] = useState(0);
	const [commentContent, OCCC, setCC] = useInput('');
	const [head, OCHead, setHead] = useInput('');
	const detailScrollbarRef = useRef<Scrollbars>(null);

	const now = new Date();

	const submitComment = useCallback((e) => {
		e.preventDefault();
		if (commentContent !== '') {
			axios.post(`/api/board/${board}/comment/${openDetail.category}/${openDetail.content?.id}`, {
				content: commentContent,
				BoardMemberId: userData.id
			}).then(() => {
				setCC('');
				if (detailScrollbarRef.current)
					detailScrollbarRef.current.scrollToBottom();
			}). catch((e) => {
				console.error(e);
			})
		}
	}, [commentContent, openDetail, detailScrollbarRef]);

	const deleteBox = useCallback((e) => {
		e.preventDefault();
		if (!confirm('정말 삭제하시겠습니까?'))
			return ;
		let category = '';
		if (openDetail.category === 1)
			category = 'text';
		else if (openDetail.category === 2)
			category = 'note';
		else if (openDetail.category === 3)
			category = 'image';
		else
			return ;
		axios.delete(`api/board/${board}/delete/${category}/${openDetail.content?.id}`).then(() => {
			dataReval();
			setOpenDetail({
				category: 0,
				id: 0,
				flg: false,
				loadComment: false,
				content: null,
			});
			toast.dark(`게시물이 삭제되었습니다.`);
		}).catch((e) => {
			console.error(e);
		})
	}, [openDetail]);

	const updateComment = (commentId:number) => {
		axios.patch(`/api/board/${board}/comment/${commentId}`, {
			content: head
		})
		.then(() => {
			toast.dark('댓글이 수정되었습니다.');
			setHead('');
			setEditCommentIdx(0);
		}).catch((e) => {
			toast.error(e.response.data.reason);
		});
	};

	const deleteComment = (commentId:number) => {
		if (confirm('댓글을 삭제하시겠습니까?')) {
			axios.delete(`/api/board/${board}/comment/${commentId}`)
			.then(() => {
				toast.dark('댓글이 삭제되었습니다.');
			}).catch((e) => {
				toast.error(e.response.data.reason);
			});
		}
	};

	useEffect(() => {
		console.log(comments);
	}, [comments]);

	return (
		<ContentBox
			flg={openDetail.flg}
		>
			<Scrollbars
					autoHide
					ref={detailScrollbarRef}
					style={{height: "720px", overflow: 'hidden',}}
			>
				<UserInfoBox>
					<div className="user">
						{ openDetail.content?.BoardMember.profile_img ?
							<img src={openDetail.content?.BoardMember.profile_img} />
							:
							<div className="no_profile_img">
								<img src="/public/person.svg"/>
							</div>
						}
						<p>{openDetail.content?.BoardMember? openDetail.content.BoardMember.username : "unknown user"}</p>
					</div>
					<MoreButton>
						<img src="/public/more.svg" />
					</MoreButton>
				</UserInfoBox>
				<DetailContentBox>
					<div className="dayjs">
						<p>{dayjs(openDetail.content?.createdAt).format('YYYY년 MM월 DD일')}</p>
					</div>
					{ openDetail &&
						<SwitchContent
							openDetail={openDetail}
						/>
					}
				</DetailContentBox>
				<CommentBox
					style={{ minHeight: `${comments?.length === 0 ? "100px" : "360px" }`}}
				>
					{comments?.length === 0 &&
						<div style={{color: "#777", fontSize: "12px"}}>
							첫 댓글을 작성해보세요 !
						</div>
					}
						{comments?.map((c, i) => {
							return (
								<Comment
									key={(i)}
								>
									{ c.BoardMember.profile_img ?
										<img src={c.BoardMember.profile_img} />
										:
										<div className="no_profile_img">
											<img src="/public/person.svg" />
										</div>
									}
									<div className="content">
										<p className="nickname">{c.BoardMember ? c.BoardMember.username : "unknown user"}</p>
										<div>
											{ c.id === editCommnetIdx ?
												<div>
													<input
														type="text"
														autoFocus
														value={head}
														onChange={OCHead}
													/>
												</div>
											:
												<>
													<div>{c.content}</div>
													<p>{dayjs(c.createdAt).diff(now, 'day') > -1 ? dayjs(c.createdAt).format('LT') : dayjs(c.createdAt).format('YYYY년 MM월 DD일')}</p>
												</>
											}
										</div>
									</div>
									{(c.BoardMemberId === userData.id ) &&
										<MoreButton>
											<img src="/public/more.svg" />
										</MoreButton>
									}
								</Comment>
							);
						})}
					</CommentBox>
					<WriteComment
						onClick={submitComment}
					>
						<img src={openDetail.content?.BoardMember.profile_img ? openDetail.content?.BoardMember.profile_img : "/public/person.svg"} />
						<input
							type="text"
							value={commentContent}
							onChange={OCCC}
							onKeyPress={(e) => {
								if (e.key === "Enter") {
									submitComment(e);
								}
							}}
						/>
						<div className="btn">
							<img src="/public/sendIcon.svg" />
						</div>
					</WriteComment>
			</Scrollbars>
		</ContentBox>
	);
}

export default ContentContainer;
