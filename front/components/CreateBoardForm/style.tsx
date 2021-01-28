import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const appearUp = keyframes`
	0% {
		opacity: 0;
		display: none;
		transform: translateY(10%);
	}
	50% {
		opacity: 1;
		display: block;
	}
`;

const appearDown = keyframes`
	0% {
		opacity: 0;
		display: none;
		transform: translateY(-10%);
	}
	50% {
		opacity: 1;
		display: block;
	}
`;

export const FormBox = styled.div`
	position: absolute;
	z-index: 21;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	padding: 1rem;
	width: 400px;
	border-radius: 10px;
	background: #000;
	box-shadow: 0 0 6px 1px #afafaf;

	input, h2 {
		width: 100%;
		margin-bottom: 1rem;
	}

	p.info {
		font-size: 10px;
		color: #aaa;

	}

	input {
		padding: .5rem;
		background: #fafafa;
		border-radius: 5px;
		margin-top: .5rem;
	}

	input[type="checkbox"] {
		width: fit-content;
		margin: 0;
		margin-right: .5rem;
	}

	input[type="password"]:disabled {
		background: #bababa;
		color: #444;
	}

	& > div {
		display: none;

		&.next {
			animation: ${appearUp} .6s ease-in-out 1;
			display: block;
		}

		&.before {
			animation: ${appearDown} .6s ease-in-out 1;
			display: block;
		}

		&.created {
			display: block;
		}
	}

	p.warn {
		color: #ff4444;
		font-size: 10px;
	}

	@media screen and (max-width: 600px) {
		width: 300px;
	}
`;


export const ProfileImageBox = styled.div`
	width: 100%;
	margin: .5rem 0;

	& > div {
		position: relative;
		margin: auto;
		width: 120px;
		height: 120px;
		border-radius: 90px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-size: cover;
		background-repeat: no-repeat
		background-position: center;

		& > img {
			width: 72px;
			height: 72px;
		}

		& > input {
			width: 1px;
			height: 1px;
			position: absolute;
			padding: 0;
			margin: -1px;
			overflow: hidden;
			clip: rect(0, 0, 0, 0);
			border: 0;
		}

		& > button {
			position: absolute;
			bottom: 0;
			right: 0;
			width: 36px;
			height: 36px;
			border-radius: 18px;
			padding: 8px;
			background: #002534;
			border: 1px solid #aaa;
			cursor: pointer;

			img {
				width: 18px;
				height: 18px;
			}
		}
	}
`;

export const BackgroundImageBox = styled.div`
	width: 100%;
	margin: .5rem 0;

	& > div {
		position: relative;
		margin: .5rem auto;
		width: 100%;
		height: calc((400px - 2rem) * 5 / 8);
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 1xp solid #cacaca;
		background-size: contain;
		background-repeat: no-repeat
		background-position: center;

		& > img {
			width: 72px;
			height: 72px;
		}

		& > input {
			width: 1px;
			height: 1px;
			position: absolute;
			padding: 0;
			margin: -1px;
			overflow: hidden;
			clip: rect(0, 0, 0, 0);
			border: 0;
		}

		& > button {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 36px;
			height: 36px;
			border-radius: 18px;
			padding: 8px;
			background: rgba(0, 0, 0, .6);
			border: 1px solid #111;
			cursor: pointer;

			img {
				width: 18px;
				height: 18px;
			}
		}
	}
`;

export const PageButtonBox = styled.div`
	position: relative;
	display: flex !important;
	align-items: center;
	width: 100%;
	padding: .5rem 0;
	min-height: 2rem;

	& > div {
		cursor: pointer;
		transition: .3s;
		display: flex;
		align-items: center;

		&.next {
			position: absolute;
			right: 0;
		}

		img {
			transition: .3s;
			width: 0;
			height: 1rem;
		}

		&:hover {
			img {
				width: 1rem;
			}
		}
	}
`;
