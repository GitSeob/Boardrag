import styled from '@emotion/styled';

type BoardCardType = {
	url: string;
};

export const Container = styled.div`
	display: flex;
	margin: 12px;

	&.joined {
		width: fit-content;
		transition: 0.5s;
	}
	&.notJoined {
		flex-flow: row wrap;
	}
`;

export const BoardCard = styled('div')<BoardCardType>`
	padding: 12px;
	background: rgba(0, 0, 0, 0.5);
	border-radius: 10px;
	box-shadow: 0 0 4px 1px #aaa;
	cursor: pointer;
	margin: 0.6px 12px 6px 0;
	transition: 0.3s;
	width: 120px;
	height: 192px;
	overflow: hidden;
	position: relative;
	color: #fff;

	&::before {
		width: 100%;
		height: 100%;
		position: absolute;
		content: '';
		top: 0;
		left: 0;
		background: url(${(props) => props.url});
		background-size: cover;
		background-position: center;
		z-index: -1;
	}

	&:hover {
		box-shadow: 0 0 8px 1px #aaa;
		transform: scale(1.05);
	}

	& > h3 {
		height: 1.2rem;
		display: -webkit-box;
		overflow: hidden;
		word-break: keep-all;
		-webkit-line-clamp: 1;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
	}

	.description {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 6;
		-webkit-box-orient: vertical;
		word-wrap: break-word;
		line-height: 1.2rem;
		height: 7.2rem;
		color: #999;
		margin: 0.5rem 0;
	}

	.iconBox {
		color: #fff;
		position: relative;

		img {
			height: 0.8rem;
			color: #ff0000;

			&.lock {
				position: absolute;
				right: 0;
				top: 50%;
				transform: translateY(-50%);
			}
		}
	}
`;

export const PersonCount = styled.div`
	display: flex;
	align-items: center;
	font-size: 12px;

	& > img {
		margin-right: 0.2rem;
		height: 0.8rem;
	}
`;

export const NextBoardBtnBox = styled.div`
	position: absolute;
	right: 0;
	top: 18px;
	width: 36px;
	height: calc(100% - 36px);
	z-index: 2;
	margin: 0 !important;
	background: rgba(0, 0, 0, 0.7);
	box-shadow: 0px 0px 24px 12px #000;
	justify-content: center;
	align-items: center;
	cursor: pointer;

	@media screen and (max-width: 600px) {
		display: none !important;
	}
`;

export const BeforeBoardBtnbox = styled(NextBoardBtnBox)`
	left: 0;
`;
