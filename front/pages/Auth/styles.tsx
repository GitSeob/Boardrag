import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const appearUp = keyframes`
	from {
		transform: translate(-50%, -30%);
		opacity: 0;
	}
	to {
		transform: translate(-50%, -50%);
		opacity: 1;
	}
`;

export const LoginContainer = styled.div`
	background: rgba(0, 0, 0, 0.3);
	padding: 1rem;
	width: fit-content;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	animation: ${appearUp} 0.5s ease-in-out 1;
	color: #fff;

	& > img {
		height: 4rem;
		margin-left: -1.8rem;
		margin-bottom: 1rem;
	}

	& > h1 {
		text-align: center;
		margin-bottom: 1rem;
	}

	& > p {
		color: #ff7777;
		font-size: 10px;
		margin-top: 0.5rem;
		text-align: center;
	}
`;

export const LoginButton = styled.a`
	position: relative;
	display: flex;
	margin: 0 auto;
	width: fit-content;

	img {
		height: 40px;
	}
`;
