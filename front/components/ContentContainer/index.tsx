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
	WriteComment,
	MoreList,
	NoImageProfile
} from './style';
import { IDetail, IBM, IComment, DetailProps } from '@typings/datas';
import TextC from '@components/DisplayContents/TextC';
import NoteC from '@components/DisplayContents/NoteC';
import ImageC from '@components/DisplayContents/ImageC';

interface ISC {
	openDetail: IDetail,
	isEdit: boolean,
	setEdit(flg: boolean): void,
	onSubmitEdit: (text: string, head: string, url: string) => void,
}

const SwitchContent:FC<ISC> = ({ openDetail, isEdit, setEdit, onSubmitEdit }) => {
	if (openDetail.content === undefined)
		return (<></>);
	if (openDetail.category == 1)
	{
		return (
			<TextC
				isEdit={isEdit}
				setEdit={setEdit}
				onSubmitEdit={onSubmitEdit}
				content={openDetail.content?.content}
			/>
		);
	}
	else if (openDetail.category == 2)
	{
		return (
			<NoteC
				isEdit={isEdit}
				setEdit={setEdit}
				onSubmitEdit={onSubmitEdit}
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
				isEdit={isEdit}
				setEdit={setEdit}
				onSubmitEdit={onSubmitEdit}
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
	dataReval: () => void,
	setOpenDetail(props: object): void,
	comments: IComment[] | undefined,
	moveMode: () => void,
}

const ContentContainer:FC<ICContainer> = ({
	openDetail, userData, board, toast, onSubmitEdit, dataReval, setOpenDetail, comments, moveMode
}) => {
	const [editCommnetIdx, setEditCommentIdx] = useState(-1);
	const [commentMenuIdx, setCMI] = useState(-1);
	const [contentMenu, setContentMenu] = useState(false);
	const [commentContent, OCCC, setCC] = useInput('');
	const [head, OCHead, setHead] = useInput('');
	const [isEdit, setEdit] = useState(false);
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
			setCMI(-1);
			axios.delete(`/api/board/${board}/comment/${commentId}`)
			.then(() => {
				toast.dark('댓글이 삭제되었습니다.');
			}).catch((e) => {
				toast.error(e.response.data.reason);
			});
		}
	};

	useEffect(() => {
		setEditCommentIdx(-1);
		setCMI(-1);
		setContentMenu(false);
		setCC('');
		setHead('');
		setEdit(false);
	}, [openDetail]);

	return (
		<ContentBox
			flg={openDetail.flg}
		>
			{/*<Scrollbars
					autoHide
					ref={detailScrollbarRef}
					style={{ overflow: 'hidden',}}
			>*/}
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
					<MoreButton
						onClick={() => { setContentMenu(!contentMenu); setCMI(-1); }}
					>
						<img src="/public/more.svg" />
					</MoreButton>
					{ contentMenu &&
						<MoreList className="three">
							<div
								onClick={() => {setEdit(true); setContentMenu(false); }}
							>
								내용 수정
							</div>
							<div
								onClick={moveMode}
							>
								위치 수정
							</div>
							<div
								onClick={deleteBox}
							>
								삭제
							</div>
						</MoreList>
					}
				</UserInfoBox>
				<DetailContentBox>
					<div className="dayjs">
						<p>{dayjs(openDetail.content?.createdAt).format('YYYY년 MM월 DD일')}</p>
					</div>
					{ openDetail &&
						<SwitchContent
							openDetail={openDetail}
							isEdit={isEdit}
							setEdit={setEdit}
							onSubmitEdit={onSubmitEdit}
						/>
					}
				</DetailContentBox>
				{ !isEdit &&
				<>
				<CommentBox>
					{comments?.length === 0 &&
						<div style={{color: "#777", fontSize: "12px"}}>
							첫 댓글을 작성해보세요 !
						</div>
					}
						{comments?.map((c, i) => {
							return (
								<Comment
									key={(i)}
									style={{ background: `${editCommnetIdx === c.id ? "#444" : ""}`}}
								>
									{ c.BoardMember.profile_img ?
										<img src={c.BoardMember.profile_img} />
										:
										<NoImageProfile>
											<img src="/public/person.svg" />
										</NoImageProfile>
									}
									<div className="content">
										<p className="nickname">{c.BoardMember ? c.BoardMember.username : "unknown user"}</p>
										{ c.id === editCommnetIdx ?
										<div className="editComment">
											<input
												type="text"
												autoFocus
												value={head}
												onChange={OCHead}
											/>
											<div className="editButton">
												<div className="submit"
													onClick={() => {updateComment(c.id)}}
												>
													수정
												</div>
												<div className="cancel"
													onClick={() => { setEditCommentIdx(-1); setHead(''); }}
												>
													취소
												</div>
											</div>
										</div>
										:
										<div>
											<div className="commentBubble">{c.content}</div>
											<p>{dayjs(c.createdAt).diff(now, 'day') > -1 ? dayjs(c.createdAt).format('LT') : dayjs(c.createdAt).format('YYYY년 MM월 DD일')}{c.createdAt !== c.updatedAt && "(edited)"}</p>
										</div>
										}
									</div>
									{(c.BoardMemberId === userData.id && c.id !== editCommnetIdx) &&
										<>
											<MoreButton
												onClick={() => {
													setCMI(c.id === commentMenuIdx ? -1 : c.id);
													setContentMenu(false);
												}}
											>
												<img src="/public/more.svg" />
											</MoreButton>
											{
												commentMenuIdx === c.id &&
													<MoreList>
														<div
															onClick={() => { setEditCommentIdx(c.id); setCMI(-1); setHead(c.content);}}
														>수정</div>
														<div
															onClick={() => { deleteComment(c.id); }}
														>삭제</div>
													</MoreList>
											}
										</>
									}
								</Comment>
							);
						})}
					</CommentBox>
					<WriteComment
						onClick={submitComment}
					>
						{ userData.profile_img ?
							<img src={userData.profile_img} />
							:
							<NoImageProfile>
								<img src="/public/person.svg" />
							</NoImageProfile>
						}
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
					</>
				}
			{/*</Scrollbars>*/}
		</ContentBox>
	);
}

export default ContentContainer;
