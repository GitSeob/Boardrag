import styled from '@emotion/styled';

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
