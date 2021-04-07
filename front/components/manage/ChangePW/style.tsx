import styled from '@emotion/styled';
import { FixAltContainer } from '../../../css/default';
import { keyframes } from '@emotion/react';

const appear = keyframes`
	from {
		opacity: 0;
		transform: translate(-50%, -40%);
	}
	to {
		opacity: 1;
		transform: translateY(-50%, -50%);
	}
`;

export const CPBox = styled(FixAltContainer)`
	z-index: 21;
	animation: ${appear} 0.5s ease-in-out 1;

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
