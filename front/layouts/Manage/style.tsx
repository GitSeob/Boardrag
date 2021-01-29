import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const open = keyframes`
	from {
		max-height: 0;
	}
	to {
		max-height: 100vh;
	}
`;

export const LoadingBG = styled.div`
	position: fixed;
	width: 100vw;
	height: 100vh;
	background: rgba(0, 0, 0, .1);
`;

export const ListBox = styled.div`
	border: 3px solid rgba(255, 255, 255, .1);
	margin: 12px 0 24px 0;
`;
