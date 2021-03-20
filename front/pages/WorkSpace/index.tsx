import React, { FC, useEffect, useCallback, useState } from 'react';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Stage, Layer, Group } from 'react-konva';
import Konva from 'konva';
import RectOnCanvas from '@components/board/RectOnCanvas';
import { IBoard, IComment, IDetail, IBM } from '@typings/datas';

import {
	DetailBackground,
	KonvaContainer,
	WarnMessage,
	MenuBox,
	MenuAttr,
	ComponentBox,
	AltBox,
	TextComponent,
	ImageComponent,
	NoteComponent,
	OnModeAlt,
	ResizeRemote,
	StageContainer,
} from './style';
import ImageAdd from '@components/write/ImageAdd';
import TextAdd from '@components/write/TextAdd';
import NoteAdd from '@components/write/NoteAdd';
import ContentContainer from '@components/board/ContentContainer';
import PageFooter from '@containers/layout/PageFooter';

type Position = {
	x: number;
	y: number;
};

type MenuPosition = {
	x: number;
	y: number;
	flg: boolean;
	disp: boolean;
};

type DraggedRect = {
	x: number;
	y: number;
	dragged: boolean;
};

type RectSize = {
	width: number;
	height: number;
};

type offset = {
	width: number;
	height: number;
	x: number;
	y: number;
};

interface IBoardProps {
	boardData: IBoard | undefined;
	userData: IBM;
	dataReval: () => void;
	board: string;
}

const WorkSpace: FC<IBoardProps> = ({ board, boardData, dataReval, userData }: IBoardProps) => {
	const layerRef = React.useRef() as React.MutableRefObject<Konva.Layer>;
	const [isDragged, setDragged] = useState<DraggedRect>({
		x: 0,
		y: 0,
		dragged: false,
	});

	const [mPos, setMPos] = useState<Position>({
		x: 0,
		y: 0,
	});

	const [rPos, setRPos] = useState<Position>({
		x: 0,
		y: 0,
	});

	const [menuState, setMenu] = useState<MenuPosition>({
		x: 0,
		y: 0,
		flg: false,
		disp: false,
	});
	const [offset, setOffset] = useState<offset>({
		x: 0,
		y: 0,
		width: 0,
		height: 0,
	});
	const [addState, setAdd] = useState<number>(0);
	const [openDetail, setOpenDetail] = useState<IDetail>({
		category: 0,
		id: 0,
		flg: false,
		loadComment: false,
		content: null,
	});
	const [warning, setWarning] = useState<string>('');
	const [width, setWidth] = useState<number>(window.innerWidth);
	const [defaultRectSize, setDefaultRectSize] = useState<number>(width / 32);
	const [rectSize, setRectSize] = useState<RectSize>({
		width: defaultRectSize,
		height: defaultRectSize,
	});
	const [height, setHeight] = useState(defaultRectSize * 20);
	const [comments, setComments] = useState<IComment[]>();
	const [canMove, setCanMove] = useState(false);
	const [isEditSize, setIsEditSize] = useState(false);

	const bg = boardData?.background ? boardData.background : '';

	useEffect(() => {
		setRPos({
			x: ((rPos.x / defaultRectSize) * window.innerWidth) / 32,
			y: ((rPos.y / defaultRectSize) * window.innerWidth) / 32,
		});
		setRectSize({
			width: ((rectSize.width / defaultRectSize) * window.innerWidth) / 32,
			height: ((rectSize.height / defaultRectSize) * window.innerWidth) / 32,
		});
		setWidth(window.innerWidth);
		setDefaultRectSize(window.innerWidth / 32);
		setHeight((window.innerWidth / 32) * 20);
	}, [defaultRectSize]);

	const viewAddComponent = useCallback(
		(number: number) => {
			const selectWidth = rectSize.width / defaultRectSize;
			const selectHeight = rectSize.height / defaultRectSize;
			if (selectHeight * selectWidth < 4) setWarning('최소 4칸의 영역을 선택해야합니다.');
			else if (number === 3 && selectHeight * selectWidth < 6)
				setWarning('이미지는 최소 6칸의 영역을 선택해야합니다.');
			else if (number === 2 && selectHeight * selectWidth < 20)
				setWarning('노트는 최소 20칸이상의 영역을 선택해야합니다.');
			else if (number === 2 && (selectHeight < 3 || selectWidth < 4))
				setWarning('노트는 4x3이상의 영역을 선택해야합니다.');
			else {
				setOffset({
					x: rPos.x / defaultRectSize,
					y: rPos.y / defaultRectSize,
					width: rectSize.width / defaultRectSize,
					height: rectSize.height / defaultRectSize,
				});
				setAdd(number);
			}
		},
		[rectSize, defaultRectSize, rPos],
	);

	const getRectSize = useCallback(() => {
		if (isDragged && !canMove) {
			let w =
				defaultRectSize *
				Math.floor(Math.abs(mPos.x - (mPos.x % defaultRectSize) - isDragged.x) / defaultRectSize + 1);
			let h =
				defaultRectSize *
				Math.floor(Math.abs(mPos.y - (mPos.y % defaultRectSize) - isDragged.y) / defaultRectSize + 1);

			const xdif = mPos.x - isDragged.x;
			const ydif = mPos.y - isDragged.y;

			if (xdif < 0 && ydif > 0) {
				setRPos({
					...rPos,
					x: mPos.x - (mPos.x % defaultRectSize),
				});
			} else if (xdif > 0 && ydif < 0) {
				setRPos({
					...rPos,
					y: mPos.y - (mPos.y % defaultRectSize),
				});
			} else if (xdif < 0 && ydif < 0) {
				setRPos({
					x: mPos.x - (mPos.x % defaultRectSize),
					y: mPos.y - (mPos.y % defaultRectSize),
				});
			}

			if (xdif > defaultRectSize) {
				w += defaultRectSize;
			}
			if (ydif > defaultRectSize) {
				h += defaultRectSize;
			}

			setRectSize({
				width: w,
				height: h,
			});
		}
	}, [mPos, isDragged, rPos, defaultRectSize, canMove]);

	const checkVertexInRect = useCallback((v: number, left: number, right: number) => {
		if (v > left && v < right) return true;
		return false;
	}, []);

	const checkAllBox = useCallback(() => {
		if (
			boardData?.TextContents &&
			boardData.TextContents.filter((elem) => !(openDetail.category === 1 && elem.id === openDetail.id)).find(
				(e) =>
					((checkVertexInRect(e.x * defaultRectSize, rPos.x, rPos.x + rectSize.width) ||
						checkVertexInRect((e.x + e.width) * defaultRectSize, rPos.x, rPos.x + rectSize.width)) &&
						(checkVertexInRect(e.y * defaultRectSize, rPos.y, rPos.y + rectSize.height) ||
							checkVertexInRect((e.y + e.height) * defaultRectSize, rPos.y, rPos.y + rectSize.height))) ||
					((checkVertexInRect(e.x * defaultRectSize, rPos.x, rPos.x + rectSize.width) ||
						checkVertexInRect((e.x + e.width) * defaultRectSize, rPos.x, rPos.x + rectSize.width)) &&
						(checkVertexInRect(rPos.y, e.y * defaultRectSize, (e.y + e.height) * defaultRectSize) ||
							checkVertexInRect(
								rPos.y + rectSize.height,
								e.y * defaultRectSize,
								(e.y + e.height) * defaultRectSize,
							))) ||
					((checkVertexInRect(rPos.x, e.x * defaultRectSize, (e.x + e.width) * defaultRectSize) ||
						checkVertexInRect(
							rPos.x + rectSize.width,
							e.x * defaultRectSize,
							(e.x + e.width) * defaultRectSize,
						)) &&
						(checkVertexInRect(e.y * defaultRectSize, rPos.y, rPos.y + rectSize.height) ||
							checkVertexInRect((e.y + e.height) * defaultRectSize, rPos.y, rPos.y + rectSize.height))),
			)
		)
			return false;
		if (
			boardData?.Images &&
			boardData.Images.filter((elem) => !(openDetail.category === 3 && elem.id === openDetail.id)).find(
				(e) =>
					((checkVertexInRect(e.x * defaultRectSize, rPos.x, rPos.x + rectSize.width) ||
						checkVertexInRect((e.x + e.width) * defaultRectSize, rPos.x, rPos.x + rectSize.width)) &&
						(checkVertexInRect(e.y * defaultRectSize, rPos.y, rPos.y + rectSize.height) ||
							checkVertexInRect((e.y + e.height) * defaultRectSize, rPos.y, rPos.y + rectSize.height))) ||
					((checkVertexInRect(e.x * defaultRectSize, rPos.x, rPos.x + rectSize.width) ||
						checkVertexInRect((e.x + e.width) * defaultRectSize, rPos.x, rPos.x + rectSize.width)) &&
						(checkVertexInRect(rPos.y, e.y * defaultRectSize, (e.y + e.height) * defaultRectSize) ||
							checkVertexInRect(
								rPos.y + rectSize.height,
								e.y * defaultRectSize,
								(e.y + e.height) * defaultRectSize,
							))) ||
					((checkVertexInRect(rPos.x, e.x * defaultRectSize, (e.x + e.width) * defaultRectSize) ||
						checkVertexInRect(
							rPos.x + rectSize.width,
							e.x * defaultRectSize,
							(e.x + e.width) * defaultRectSize,
						)) &&
						(checkVertexInRect(e.y * defaultRectSize, rPos.y, rPos.y + rectSize.height) ||
							checkVertexInRect((e.y + e.height) * defaultRectSize, rPos.y, rPos.y + rectSize.height))),
			)
		)
			return false;
		if (
			boardData?.Notes &&
			boardData.Notes.filter((elem) => !(openDetail.category === 2 && elem.id === openDetail.id)).find(
				(e) =>
					((checkVertexInRect(e.x * defaultRectSize, rPos.x, rPos.x + rectSize.width) ||
						checkVertexInRect((e.x + e.width) * defaultRectSize, rPos.x, rPos.x + rectSize.width)) &&
						(checkVertexInRect(e.y * defaultRectSize, rPos.y, rPos.y + rectSize.height) ||
							checkVertexInRect((e.y + e.height) * defaultRectSize, rPos.y, rPos.y + rectSize.height))) ||
					((checkVertexInRect(e.x * defaultRectSize, rPos.x, rPos.x + rectSize.width) ||
						checkVertexInRect((e.x + e.width) * defaultRectSize, rPos.x, rPos.x + rectSize.width)) &&
						(checkVertexInRect(rPos.y, e.y * defaultRectSize, (e.y + e.height) * defaultRectSize) ||
							checkVertexInRect(
								rPos.y + rectSize.height,
								e.y * defaultRectSize,
								(e.y + e.height) * defaultRectSize,
							))) ||
					((checkVertexInRect(rPos.x, e.x * defaultRectSize, (e.x + e.width) * defaultRectSize) ||
						checkVertexInRect(
							rPos.x + rectSize.width,
							e.x * defaultRectSize,
							(e.x + e.width) * defaultRectSize,
						)) &&
						(checkVertexInRect(e.y * defaultRectSize, rPos.y, rPos.y + rectSize.height) ||
							checkVertexInRect((e.y + e.height) * defaultRectSize, rPos.y, rPos.y + rectSize.height))),
			)
		)
			return false;
		return true;
	}, [boardData, rPos, defaultRectSize, rectSize, openDetail, checkVertexInRect]);

	const checkRectArea = (
		x: number,
		y: number,
		w: number,
		h: number,
		rx: number,
		ry: number,
		rw: number,
		rh: number,
	) => {
		if (rx >= x && ry >= y && rx + rw <= x + w && ry + rh <= y + h) return false;
		return true;
	};

	const isAvailPos = useCallback(() => {
		if (!checkAllBox()) return false;
		if (
			boardData?.TextContents?.filter((elem) => !(openDetail.category === 1 && elem.id === openDetail.id)).find(
				(e) =>
					!checkRectArea(
						e.x * defaultRectSize,
						e.y * defaultRectSize,
						e.width * defaultRectSize,
						e.height * defaultRectSize,
						rPos.x,
						rPos.y,
						rectSize.width,
						rectSize.height,
					),
			)
		)
			return false;
		if (
			boardData?.Images?.filter((elem) => !(openDetail.category === 3 && elem.id === openDetail.id)).find(
				(e) =>
					!checkRectArea(
						e.x * defaultRectSize,
						e.y * defaultRectSize,
						e.width * defaultRectSize,
						e.height * defaultRectSize,
						rPos.x,
						rPos.y,
						rectSize.width,
						rectSize.height,
					),
			)
		)
			return false;
		if (
			boardData?.Notes?.filter((elem) => !(openDetail.category === 2 && elem.id === openDetail.id)).find(
				(e) =>
					!checkRectArea(
						e.x * defaultRectSize,
						e.y * defaultRectSize,
						e.width * defaultRectSize,
						e.height * defaultRectSize,
						rPos.x,
						rPos.y,
						rectSize.width,
						rectSize.height,
					),
			)
		)
			return false;
		return true;
	}, [boardData, rPos, rectSize, defaultRectSize, openDetail, checkAllBox]);

	const openAddComponent = useCallback(
		(number: number) => {
			if (!checkAllBox()) setWarning('겹치는 영역이 존재합니다.');
			else viewAddComponent(number);
		},
		[checkAllBox, viewAddComponent],
	);

	const initStates = useCallback(() => {
		setRectSize({
			width: defaultRectSize,
			height: defaultRectSize,
		});
		setDragged({
			...isDragged,
			dragged: false,
		});
		setMenu({
			...menuState,
			flg: false,
		});
		setAdd(0);
		setWarning('');
	}, [defaultRectSize, isDragged, menuState]);

	const openDetailWindow = useCallback(
		(category, id, content) => {
			setOpenDetail({
				...openDetail,
				flg: true,
				category: category,
				id: id,
				content: content,
			});
			setComments(content.Comments);
		},
		[openDetail],
	);

	const onInitContent = useCallback(() => {
		setOpenDetail({
			category: 0,
			id: 0,
			flg: false,
			loadComment: false,
			content: null,
		});
	}, []);

	const onSubmitEdit = useCallback(
		async (text, head, url) => {
			let requestURL = '';
			let data = {
				x: openDetail.content?.x,
				y: openDetail.content?.y,
				width: openDetail.content?.width,
				height: openDetail.content?.height,
				content: '',
				head: '',
				paragraph: '',
				background_img: '',
				url: '',
			};
			if (openDetail.category === 1) {
				requestURL = `/api/board/${board}/text/${openDetail.id}`;
				data = {
					...data,
					content: text,
				};
			} else if (openDetail.category === 2) {
				requestURL = `/api/board/${board}/note/${openDetail.id}`;
				data = {
					...data,
					background_img: url,
					head: head,
					paragraph: text,
				};
			} else if (openDetail.category === 3) {
				if (url === '') {
					await setWarning('이미지를 다시 업로드해주세요');
					await setTimeout(() => {
						setWarning('');
					}, 2000);
					return;
				}
				requestURL = `/api/board/${board}/image/${openDetail.id}`;
				data = { ...data, url: url };
			} else {
				await setWarning('잘못된 접근입니다.');
				await setTimeout(() => {
					setWarning('');
				}, 2000);
				return;
			}
			await axios
				.patch(requestURL, data)
				.then(() => {
					setOpenDetail({
						category: 0,
						id: 0,
						flg: false,
						loadComment: false,
						content: null,
					});
					toast.dark(`게시물이 수정되었습니다.`);
					dataReval();
				})
				.catch((e) => {
					setWarning(e.response.data.reason);
					setTimeout(() => {
						setWarning('');
					}, 2000);
				});
		},
		[openDetail, board, dataReval],
	);

	const moveMode = useCallback(() => {
		if (openDetail.content) {
			setMenu({ ...menuState, flg: false, disp: false });
			setOpenDetail({
				...openDetail,
				flg: false,
			});
			setCanMove(true);
			setRPos({
				x: openDetail.content.x * defaultRectSize,
				y: openDetail.content.y * defaultRectSize,
			});
			setRectSize({
				width: openDetail.content.width * defaultRectSize,
				height: openDetail.content.height * defaultRectSize,
			});
		}
	}, [openDetail, defaultRectSize, menuState]);

	useEffect(() => {
		if (addState == 0 && !canMove) {
			if (isDragged.dragged) getRectSize();
			else {
				setRPos({
					x: mPos.x - (mPos.x % defaultRectSize),
					y: mPos.y - (mPos.y % defaultRectSize),
				});
			}
		}
	}, [mPos, isDragged, addState, defaultRectSize, canMove]);

	const mouseMove = (e: any) => {
		if (!menuState.flg) {
			const transform = layerRef.current.getAbsoluteTransform().copy();
			transform.invert();
			const pos = e.target.getStage()?.getPointerPosition();
			setMPos({
				x: pos?.x as number,
				y: pos?.y as number,
			});
		}
	};

	const mouseDown = () => {
		if (addState === 0 && !canMove)
			setDragged({
				x: mPos.x,
				y: mPos.y,
				dragged: true,
			});
	};

	const mouseUp = () => {
		if (canMove) return;
		else if (!menuState.flg && addState == 0) {
			const mX = mPos.x > window.innerWidth - 140 ? mPos.x - 140 : mPos.x;
			const mY = mPos.y > window.innerHeight - 140 ? mPos.y - 140 : mPos.y;
			setMenu({
				x: mX,
				y: mY,
				flg: true,
				disp: true,
			});
		} else {
			initStates();
		}
	};

	const rectDE = (e: any) => {
		setRPos({
			x: e.target.x() - (e.target.x() % defaultRectSize),
			y: e.target.y() - (e.target.y() % defaultRectSize),
		});
	};

	const UpdatePosition = async () => {
		if (!isAvailPos()) return setWarning('이동할 수 없는 위치입니다.');
		let requestURL = '';
		const selectWidth = rectSize.width / defaultRectSize;
		const selectHeight = rectSize.height / defaultRectSize;
		if (selectHeight * selectWidth < 4) return setWarning('최소 4칸의 영역을 선택해야합니다.');
		else if (openDetail.category === 3 && selectHeight * selectWidth < 6)
			return setWarning('이미지는 최소 6칸의 영역을 선택해야합니다.');
		else if (openDetail.category === 2 && selectHeight * selectWidth < 20)
			return setWarning('노트는 최소 20칸이상의 영역을 선택해야합니다.');
		else if (openDetail.category === 2 && (selectHeight < 3 || selectWidth < 4))
			return setWarning('노트는 4x3이상의 영역을 선택해야합니다.');
		let data = {
			x: rPos.x / defaultRectSize,
			y: rPos.y / defaultRectSize,
			width: rectSize.width / defaultRectSize,
			height: rectSize.height / defaultRectSize,
			content: openDetail.content?.content,
			head: openDetail.content?.head,
			paragraph: openDetail.content?.paragraph,
			background_img: openDetail.content?.background_img,
			url: openDetail.content?.url,
		};
		if (openDetail.category === 1) {
			requestURL = `/api/board/${board}/text/${openDetail.id}`;
		} else if (openDetail.category === 2) {
			requestURL = `/api/board/${board}/note/${openDetail.id}`;
		} else if (openDetail.category === 3) {
			requestURL = `/api/board/${board}/image/${openDetail.id}`;
		} else {
			await setWarning('잘못된 접근입니다.');
			await setTimeout(() => {
				setWarning('');
			}, 2000);
			return;
		}
		await axios
			.patch(requestURL, data)
			.then((res) => {
				dataReval();
				onInitContent();
				setWarning('');
				setCanMove(false);
				if (res.data === false) toast.dark('게시물이 수정되었습니다.');
				else toast.dark(`남은 칸은 ${res.data}칸 입니다.`);
				initStates();
			})
			.catch((e) => {
				setWarning(e.response.data.reason);
				setTimeout(() => {
					setWarning('');
				}, 2000);
			});
		axios.patch;
	};

	useEffect(() => {
		if (addState !== 0)
			setMenu({
				...menuState,
				flg: false,
			});
	}, [addState]);

	useEffect(() => {
		let editedContent;
		if (openDetail.category === 1) {
			editedContent = boardData?.TextContents.find((v) => v.id === openDetail.id)?.Comments;
		} else if (openDetail.category === 2) {
			editedContent = boardData?.Notes?.find((v) => v.id === openDetail.id)?.Comments;
		} else if (openDetail.category === 3) {
			editedContent = boardData?.Images?.find((v) => v.id === openDetail.id)?.Comments;
		}
		setComments(editedContent);
	}, [boardData, openDetail]);

	return (
		<KonvaContainer>
			{warning !== '' && <WarnMessage>{warning}</WarnMessage>}
			{openDetail.flg && <DetailBackground onClick={onInitContent} />}
			<ContentContainer
				openDetail={openDetail}
				userData={userData}
				board={board}
				toast={toast}
				onSubmitEdit={onSubmitEdit}
				moveMode={moveMode}
				dataReval={dataReval}
				setOpenDetail={setOpenDetail}
				comments={comments}
			/>
			<MenuBox clicked={menuState.flg} x={menuState.x} y={menuState.y} disp={menuState.disp}>
				<MenuAttr onClick={() => openAddComponent(1)}>Text</MenuAttr>
				<MenuAttr onClick={() => openAddComponent(2)}>Note</MenuAttr>
				<MenuAttr onClick={() => openAddComponent(3)}>Image</MenuAttr>
			</MenuBox>
			{addState === 1 && (
				<TextAdd
					toast={toast}
					width={rectSize.width}
					height={rectSize.height}
					x={rPos.x}
					y={rPos.y}
					offset={offset}
					initStates={initStates}
					board={board}
					BMID={userData.id}
				/>
			)}
			{addState === 2 && (
				<NoteAdd
					toast={toast}
					width={rectSize.width}
					height={rectSize.height}
					x={rPos.x}
					y={rPos.y}
					offset={offset}
					initStates={initStates}
					board={board}
					BMID={userData.id}
				/>
			)}
			{addState === 3 && (
				<ImageAdd
					toast={toast}
					width={rectSize.width}
					height={rectSize.height}
					x={rPos.x}
					y={rPos.y}
					offset={offset}
					initStates={initStates}
					board={board}
					BMID={userData.id}
				/>
			)}
			{boardData?.TextContents &&
				boardData?.TextContents.map((c, i) => {
					return (
						<ComponentBox
							key={i}
							width={defaultRectSize * c.width}
							height={defaultRectSize * c.height}
							x={defaultRectSize * c.x}
							y={defaultRectSize * c.y}
						>
							<TextComponent onClick={() => openDetailWindow(1, c.id, c)}>
								{c.content}
								<AltBox className="alt">
									{c.BoardMember ? c.BoardMember.username : 'unknown user'}
								</AltBox>
							</TextComponent>
						</ComponentBox>
					);
				})}
			{boardData?.Images &&
				boardData?.Images.map((c, i) => {
					return (
						<ComponentBox
							key={i}
							width={defaultRectSize * c.width}
							height={defaultRectSize * c.height}
							x={defaultRectSize * c.x}
							y={defaultRectSize * c.y}
						>
							<ImageComponent onClick={() => openDetailWindow(3, c.id, c)}>
								<AltBox className="alt">
									{c.BoardMember ? c.BoardMember.username : 'unknown user'}
								</AltBox>
								<img src={c.url} />
							</ImageComponent>
						</ComponentBox>
					);
				})}
			{boardData?.Notes &&
				boardData?.Notes.map((c, i) => {
					return (
						<ComponentBox
							key={i}
							width={defaultRectSize * c.width}
							height={defaultRectSize * c.height}
							x={defaultRectSize * c.x}
							y={defaultRectSize * c.y}
						>
							<NoteComponent
								onClick={() => openDetailWindow(2, c.id, c)}
								src={c.background_img ? c.background_img : ''}
							>
								<AltBox className="alt">
									{c.BoardMember ? c.BoardMember.username : 'unknown user'}
								</AltBox>
								<h3 className="head">{c.head}</h3>
								<pre className="para" style={{ height: defaultRectSize * c.height - 10 }}>
									<p>{c.paragraph}</p>
								</pre>
							</NoteComponent>
						</ComponentBox>
					);
				})}
			<StageContainer
				url={bg}
				op={canMove ? 0.1 : 0.8}
				height={height}
				style={{
					zIndex: canMove ? 20 : 1,
				}}
			>
				<Stage
					style={{
						height: height,
						background: canMove ? 'rgba(0, 0, 0, .2)' : '',
					}}
					width={width}
					height={height}
					onMouseMove={!canMove ? mouseMove : undefined}
					onMouseDown={!canMove ? mouseDown : undefined}
					onMouseUp={!canMove ? mouseUp : undefined}
				>
					<Layer ref={layerRef}>
						<Group>
							<RectOnCanvas
								x={rPos.x}
								y={rPos.y}
								canMove={canMove}
								openDetail={openDetail}
								rectSize={rectSize}
								rectDE={rectDE}
							/>
						</Group>
					</Layer>
				</Stage>
			</StageContainer>
			{canMove && (
				<div
					style={{
						position: 'absolute',
						top: '10px',
						left: '10px',
					}}
				>
					<OnModeAlt
						onClick={() => {
							setCanMove(false);
							initStates();
						}}
					>
						<span>돌아가기</span>
						<img src="/public/close.svg" />
					</OnModeAlt>
					<OnModeAlt onClick={UpdatePosition}>
						<span>수정하기</span>
						<img src="/public/check.svg" />
					</OnModeAlt>
					{!isEditSize ? (
						<OnModeAlt onClick={() => setIsEditSize(true)}>
							<span>크기 변경하기</span>
							<img src="/public/resize.svg" />
						</OnModeAlt>
					) : (
						<OnModeAlt className="resize" style={{ cursor: 'none' }}>
							<ResizeRemote>
								<span>WIDTH -</span>
								<button
									className="decrease"
									onClick={() =>
										setRectSize({ ...rectSize, width: rectSize.width - defaultRectSize })
									}
								>
									<img src="/public/arrow.svg" />
								</button>
								<div>{rectSize.width / defaultRectSize}</div>
								<button
									onClick={() =>
										setRectSize({ ...rectSize, width: rectSize.width + defaultRectSize })
									}
								>
									<img src="/public/arrow.svg" />
								</button>
							</ResizeRemote>
							<ResizeRemote>
								<span>HEIGHT -</span>
								<button
									className="decrease"
									onClick={() =>
										setRectSize({ ...rectSize, height: rectSize.height - defaultRectSize })
									}
								>
									<img src="/public/arrow.svg" />
								</button>
								<div>{rectSize.height / defaultRectSize}</div>
								<button
									onClick={() =>
										setRectSize({ ...rectSize, height: rectSize.height + defaultRectSize })
									}
								>
									<img src="/public/arrow.svg" />
								</button>
							</ResizeRemote>
						</OnModeAlt>
					)}
				</div>
			)}
			<PageFooter className="board" />
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
		</KonvaContainer>
	);
};

export default WorkSpace;
