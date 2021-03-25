import { RectSize } from '@typings/workSpaceTypes';
import React, { FC, useState } from 'react';
import { OnModeAlt, ResizeRemote } from './style';

interface IChangeBlockStatus {
	rectSize: RectSize;
	defaultRectSize: number;
	cancelChangeBlockStatus: () => void;
	updatePosition: () => void;
	setRectSize({ width, height }: RectSize): void;
}

const ChangeBlockStatus: FC<IChangeBlockStatus> = ({
	rectSize,
	defaultRectSize,
	cancelChangeBlockStatus,
	updatePosition,
	setRectSize,
}) => {
	const [isEditSize, setIsEditSize] = useState(false);

	return (
		<div
			style={{
				position: 'absolute',
				top: '10px',
				left: '10px',
			}}
		>
			<OnModeAlt
				onClick={() => {
					cancelChangeBlockStatus();
				}}
			>
				<span>돌아가기</span>
				<img src="/public/close.svg" />
			</OnModeAlt>
			<OnModeAlt onClick={updatePosition}>
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
							onClick={() => setRectSize({ ...rectSize, width: rectSize.width - defaultRectSize })}
						>
							<img src="/public/arrow.svg" />
						</button>
						<div>{rectSize.width / defaultRectSize}</div>
						<button onClick={() => setRectSize({ ...rectSize, width: rectSize.width + defaultRectSize })}>
							<img src="/public/arrow.svg" />
						</button>
					</ResizeRemote>
					<ResizeRemote>
						<span>HEIGHT -</span>
						<button
							className="decrease"
							onClick={() => setRectSize({ ...rectSize, height: rectSize.height - defaultRectSize })}
						>
							<img src="/public/arrow.svg" />
						</button>
						<div>{rectSize.height / defaultRectSize}</div>
						<button onClick={() => setRectSize({ ...rectSize, height: rectSize.height + defaultRectSize })}>
							<img src="/public/arrow.svg" />
						</button>
					</ResizeRemote>
				</OnModeAlt>
			)}
		</div>
	);
};

export default ChangeBlockStatus;
