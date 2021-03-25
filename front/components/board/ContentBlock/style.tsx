import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

type BoxPosition = {
	width: number;
	height: number;
	x: number;
	y: number;
};

type NoteProps = {
	src: string;
};

const enlarge = keyframes`
	0% {
		width: 0%;
		height: 0%;
	}
	50% {
		width: 30%;
		height: 30%;
	}
	100% {
		width: 100%;
		height: 100%;
	}
`;

export const ComponentBox = styled('div')<BoxPosition>`
	position: absolute;
	width: ${(props) => props.width};
	height: ${(props) => props.height};
	left: ${(props) => props.x};
	top: ${(props) => props.y};
	display: flex;
	align-items: center;
	justify-content: center;
	background: transparent;
	z-index: 4;
	padding: 2px;
`;

export const AltBox = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.8);
	display: none;
	justify-content: center;
	align-items: center;
	color: #fff;

	& > div {
		display: flex;
	}
`;

export const TextComponent = styled('pre')`
	position: relative;
	border-radius: 5px;
	box-shadow: 0 0 4px 1px rgba(255, 255, 255, 0.3);
	background: rgba(0, 0, 0, 0.75);
	color: #fff;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	animation: ${enlarge} 0.3s ease-in-out 1;
	overflow: hidden;
	padding: 5px;
	white-space: break-spaces;

	&:hover {
		box-shadow: 0 0 20px 3px rgba(255, 255, 255, 0.3);
		z-index: 5;

		.alt {
			display: flex;
		}
	}

	@media screen and (max-width: 800px) {
		font-size: 10px;
	}

	@media screen and (max-width: 500px) {
		font-size: 8px;
	}
`;

export const ImageComponent = styled('div')`
	position: relative;
	border-radius: 5px;
	box-shadow: 0 0 4px 1px rgba(255, 255, 255, 0.3);
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	border-radius: 5px;
	overflow: hidden;
	width: 100%;
	height: 100%;
	animation: ${enlarge} 0.3s ease-in-out 1;
	@media screen and (max-width: 800px) {
		font-size: 10px;
	}
	@media screen and (max-width: 500px) {
		font-size: 8px;
	}
	& > img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	&:hover {
		box-shadow: 0 0 20px 3px rgba(255, 255, 255, 0.3);
		z-index: 5;
		.alt {
			display: flex;
		}
	}
`;

export const NoteComponent = styled('div')<NoteProps>`
	position: relative;
	border-radius: 5px;
	box-shadow: 0 0 4px 1px rgba(255, 255, 255, 0.3);
	color: #fff;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	animation: ${enlarge} 0.3s ease-in-out 1;
	width: 100%;
	height: 100%;
	background: ${(props) => (props.src ? "url('" + props.src + "') no-repeat center" : 'rgba(0, 0, 0, .75)')};
	background-size: cover;
	overflow: hidden;
	padding: 5px;

	&:hover {
		box-shadow: 0 0 20px 3px rgba(255, 255, 255, 0.3);
		z-index: 5;
		.alt {
			display: flex;
		}
	}

	.head {
		text-shadow: ${(props) => (props.src ? '0 1px 5px #000' : 'none')};
		width: 100%;
		height: auto;
		font-size: 20px;
		font-weight: 600;
		padding-bottom: 0.5rem;
		white-space: break-spaces;
	}

	& > pre {
		text-shadow: ${(props) => (props.src ? '0 1px 5px #000' : 'none')};
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		padding: 5px;
		white-space: break-spaces;
	}

	@media screen and (max-width: 800px) {
		font-size: 10px;

		.head {
			font-size: 14px;
			padding-bottom: 0.2rem;
		}

		& > pre {
			padding: 2px;
		}
	}
	@media screen and (max-width: 500px) {
		font-size: 8px;

		.head {
			font-size: 12px;
			padding-bottom: 0.1rem;
		}
	}
`;
