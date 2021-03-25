import { IBoard, IDetail, IImage, INote, IText } from '@typings/datas';
import { Position, RectSize } from '@typings/workSpaceTypes';

export const checkRectArea = (
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

export const checkVertexInRect = (v: number, left: number, right: number) => {
	if (v > left && v < right) return true;
	return false;
};

export const contentChecker = (
	contents: Array<IText | IImage | INote>,
	openDetail: IDetail,
	rPos: Position,
	rectSize: RectSize,
	defaultRectSize: number,
) => {
	return contents
		.filter((content) => !(openDetail.category === 1 && content.id === openDetail.id))
		.find(
			(filteredContent) =>
				((checkVertexInRect(filteredContent.x * defaultRectSize, rPos.x, rPos.x + rectSize.width) ||
					checkVertexInRect(
						(filteredContent.x + filteredContent.width) * defaultRectSize,
						rPos.x,
						rPos.x + rectSize.width,
					)) &&
					(checkVertexInRect(filteredContent.y * defaultRectSize, rPos.y, rPos.y + rectSize.height) ||
						checkVertexInRect(
							(filteredContent.y + filteredContent.height) * defaultRectSize,
							rPos.y,
							rPos.y + rectSize.height,
						))) ||
				((checkVertexInRect(filteredContent.x * defaultRectSize, rPos.x, rPos.x + rectSize.width) ||
					checkVertexInRect(
						(filteredContent.x + filteredContent.width) * defaultRectSize,
						rPos.x,
						rPos.x + rectSize.width,
					)) &&
					(checkVertexInRect(
						rPos.y,
						filteredContent.y * defaultRectSize,
						(filteredContent.y + filteredContent.height) * defaultRectSize,
					) ||
						checkVertexInRect(
							rPos.y + rectSize.height,
							filteredContent.y * defaultRectSize,
							(filteredContent.y + filteredContent.height) * defaultRectSize,
						))) ||
				((checkVertexInRect(
					rPos.x,
					filteredContent.x * defaultRectSize,
					(filteredContent.x + filteredContent.width) * defaultRectSize,
				) ||
					checkVertexInRect(
						rPos.x + rectSize.width,
						filteredContent.x * defaultRectSize,
						(filteredContent.x + filteredContent.width) * defaultRectSize,
					)) &&
					(checkVertexInRect(filteredContent.y * defaultRectSize, rPos.y, rPos.y + rectSize.height) ||
						checkVertexInRect(
							(filteredContent.y + filteredContent.height) * defaultRectSize,
							rPos.y,
							rPos.y + rectSize.height,
						))),
		);
};

export const checkAllBox = (
	boardData: IBoard | undefined,
	openDetail: IDetail,
	rPos: Position,
	rectSize: RectSize,
	defaultRectSize: number,
) => {
	if (!boardData) return false;
	if (
		contentChecker(boardData.TextContents, openDetail, rPos, rectSize, defaultRectSize) ||
		contentChecker(boardData.Images, openDetail, rPos, rectSize, defaultRectSize) ||
		contentChecker(boardData.Notes, openDetail, rPos, rectSize, defaultRectSize)
	)
		return false;
	return true;
};

export const contentMoveAvailableChecker = (
	contents: Array<IText | IImage | INote>,
	openDetail: IDetail,
	rPos: Position,
	rectSize: RectSize,
	defaultRectSize: number,
) => {
	if (!contents) return true;
	return contents
		?.filter((content) => !(openDetail.category === 1 && content.id === openDetail.id))
		.find(
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
		? true
		: false;
};

export const isAvailPos = (
	boardData: IBoard | undefined,
	openDetail: IDetail,
	rPos: Position,
	rectSize: RectSize,
	defaultRectSize: number,
) => {
	if (!boardData) return false;
	if (!checkAllBox(boardData, openDetail, rPos, rectSize, defaultRectSize)) return false;
	return !(
		contentMoveAvailableChecker(boardData.TextContents, openDetail, rPos, rectSize, defaultRectSize) &&
		contentMoveAvailableChecker(boardData.Images, openDetail, rPos, rectSize, defaultRectSize) &&
		contentMoveAvailableChecker(boardData.Notes, openDetail, rPos, rectSize, defaultRectSize)
	);
};
