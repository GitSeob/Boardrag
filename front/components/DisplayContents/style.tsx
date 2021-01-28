import styled from '@emotion/styled';

export const CContainer = styled.div`
	width: 100%;

	& > div {
		width: 100%;
	}
`;

export const ImageBox = styled.img`
	width: 100%;
	border-radius: 12px;
`;

export const HeadBox = styled.div`
	width: 100%;
	margin: 12px 0;

	h2 { font-size: 2em; }
`;

export const TextBox = styled.pre`
	width: 100%;
	white-space: break-spaces;
`;


export const EditArea = styled.div`
	position: relative;

	& > textarea {
		width: calc(100% - 50px);
		resize: none;
		padding: .5rem;
		border-radius: 12px;
		min-height: 240px;
		width: 100%;
		padding: 1em;
	}

	& > input {
		width: calc(100% - 50px);
		font-size: 24px;
		padding: .5rem;
		font-weight: 600;
		margin-bottom: 1rem;
	}
`;

export const EditHead = styled.input`
	font-size: 2em;
	padding: .5em;
	border-radius: 12px;
	width: 100%;
	margin: 12px 0;
`;

export const EditButtonBox = styled.div`
	right: 0;
	top: 0;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 12px;
	overflow: hidden;

	.button {
		background: #777;
		color: #fff;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		padding: 12px;
		border-radius: 12px;

		&.edit {
			background: #01babc;
			color: #000;
			margin-right: 24px;
		}
	}
`;

export const EditImageBox = styled.div`
	position: relative;
	width: 100%;
	height: fit-content;
	border-radius: 12px;
	overflow: hidden;

	& > img {
		width: 100%;
	}

	.temp {
		width: 100%;
		height: 6rem;
		background: #eee;
	}
`;
