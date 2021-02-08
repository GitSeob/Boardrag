import styled from '@emotion/styled';

export const Container = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	padding-bottom: 12px;
	border-bottom: 2px solid rgba(255, 255, 255, 0.1);

	& > div {
		padding: 12px;
	}
`;

export const NickNameIpt = styled.input`
	max-width: 320px;
	min-width: 240px;
	margin: 12px auto;
	border-radius: 12px;
	padding: 12px;
	text-align: center;
`;

export const SubmitBtn = styled.div`
	max-width: 320px;
	min-width: 240px;
	margin: 0 auto;
	border-radius: 12px;
	padding: 6px !important;
	line-height: 24px;
	text-align: center;
	cursor: pointer;
	background: #444;

	&:hover {
		background: #555;
	}

	&.exit {
		margin-top: 12px;

		&:hover {
			background: #bf5656;
		}
	}
`;
