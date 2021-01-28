import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const open = keyframes`
	0% {
		max-height: 0;
	}
	50% {
		max-height: 50px;
	}
	100% {
		max-height: 100vh;
	}
`;

export const ListBox = styled.div`
	border: 3px solid rgba(255, 255, 255, .1);
	margin: 12px 0 24px 0;
`;

export const BarContainer = styled.div`
	border-bottom: 3px solid rgba(255, 255, 255, .1);
	&:last-child { border-bottom: none; }
`;

export const BoardBar = styled.div`
	padding: 6px;
	cursor: pointer;

	&:hover { background: #111117; }
`;

export const ManageBoard = styled.div`
	width: 100%;
	overflow: hidden;
	border-top: 1px solid rgba(255, 255, 255, .1);
	animation: ${open} .3s ease-in-out 1;

	& > div {
		padding: 12px 6px;
		background: rgba(0, 0, 0, .5);
	}
`;

export const MBButton = styled.div`
	width: 100%;
	padding: 6px 6px;
	font-size: 12px;
	line-height: 24px;
	text-align: center;
	background: #444;
	cursor: pointer;

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
