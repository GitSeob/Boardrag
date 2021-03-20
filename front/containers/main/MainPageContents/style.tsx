import styled from '@emotion/styled';

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
	height: 1.5rem;
	margin-top: 2rem;
`;

export const SearchForm = styled.div`
	position: absolute;
	display: flex;
	align-item: center;
	justify-content: center;
	background: rgba(255, 255, 255, 0.2);
	border-radius: 1rem;
	height: 1.5rem;
	padding: 0.25rem 0.5rem;
	right: 0.25rem;
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
		width: 10rem;
	}

	@media screen and (max-width: 600px) {
		right: 2rem;
	}
`;

export const BoardContainer = styled.div`
	position: relative;
	max-width: 100vw;
	width: 100%;
	min-height: 10rem;
	overflow-x: hidden;
	-ms-overflow-style: none;
	scrollbar-width: none;

	&::-webkit-scrollbar {
		display: none; /* Chrome, Safari, Opera*/
	}

	& > .guide {
		display: flex;
		text-align: center;
		font-size: 12px;
		width: 100%;
		color: #555;
	}

	& > div {
		display: flex;
		margin: 12px;

		&.notJoin {
			flex-flow: row wrap;
		}
	}

	@media screen and (max-width: 600px) {
		overflow-x: scroll;
	}
`;
