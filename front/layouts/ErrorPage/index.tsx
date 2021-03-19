import React from 'react';
import { ErrorBox } from './style';

const ErrorPage = () => {
	return (
		<ErrorBox>
			<h1>404</h1>
			<p>페이지를 찾을 수 없습니다.</p>
			<a href="/main">
				<div>메인페이지로 이동하기</div>
			</a>
		</ErrorBox>
	);
};

export default ErrorPage;
