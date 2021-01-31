import React, { FC } from 'react';
import axios from 'axios';
import {
	IUser, IBL
} from '@typings/datas';
import {
	InitNameBox
} from './style';
import useInput from '@hooks/useInput';
import LoadingBall from '@components/LoadingBall';

interface IIN {
	userData: IUser,
	flgNickname(flg: boolean): void
}

const InitName:FC<IIN> = ({ userData, flgNickname }) => {
	const [nickname, OCNN] = useInput('');
	const [status, setStatus] = React.useState({
		nickname: "",
		loading: false,
		error: "",
	});

	const submitNickName = React.useCallback(async() => {
		if (nickname.length > 30 || nickname.length < 3)
		{
			setStatus({...status, error: "닉네임 글자 수를 확인해주세요"})
			return ;
		}
		await setStatus({...status, loading: true});
		await axios.post(`/api/nickname`, {
			nickname
		}).then(res => {
			if (res.status === 401)
			{
				setStatus({
					...status,
					loading: false,
					error: res.data
				});
			}
			else {
				setStatus({
					...status,
					loading: false,
					nickname: res.data
				});
				setTimeout(() => {flgNickname(true);}, 1000);
			}
		}).catch((e) => {
			setStatus({
				...status,
				loading: false,
				error: e.response.data
			});
		});
	}, [nickname]);

	if (status.loading)
	{
		return (
			<div style={{
				zIndex: 21,
				position: "fixed",
				top: "50%",
				left: "50%",
				transform: "translate(-50%, -50%)"
			}}>
				<LoadingBall />
			</div>
		);
	}

	return (
		<InitNameBox>
			{ status.nickname ?
				<p>{status.nickname}님 환영합니다.</p>
			:
				<>
					<p className="sub">처음 로그인하셨군요?</p>
					<p>닉네임을 설정해주세요</p>
					<p className="sub">( 최소 3자, 최대 30자 )</p>
					{ status.error !== "" && <p className="error">{status.error}</p> }
					<input
						type="text"
						value={nickname}
						onChange={OCNN}
						onKeyPress={(e) => {
							if (e.key === "Enter")
							{
								submitNickName();
							}
						}}
						placeholder="nickname"
					/>
					<div
						className="btn"
						onClick={submitNickName}
					>
						설정하기
					</div>
				</>
			}
		</InitNameBox>
	);
}

export default InitName;
