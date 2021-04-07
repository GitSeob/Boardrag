import styled from '@emotion/styled';

export const EditImageInput = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 50%;
	padding: 0.5rem 1rem;
	background: rgba(0, 0, 0, 0.4);
	color: #fff;
	border-radius: 3px;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 2rem;
	cursor: pointer;

	& > svg {
		fill: #fff;
		height: 2rem;
	}
`;
