import styled from '@emotion/styled';

export const UserMenu = styled.div`
	position: fixed;
	height: 100vh;
	width: 300px;
	right: 0;
	background: #000;
	transition: 0.3s;
	z-index: 11;
`;

export const MenuContainer = styled.div`
	position: relative;
	height: 100%;

	div {
		color: #fff;
	}
	& > p {
		padding: 3px;
		background: #444;
		font-size: 10px;
		text-align: center;
		color: #fff;
		width: 80%;
		margin: 0 auto;
		border-radius: 10px;
	}
`;

export const UserList = styled.div`
	width: 100%;
	height: 20%;
	padding: 1rem;

	& > ul {
		list-style-type: none;

		li {
			position: relative;
			padding-left: 1rem;
			&:before {
				position: absolute;
				content: '';
				top: 50%;
				left: 0;
				width: 5px;
				height: 5px;
				border-radius: 5px;
				background: #66dd66;
				transform: translateY(-50%);
			}
		}
	}
`;

export const LogOutButton = styled.div`
	width: 100%;
	height: 40px;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;

	&:hover {
		background: #111;
	}
`;
