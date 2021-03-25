import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

type MenuPosition = {
	x: number;
	y: number;
	clicked: boolean;
	disp: boolean;
};

const apperMenu = keyframes`
	from {
		max-width: 0;
		max-height: 0;
	}
	to {
		max-width: 200px;
		max-height: 200px;
	}
`;

const disapperMenu = keyframes`
	from {
		max-width: 200px;
		max-height: 200px;
	}
	to {
		max-width: 0px;
		max-height: 0px
	}
`;

export const MenuBox = styled('div')<MenuPosition>`
	display: flex;
	flex-direction: column;
	position: absolute;
	background: rgba(0, 0, 0, .85);
	display: ${(props) => (props.disp ? 'block' : 'none')};
	overflow: hidden;
	color: #efefef;
	border-radius: 5px;
	box-shadow: 0 0 8px 1px rgb(0, 0, 0);
	max-width: ${(props) => (props.clicked ? '200px' : '0px')};
	max-height: ${(props) => (props.clicked ? '200px' : '0px')};
	top: ${(props) => props.y};
	left: ${(props) => props.x};
	animation: ${(props) => (props.clicked ? apperMenu : disapperMenu)} .3s ease-in-out 1;
	z-index: 10;
)`;

export const MenuAttr = styled.div`
	width: 120px;
	padding: 1rem;
	cursor: pointer;
	position: relative;

	&:hover {
		background: rgba(20, 20, 20, 0.5);
	}

	@media screen and (max-width: 800px) {
		font-size: 12px;
		width: 100px;
		padding: 0.5rem;
	}
	@media screen and (max-width: 500px) {
		font-size: 10px;
		width: 80px;
		padding: 0.3rem;
	}
`;
