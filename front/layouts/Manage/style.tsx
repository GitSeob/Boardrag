import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

export const LoadingBG = styled.div`
	position: fixed;
	width: 100vw;
	height: 100vh;
	background: rgba(0, 0, 0, .5);
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const ListBox = styled.div`
	border: 3px solid rgba(255, 255, 255, .1);
	margin: 12px 0 24px 0;
`;
