import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

type SC = {
	url: string;
	op: number;
	height: number;
};

const padeIn = keyframes`
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
`;

export const KonvaContainer = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	transition: 0.3s;
	min-height: calc(100vh - 48px);
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
