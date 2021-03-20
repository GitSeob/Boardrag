import styled from '@emotion/styled';

export const Footer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(0, 0, 0, 0.1);
	padding: 2rem 0;
	color: rgba(255, 255, 255, 0.6);
	font-size: 12px;
	width: 100vw;

	&.board {
		padding: 1rem;
		height: 100%;
		font-weight: 400;
	}

	img {
		height: 16px;
		margin-right: 6px;
	}
	a {
		color: inherit;
	}
`;
