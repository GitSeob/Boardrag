import React, { FC, useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { IBL, IUser } from '@typings/datas';
import EditMyInfo from '@components/EditMyInfo';
import { BarContainer, BoardBar, ManageBoard, MBButton, MBButtonBox, RowDiv } from './style';
import { BackgroundImageBox } from '@components/CreateBoardForm/style';
import useInput from '@hooks/useInput';
import MyBoardMembers from '@components/MyBoardMembers';

interface IMBC {
	openBId: number;
	setOpenBId(id: number): void;
	c: IBL;
	setLoading(flg: boolean): void;
	toast: any;
	userData: IUser;
	BLRevalidate: () => void;
	setChangePW(argv: object): void;
}

const MyBoardContainer: FC<IMBC> = ({
	setChangePW,
	BLRevalidate,
	userData,
	openBId,
	setOpenBId,
	c,
	setLoading,
	toast,
}: IMBC) => {
	const [myInfoOpen, setMyInfoOpen] = useState(false);
	const [boardName, OCBN] = useInput(c.name);
	const [boardDescription, OCBD] = useInput(c.description);
	const [backgroundImage, setBI] = useState({
		url: c.background ? c.background : '',
		loading: false,
		now: Date.now(),
	});
	const [BGHeight, setBGHeight] = useState(0);
	const [editAvail, setEditAvail] = useState(false);
	const [openManageMembers, setOMM] = useState(false);
	const backgroundInput = React.useRef() as React.MutableRefObject<HTMLInputElement>;
	const bgRef = React.useRef() as React.MutableRefObject<HTMLDivElement>;

	const onClickBImageUpload = useCallback(() => {
		backgroundInput.current.click();
	}, []);

	const onChangeBackgroundImg = useCallback(
		async (e) => {
			const imageFormData = new FormData();
			imageFormData.append('image', e.target.files[0]);
			await setBI({
				...backgroundImage,
				loading: true,
			});
			await axios
				.post(`/api/uploadImage?type=background&name=${c.name}`, imageFormData)
				.then((res) => {
					setBI({
						url: res.data.url,
						loading: false,
						now: Date.now(),
					});
				})
				.catch(() => {
					setBI({
						...backgroundImage,
						loading: false,
					});
				});
		},
		[backgroundImage, c.name],
	);

	const removeBoard = useCallback(
		async (name) => {
			if (confirm(`정말 ${name} 보드를 삭제하시겠습니까?`)) {
				await setLoading(true);
				await axios.delete(`/api/deleteBoard/${name}`).then(() => {
					setOpenBId(-1);
					toast.dark(`${name} 보드가 삭제되었습니다.`);
				});
				setLoading(false);
			}
		},
		[toast],
	);

	const submitEdit = useCallback(async () => {
		if (confirm('Board 정보를 수정하시겠습니까?')) {
			await setLoading(true);
			await axios
				.post(`/api/editBoard/${c.name}`, {
					name: boardName,
					description: boardDescription,
					background: backgroundImage.url,
				})
				.then(() => {
					BLRevalidate();
					toast.dark('board 정보가 수정되었습니다.');
				})
				.catch((e) => {
					toast.error(e.response.data);
				});
			await setLoading(false);
		}
	}, [boardName, boardDescription, backgroundImage.url, c.name, toast, BLRevalidate, setLoading]);

	useEffect(() => {
		if (openBId !== c.id) setMyInfoOpen(false);
	}, [openBId, c.id]);

	useEffect(() => {
		if (boardName === c.name && boardDescription === c.description && backgroundImage.url === c.background)
			setEditAvail(false);
		else setEditAvail(true);
	}, [boardName, boardDescription, backgroundImage.url, c]);

	useEffect(() => {
		if (bgRef.current) {
			const width = bgRef.current.clientWidth;
			setBGHeight((width * 20) / 32);
		}
	}, [openBId, backgroundImage.url]);

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
					<RowDiv>
						<div className="label">NAME</div>
						<input type="text" value={boardName} onChange={OCBN} />
					</RowDiv>
					<RowDiv>
						<div className="label">DESCRIPTION</div>
						<textarea value={boardDescription} onChange={OCBD} />
					</RowDiv>
					<RowDiv>
						<div className="label">
							BACKGROUND
							<p>배경 이미지는 32x20 비율으로 적용됩니다.</p>
						</div>
						<BackgroundImageBox
							style={{
								padding: 0,
								margin: 0,
							}}
						>
							{backgroundImage.loading ? (
								'loading...'
							) : (
								<div
									ref={bgRef}
									style={{
										background:
											backgroundImage.url !== ''
												? `center / cover no-repeat url(${backgroundImage.url}?${backgroundImage.now})`
												: `radial-gradient(ellipse at bottom, #002534 0%, #090a0f 100%) no-repeat`,
										margin: 0,
										borderRadius: 0,
										height: `${BGHeight}px`,
									}}
								>
									<button onClick={onClickBImageUpload}>
										<img src="/public/camera.svg" style={{ color: 'white' }} />
									</button>
									<input
										type="file"
										accept=".jpg, .png"
										ref={backgroundInput}
										onChange={onChangeBackgroundImg}
									/>
								</div>
							)}
						</BackgroundImageBox>
					</RowDiv>
					<div
						className="btn"
						onClick={() => {
							setMyInfoOpen(!myInfoOpen);
						}}
					>
						내 정보
					</div>
					{myInfoOpen && (
						<EditMyInfo
							myData={c.Member.find((mb) => mb.UserId === userData.id)}
							boardData={c}
							setLoading={setLoading}
							setOpen={setMyInfoOpen}
							toast={toast}
						/>
					)}
					<div
						className="btn"
						onClick={() => {
							setOMM(!openManageMembers);
						}}
					>
						Members
					</div>
					{openManageMembers && (
						<MyBoardMembers boardName={c.name} members={c.Member} myId={userData.id} toast={toast} />
					)}
					<MBButtonBox>
						<MBButton
							className="pw"
							onClick={() => {
								setChangePW({
									name: c.name,
									flg: true,
									is_lock: c.is_lock,
								});
							}}
						>
							비밀번호 변경하기
						</MBButton>
						<MBButton className="edit" onClick={editAvail ? submitEdit : undefined}>
							수정사항 반영하기
						</MBButton>
						<MBButton
							className="delete"
							onClick={() => {
								removeBoard(c.name);
							}}
						>
							보드 삭제하기
						</MBButton>
					</MBButtonBox>
				</ManageBoard>
			)}
		</BarContainer>
	);
};

export default MyBoardContainer;
