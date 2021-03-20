import React from 'react';
import { Footer } from './style';

interface IPageFooter {
	className: string;
}

const PageFooter = ({ className }: IPageFooter) => {
	return (
		<Footer className={className}>
			<img src="/public/github.png" />
			<a href="https://github.com/gitseob" target="_blank" rel="noreferrer">
				gitseob
			</a>
		</Footer>
	);
};

export default PageFooter;
