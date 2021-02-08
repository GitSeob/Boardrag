import styled from '@emotion/styled';

export const AbsoluteCenter = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;

export const FixedCenter = styled(AbsoluteCenter)`
	position: fixed;
`;

export const FixAltContainer = styled(FixedCenter)`
	padding: 24px;
	border-radius: 24px;
	background: rgba(0, 0, 0, 0.7);
	box-shadow: 0 0 6px 1px rgba(255, 255, 255, 0.7);
`;
