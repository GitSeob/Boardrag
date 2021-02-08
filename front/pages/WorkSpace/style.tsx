import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

type MenuPosition = {
	x: number;
	y: number;
	clicked: boolean;
	disp: boolean;
};

type BoxPosition = {
	width: number;
	height: number;
	x: number;
	y: number;
};

type NoteProps = {
	src: string;
};

type SC = {
	url: string;
	op: number;
	height: number;
};

const apperMenu = keyframes`
	from {
		max-width: 0;
		max-height: 0;
	}
	to {
		max-width: 200px;
		max-height: 200px;
	}
`;

const disapperMenu = keyframes`
	from {
		max-width: 200px;
		max-height: 200px;
	}
	to {
		max-width: 0px;
		max-height: 0px
	}
`;

const padeIn = keyframes`
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
`;

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

export const KonvaContainer = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	transition: 0.3s;
`;

export const WarnMessage = styled.div`
	position: absolute;
	background: rgba(0, 0, 0, 0.6);
	z-index: 50;
	border-radius: 5px;
	color: #ff5555;
	font-weight: 500;
	font-size: 14px;
	padding: 1rem 2rem;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;

export const DetailBackground = styled('div')`
	width: 100%;
	height: calc(100% + 40px);
	z-index: 12;
	position: absolute;
	top: 0;
	left: 0;
	background: rgba(0, 0, 0, 0.4);
	transform: translateY(-48px);
	animation: ${padeIn} 0.5s ease-in-out 1;
`;

export const MenuBox = styled('div')<MenuPosition>`
	display: flex;
	flex-direction: column;
	position: absolute;
	background: rgba(0, 0, 0, .85);
	display: ${(props) => (props.disp ? 'block' : 'none')};
	overflow: hidden;
	color: #efefef;
	border-radius: 5px;
	box-shadow: 0 0 8px 1px rgb(0, 0, 0);
	max-width: ${(props) => (props.clicked ? '200px' : '0px')};
	max-height: ${(props) => (props.clicked ? '200px' : '0px')};
	top: ${(props) => props.y};
	left: ${(props) => props.x};
	animation: ${(props) => (props.clicked ? apperMenu : disapperMenu)} .3s ease-in-out 1;
	z-index: 10;
)`;

export const MenuAttr = styled.div`
	width: 120px;
	padding: 1rem;
	cursor: pointer;
	position: relative;

	&:hover {
		background: rgba(20, 20, 20, 0.5);
	}

	@media screen and (max-width: 800px) {
		font-size: 12px;
		width: 100px;
		padding: 0.5rem;
	}
	@media screen and (max-width: 500px) {
		font-size: 10px;
		width: 80px;
		padding: 0.3rem;
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

export const OnModeAlt = styled.div`
	position: relative;
	background: #000;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 21;
	color: #fff;
	padding: .5rem; 1rem;
	border-radius: 3px;
	line-height: 1.2;
	border: 1px solid #999;
	transition: .3s;
	cursor: pointer;
	width: fit-content;
	margin-bottom: 1rem;

	&.resize {
		flex-direction: column;
	}

	& > img {
		background: transparent;
	}

	& > span {
		width: 0;
		height: 1rem;
		overflow: hidden;
	}

	&:hover {
		& > img { margin-left: .5rem; }
		& > span {
			width: fit-content;
		}
	}
`;

export const ResizeRemote = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;

	& > span {
		width: 4rem;
	}

	& > button {
		width: 1.5rem;
		height: 1.5rem;
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: 600;
		background: transparent;
		cursor: pointer;
	}

	button.decrease img {
		transform: rotate(180deg);
	}

	& > div {
		background: rgb(32, 178, 170);
		box-shadow: 0 0 3px 1px rgb(32, 178, 170);
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 1rem;
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: 600;
	}

	&:nth-of-type(2) {
		margin-top: 0.5rem;
	}
`;

export const StageContainer = styled('div')<SC>`
	position: relative;

	&::before {
		width: 100%;
		height: ${(props) => props.height};
		position: absolute;
		content: '';
		top: 0;
		left: 0;
		background-image: url(${(props) => props.url});
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center;
		opacity: ${(props) => props.op};
	}
`;

export const ContentContainer = styled.div`
	position: fixed;
`;
