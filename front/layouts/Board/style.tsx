import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const padeIn = keyframes`
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
`;

export const OpenMenu = styled.div`
	position: fixed;
	top: 1rem;
	right: 1rem;
	width: 30px;
	height: 30px;
	z-index: 9;
	cursor: pointer;
	background: #000;
	box-shadow: 0 0 4px 1px #ddd;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 30px;
`;

export const DetailBackground = styled('div')`
	width: 100%;
	height: 100vh;
	z-index: 12;
	position: fixed;
	top: 0;
	left: 0;
	background: rgba(0, 0, 0, 0.4);
	animation: ${padeIn} 0.5s ease-in-out 1;
`;

export const BoardHeader = styled.div`
	position: relative;
	width: 100vw;
	height: 48px;
	display: flex;
	background: #0e0e0e;
	box-shadow: 0 0 4px 1px #3e3e3e;

	& > div,
	a {
		top: 0;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;

		&.logo {
			padding: 12px;
			h2 {
				font-size: 16px;
				font-weight: 400;
			}
			img {
				height: 2.5rem;
				margin-left: -1rem;
			}
			&:visited {
				color: inherit;
			}
		}
	}

	.up {
		height: 100%;
		display: flex;
		position: absolute;
		width: 48px;
		right: 0;
		cursor: pointer;

		&:hover {
			background: rgba(255, 255, 255, 0.1);
		}
	}
`;
