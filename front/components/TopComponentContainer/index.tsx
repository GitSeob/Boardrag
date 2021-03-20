import React, { FC, ReactNode } from 'react';
import styled from '@emotion/styled';

interface ITCC {
	setValue: (data: boolean) => void;
	children: ReactNode;
}

const TopComponentContainer: FC<ITCC> = ({ children, setValue }: ITCC) => {
	return (
		<>
			<DarkBackground
				onClick={() => {
					setValue(false);
				}}
			/>
			{children}
		</>
	);
};

export default TopComponentContainer;

const DarkBackground = styled.div`
	position: fixed;
	width: 100vw;
	height: 100vh;
	z-index: 20;
	background: rgba(0, 0, 0, 0.3);
	display: flex;
	align-items: center;
	justify-content: center;
`;
