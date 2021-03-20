import styled from '@emotion/styled';

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
	a {
		padding: 1.5rem;
		width: 100%;
		display: flex;
		align-items: center;
		height: 2rem;
		cursor: pointer;
		color: inherit;
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

		&:visited,
		&:hover,
		&:active {
			color: inherit;
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
