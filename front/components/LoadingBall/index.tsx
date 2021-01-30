import React from 'react';
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react';

const lds_ellipsis1  = keyframes`
	0% {
		transform: scale(0) translate(0, 0);
		background: #444;
	}
	100% {
		transform: scale(1) translate(24px, 0);
		background: #fff;
		box-shadow: 0 0 6px 1px rgba(255, 255, 255, .7);
	}
}`;

const lds_ellipsis2  = keyframes`
	0% {
		transform: translate(0, 0);
	}
	100% {
		transform: translate(24px, 0);
	}
`;

const lds_ellipsis4  = keyframes`
	0% {
		transform: translate(0, 0) scale(1);
		box-shadow: 0 0 6px 1px rgba(255, 255, 255, .7);
		background: #fff;
	}
	100% {
		transform: translate(24px, 0) scale(0);
		background: #444;
	}
`;

const LoadingBalls = styled.div`
	position: relative;
	margin: 0 auto;
	width: 80px;
	height: 80px;

	& > div {
		position: absolute;
		top: 33px;
		width: 13px !important;
		height: 13px !important;
		border-radius: 50%;
		background: #fff;
		box-shadow: 0 0 6px 1px rgba(255, 255, 255, .7);
		animation-timing-function: cubic-bezier(0, 1, 1, 0);

		&:nth-of-type(1) {
			left: 8px;
			animation: ${lds_ellipsis1} 0.6s infinite;
		}
		&:nth-of-type(2) {
			left: 32px;
			animation: ${lds_ellipsis2} 0.6s infinite;
			box-shadow: 0 0 6px 1px rgba(255, 255, 255, .7);
			background: #fff;
		}
		&:nth-of-type(3) {
			left: 56px;
			animation: ${lds_ellipsis2} 0.6s infinite;
			box-shadow: 0 0 6px 1px rgba(255, 255, 255, .7);
			background: #fff;
		}
		&:nth-of-type(4) {
			left: 80px;
			box-shadow: 0 0 6px 1px rgba(255, 255, 255, .7);
			background: #fff;
			animation: ${lds_ellipsis4} 0.6s infinite;
		}
	}
`;


const LoadingBall = () => {
	return (
		<div>
			<LoadingBalls>
				{/*<div></div>*/}
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</LoadingBalls>
		</div>
	);
};

export default LoadingBall;
