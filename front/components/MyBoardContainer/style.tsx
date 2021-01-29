import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const open = keyframes`
	from {
		max-height: 0;
	}
	to {
		max-height: 100vh;
	}
`;


export const BarContainer = styled.div`
	border-bottom: 3px solid rgba(255, 255, 255, .1);
	&:last-child { border-bottom: none; }
`;

export const BoardBar = styled.div`
	position: relative;
	padding: 6px 6px 6px 48px;
	cursor: pointer;
	font-size: 18px;

	&:hover { background: #111117; }

	& > img {
		position: absolute;
		top: 6px;
		left: 6px;
		width: 26px;
		height: 26px;
		transition: .3s;
	}
`;

export const ManageBoard = styled.div`
	width: 100%;
	overflow: hidden;
	border-top: 1px solid rgba(255, 255, 255, .1);
	animation: ${open} .3s ease-in-out 1;

	& > div {
		background: rgba(0, 0, 0, .5);

		&.btn {
			text-align: center;
			padding: 12px 6px;
			cursor: pointer;
			border-bottom: 2px solid rgba(255, 255, 255, .1);
			&:hover { background: rgba(0, 0, 0, .3); }
		}
	}
`;

export const MBButtonBox = styled.div`
	display: flex;
	flex-wrap: wrap;
	width: 100%;
	padding: 6px 0;
`;

export const MBButton = styled.div`
	width: calc(33% - 12px);
	margin: 0 auto;
	min-width: 240px;
	padding: 6px 6px;
	font-size: 12px;
	line-height: 24px;
	text-align: center;
	background: #444;
	cursor: pointer;
	border-radius: 12px;

	&.pw {
		background: rgba(255, 255, 255, .1);
		&:hover {
			background: rgba(255, 255, 255, .15);
		}
	}
	&.edit {
		background: #6767bf;
		&:hover {
			background: #5656bf;
		}
	}
	&.delete{
		background: #bf6767;
		&:hover {
			background: #bf5656;
		}
	}
`;

export const RowDiv = styled.div`
	width: 100%;
	display: flex;
	border-bottom: 2px solid rgba(255, 255, 255, .1);

	& > div {
		padding: 12px 6px;
		&.label {
			width: 120px;
			border-right: 2px solid rgba(255, 255, 255, .1);

			p {
				font-size: 10px;
				margin-top: 6px;
				color: #aaa;
			}
		}
	}

	& > input {
		width: 100%;
		padding: 1em;
		background: transparent;
		color: #bbb;

		&:focus {
			color: #fff;
		}
	}

	& > textarea {
		width: 100%;
		padding: 1em;
		background: transparent;
		color: #bbb;
		min-height: 120px;

		&:focus {
			color: #fff;
		}
	}
`;
