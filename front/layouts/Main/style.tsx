import styled from '@emotion/styled';

type BC = {
	url: string;
};

export const Menu = styled.div`
	position: fixed;
	height: 100%;
	width: 200px;
	background: #0e0e0e;
	z-index: 3;
	color: #fff;

	@media screen and (max-width: 600px) {
		height: 48px;
		display: flex;
		box-shadow: 0 0 4px 1px #3e3e3e;
		width: 100%;
	}
`;

export const RelBox = styled.div`
	position: relative;
	width: 100%;
	height: 100%;

	& > div,
	.logo {
		padding: 1.5rem;
		width: 100%;
		display: flex;
		align-items: center;
		height: 2rem;
		cursor: pointer;
		h2 {
			font-size: 16px !important;
			font-weight: 400 !important;
		}

		&:hover {
			background: #222;
		}

		img {
			height: 1rem;
			margin-right: 0.3rem;
		}
	}

	.logout {
		position: absolute;
		bottom: 0;
	}

	.logo {
		padding: 2rem 1.5rem;

		img {
			height: 3.5rem;
			margin-left: -2rem;
		}
		&:hover {
			background: none;
		}
		&:visited {
			color: inherit;
		}
	}

	@media screen and (max-width: 600px) {
		display: flex;

		& > div {
			width: fit-content;
			padding: 1rem;
			height: 100%;

			p {
				display: none;
			}
		}

		.logout {
			position: relative;
		}

		.logo {
			padding: 1rem;
			height: 100%;
			img {
				height: 2.5rem;
				margin-left: -1rem;
			}
		}
	}
`;

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

export const BCHeader = styled.div`
	position: relative;
	width: 100%;
`;

export const SearchForm = styled.form`
	position: absolute;
	display: flex;
	align-item: center;
	justify-content: center;
	background: rgba(255, 255, 255, 0.2);
	border-radius: 1rem;
	height: 1.5rem;
	padding: 0.25rem 0.5rem;
	right: 0;
	top: 0;
	font-size: 10px;

	img {
		height: 1rem;
		margin-right: 0.3rem;
	}

	input {
		background: transparent;
		padding: 0.1rem 0.5rem;
		color: #fff;
		width: 200px;
	}
`;

export const BoardContainer = styled.div`
	position: relative;
	width: 100%;
	min-height: 10rem;

	& > .guide {
		display: flex;
		text-align: center;
		font-size: 12px;
		width: 100%;
		color: #555;
	}

	& > div {
		display: flex;
		margin: 12px 0;

		&.notJoin {
			flex-flow: row wrap;
		}
	}
`;

export const BoardCard = styled('div')<BC>`
	padding: 12px;
	background: rgba(0, 0, 0, 0.5);
	border-radius: 10px;
	box-shadow: 0 0 4px 1px #aaa;
	cursor: pointer;
	margin: 0.6px 12px 6px 0;
	transition: 0.3s;
	width: 120px;
	height: 192px;
	overflow: hidden;
	position: relative;
	color: #fff;

	&::before {
		width: 100%;
		height: 100%;
		position: absolute;
		content: '';
		top: 0;
		left: 0;
		background: url(${(props) => props.url});
		background-size: cover;
		background-position: center;
		z-index: -1;
	}

	&:hover {
		box-shadow: 0 0 8px 1px #aaa;
		transform: scale(1.05);
	}

	& > h3 {
		height: 1.2rem;
		display: -webkit-box;
		overflow: hidden;
		word-break: keep-all;
		-webkit-line-clamp: 1;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
	}

	.description {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 6;
		-webkit-box-orient: vertical;
		word-wrap: break-word;
		line-height: 1.2rem;
		height: 7.2rem;
		color: #999;
		margin: 0.5rem 0;
	}

	.iconBox {
		color: #fff;
		position: relative;

		img {
			height: 0.8rem;
			color: #ff0000;

			&.lock {
				position: absolute;
				right: 0;
				top: 50%;
				transform: translateY(-50%);
			}
		}
	}
`;

export const DarkBackground = styled.div`
	position: fixed;
	width: 100vw;
	height: 100vh;
	z-index: 20;
	background: rgba(0, 0, 0, 0.3);
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const PersonCount = styled.div`
	display: flex;
	align-items: center;
	font-size: 12px;

	& > img {
		margin-right: 0.2rem;
		height: 0.8rem;
	}
`;

export const NextBoardBtnBox = styled.div`
	position: absolute;
	right: -24px;
	top: 18px;
	width: 36px;
	height: calc(100% - 36px);
	z-index: 2;
	margin: 0 !important;
	background: rgba(0, 0, 0, 0.7);
	box-shadow: 0px 0px 24px 12px #000;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
`;

export const BeforeBoardBtnbox = styled(NextBoardBtnBox)`
	left: -24px;
`;

export const Footer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(0, 0, 0, 0.1);
	padding: 2rem 0;
	color: rgba(255, 255, 255, 0.6);
	font-size: 12px;
	width: 100vw;

	img {
		height: 16px;
		margin-right: 6px;
	}
	a {
		color: inherit;
	}
`;
