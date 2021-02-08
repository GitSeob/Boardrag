import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const padeAppearUp = keyframes`
	from {
		opacity: 0;
		transform: translate(-50%, -40%);
	}
	to {
		opacity: 1;
		transform: translate(-50%, -50%);
	}
`;

const padeDisappearDown = keyframes`
	from {
		opacity: 1;
		transform: translate(-50%, -50%);
	}
	to {
		opacity: 0;
		transform: translate(-50%, -40%);
	}
`;

const moreMenu = keyframes`
	from {
		width: 0;
		height: 0;
	}
	to {
		width: 60px;
		height: 60px;
	}
`;

type Tflg = {
	flg: boolean;
};

export const ContentBox = styled('div')<Tflg>`
	position: fixed;
	overflow: ${(props) => (props.flg ? 'auto' : 'hidden')};
	width: ${(props) => (props.flg ? '760px' : '0')};
	max-height: ${(props) => (props.flg ? 'calc(100% - 60px)' : '0')};
	padding: ${(props) => (props.flg ? '30px' : '0')};
	background: rgba(0, 0, 0, 0.85);
	border-radius: 18px;
	box-shadow: ${(props) => (props.flg ? '0 0 4px 1px #55555e' : 'none')};
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 13;
	animation: ${(props) => (props.flg ? padeAppearUp : padeDisappearDown)} 0.5s ease-in-out 1;

	-ms-overflow-style: none; /* IE and Edge */
	scrollbar-width: none; /* Firefox */
	&::-webkit-scrollbar {
		display: none; /* Chrome, Safari, Opera*/
	}

	@media screen and (max-width: 600px) {
		width: 90%;
	}
`;

export const UserInfoBox = styled.div`
	position: relative;
	width: 100%;
	padding-right: 30px;

	& > .user {
		display: flex;
		align-items: center;

		& > img {
			height: 48px;
			width: 48px;
			margin-right: 12px;
			border-radius: 48px;
			object-fit: cover;
			border: 1px solid #444;
			background: #000;
		}
	}
`;

export const MoreButton = styled.div`
	position: absolute;
	right: 0;
	top: 12px;
	height: 18px;
	cursor: pointer;
`;

export const MoreList = styled.div`
	position: absolute;
	width: 60px;
	height: 60px;
	overflow: hidden;
	top: 30px;
	right: 0;
	animation: ${moreMenu} 0.3s ease-in-out 1;
	box-shadow: 0 0 4px 1px #777;
	background: #000;

	&.three {
		height: 90px;
	}

	& > div {
		cursor: pointer;
		padding: 6px;
		height: 30px;
		overflow: hidden;
		line-height: 20px;
		word-break: keep-all;
		&:hover {
			background: #444;
		}
	}
`;

export const DetailContentBox = styled.div`
	min-height: 240px;
	padding-bottom: 30px;

	& > .dayjs {
		font-weight: 400;
		font-size: 11px;
		color: #ddd;
		margin: 12px 0;
		padding-bottom: 12px;
		border-bottom: 1px solid #444;
	}
`;

export const CommentBox = styled.div`
	border-top: 1px solid #444;
	padding: 30px 0;
	height: fit-content;
`;

export const Comment = styled.div`
	display: flex;
	position: relative;
	min-height: 3rem;
	padding: 12px 0;
	padding-right: 18px;
	border-radius: 12px;

	& > img {
		width: 3rem;
		height: 3rem;
		border-radius: 100%;
		margin-right: 1rem;
		background: #000;
		object-fit: cover;
	}

	.content {
		width: calc(100% - 62px);

		p.nickname {
			margin-bottom: 6px;
		}

		.edit-box {
			color: #999;
			font-size: 9px;

			& > button {
				color: #aaa;
				font-size: 9px;
				background: inherit;
				cursor: pointer;
			}
			& > span {
				margin: 0 2px;
			}
		}

		& > div {
			display: flex;
			align-items: flex-end;
			width: 100%;

			&.editComment {
				height: 120px;
			}
			input[type='text'] {
				width: calc(100% - 60px);
				height: 100%;
				border-radius: 12px 0 0 12px;
				padding: 1em;
			}
			div.editButton {
				width: 60px;
				height: 100%;
				border-radius: 0 12px 12px 0;
				overflow: hidden;

				& > div {
					width: 100%;
					height: 50%;
					cursor: pointer;
					text-align: center;
					vertical-align: middle;
					line-height: 60px;

					&.submit {
						background: #5656bf;
					}
					&.cancel {
						background: #bf5656;
					}
				}
			}

			div.commentBubble {
				background: #f8f8f8;
				border-radius: 5px;
				color: #000;
				padding: 0.5rem;
				min-height: 100%;
				max-width: calc(100% - 100px);
				position: relative;

				&::before {
					content: '';
					transform: skewX(30deg);
					width: 15px;
					left: 0;
					height: 15px;
					background: #f8f8f8;
					position: absolute;
					top: 1px;
					z-index: -1;
				}
			}

			& > p {
				color: #777;
				height: fit-content;
				font-size: 10px;
				margin-left: 0.3rem;
				width: 8rem;
			}
		}
	}
`;

export const WriteComment = styled.form`
	display: flex;
	position: relative;
	align-items: center;

	& > img {
		width: 48px;
		height: 48px;
		border-radius: 48px;
		border: 1px solid #444;
		object-fit: cover;
		background: #000;
	}

	input {
		width: calc(100% - 102px);
		height: 36px;
		border-radius: 12px;
		background: #eee;
		line-height: 1.4em;
		padding: 6px 1em;
		margin: 0 6px 0 12px;
	}

	& > .btn {
		height: 36px;
		width: 36px;
		border-radius: 12px;
		padding: 3px;
		overflow: hidden;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;

		&:hover {
			background: rgba(255, 255, 255, 0.1);
		}

		img {
			width: 18px;
			height: 18px;
			background: transparent;
			color: #fff;
		}
	}
`;

export const NoImageProfile = styled.div`
	width: 3rem;
	height: 3rem;
	border-radius: 100%;
	margin-right: 12px;
	background: linear-gradient(#002534, #090a0f) no-repeat;
	display: flex;

	img {
		width: 1.5rem;
		margin: auto;
	}
`;
