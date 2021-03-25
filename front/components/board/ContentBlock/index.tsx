import React, { FC } from 'react';
import { IBoard, IDetail, IImage, INote, IText } from '@typings/datas';
import { ComponentBox, AltBox, TextComponent, ImageComponent, NoteComponent } from './style';

interface IContentBlock {
	boardData: IBoard | undefined;
	defaultRectSize: number;
	openDetailWindow(category: number, id: number, content: IText | IImage | INote): void;
}

const ContentBlock: FC<IContentBlock> = ({ boardData, defaultRectSize, openDetailWindow }) => {
	return (
		<>
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
		</>
	);
};

export default ContentBlock;
