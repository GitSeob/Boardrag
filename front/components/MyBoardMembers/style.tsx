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

export const Container = styled.div`
	width: 100%;
	padding: 12px;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;

	animation: ${open} .3s ease-in-out 1;
`;

export const MemberBlock = styled.div`
	position: relative;
	min-width: 90px;
	padding: 12px 18px;
	border-radius: 18px;
	margin: 6px;
	overflow: hidden;
	cursor: pointer;
	text-align: center;
	box-shadow: 0 0 4px 1px rgba(255, 255, 255, .7);

	& > div.kick {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		text-align: center;
		line-height: 40px;
		display: none;
		background: rgba(255, 120, 120, .7);
	}

	&:hover {
		box-shadow: 0 0 4px 1px rgba(255, 120, 120, .8);
		div.kick { display: block; }
	}
`;
