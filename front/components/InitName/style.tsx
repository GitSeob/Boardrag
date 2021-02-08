import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const appear = keyframes`
	from {
		opacity: 0;
		transform: translate(-50%, -35%);
	}
	to {
		opacity: 1;
		transform: translate(-50%, -50%);
	}
`;

export const InitNameBox = styled.div`
	position: fixed;
	top: 50%;
	left: 50%;
	z-index: 21;
	padding: 24px;
	background: rgba(0, 0, 0, 0.5);
	border-radius: 24px;
	box-shadow: 0 0 6px 1px rgba(255, 255, 255, 0.7);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	transform: translate(-50%, -50%);
	animation: ${appear} 0.5s ease-in-out 1;

	& > p {
		font-size: 18px;

		&.sub {
			font-size: 12px;
			color: #777;
		}

		&.error {
			font-size: 12px;
			color: #bf5656;
		}
	}

	& > input {
		margin-top: 12px;
		width: 240px;
		text-align: center;
		color: #aaa;
		background: #555;
		padding: 1em;
		border-radius: 12px;

		&::placeholder {
			color: #aaa;
		}

		&:focus {
			background: #888;
			color: #fff;
		}
	}

	& > div.btn {
		margin-top: 12px;
		width: 240px;
		text-align: center;
		padding: 1em;
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.7);
		cursor: pointer;

		&:hover {
			background: #222;
			box-shadow: 0 0 4px 1px rgba(255, 255, 255, 0.7);
		}
	}
`;
