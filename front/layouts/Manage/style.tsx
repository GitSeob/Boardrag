import styled from '@emotion/styled';
import { FixAltContainer } from '../../css/default';

export const Container = styled.div`
	margin-left: 200px;
	width: calc(100vw - 200px);
	min-height: 100vh;
	padding: 24px;

	@media screen and (max-width: 600px) {
		margin-left: 0;
		margin-top: 48px;
		width: 100%;
	}
`;

export const LoadingBG = styled.div`
	position: fixed;
	width: 100vw;
	height: 100vh;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const ListBox = styled.div`
	border: 3px solid rgba(255, 255, 255, 0.1);
	margin: 12px 0 24px 0;
`;

export const CPBox = styled(FixAltContainer)`
	z-index: 21;

	h4 {
		text-align: center;
	}
	p.warn {
		font-size: 10px;
		color: #b44;
	}

	& > div {
		width: 240px;

		& > p {
			text-align: center;
			margin: 12px 0;
			font-size: 10px;
			color: #bbb;
		}
		& > input {
			width: 100%;
			padding: 12px;
			border-radius: 12px;
		}
		div.btn {
			margin-top: 12px;
			padding: 12px;
			cursor: pointer;
			border: 1px solid #777;
			border-radius: 12px;
			text-align: center;

			&:hover {
				background: #111;
				box-shadow: 0 0 4px 1px #777;
			}
		}
	}
`;
