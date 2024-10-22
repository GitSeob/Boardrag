import React, { FC, useState } from 'react';
import axios from 'axios';
import useInput from '@hooks/useInput';
import TopComponentContainer from '@components/main/TopComponentContainer';
import LoadingBall from '@components/loading/LoadingBall';
import { CPBox } from './style';

interface ICPW {
	value: { name: string; flg: boolean; is_lock: boolean };
	setValue(argv: object): void;
	toast: any;
	BLRevalidate: () => void;
}

const ChangePW: FC<ICPW> = ({ value, setValue, toast, BLRevalidate }: ICPW) => {
	const [pwCheck, setCheck] = useState(!value.is_lock);
	const [pw, OCPW, setPW] = useInput('');
	const [status, setStatus] = useState({
		loading: false,
		error: '',
		done: '',
	});
	const [checkPW, OCCPW] = useInput('');

	const currentPWCheck = async (pw: string) => {
		await setStatus({ ...status, loading: true });
		await axios
			.post(`/api/passwordCheck/${value.name}`, {
				password: pw,
			})
			.then(() => {
				setPW('');
				setCheck(true);
			})
			.catch((e) => {
				setStatus({ ...status, error: e.response.data });
			});
		setStatus({ ...status, loading: false });
	};

	const newPWSet = async (pw: string, checkPW: string, flg: boolean) => {
		if (pw.length < 8 && flg) {
			setStatus({ ...status, error: '비밀번호는 최소 8자로 설정하셔야합니다.' });
			return;
		}
		if (pw !== checkPW) {
			setStatus({ ...status, error: '비밀번호가 일치하지 않습니다.' });
			return;
		}
		await setStatus({ ...status, error: '', loading: true });
		await axios
			.post(`/api/changePassword/${value.name}`, {
				password: pw,
				changeFlg: flg,
			})
			.then((res) => {
				setStatus({
					...status,
					loading: false,
					done: res.data,
				});
			})
			.catch((e) => {
				setStatus({
					...status,
					error: e.response.data,
					loading: false,
				});
			});
	};

	if (status.done !== '') {
		toast.info(status.done);
		setValue({ name: '', flg: false });
		BLRevalidate();
	}

	return (
		<TopComponentContainer
			setValue={(flg) => {
				setValue({
					...value,
					flg: flg,
				});
			}}
		>
			<CPBox>
				<h4>`{value.name}`</h4>
				{status.loading ? (
					<LoadingBall />
				) : !pwCheck ? (
					<div>
						<p>현재 비밀번호를 입력해주세요</p>
						<input type="password" value={pw} onChange={OCPW} placeholder="현재 비밀번호를 입력해주세요" />
						<div
							className="btn"
							onClick={() => {
								currentPWCheck(pw);
							}}
							onKeyPress={(e) => {
								if (e.key === 'Enter') {
									currentPWCheck(pw);
								}
							}}
						>
							확인하기
						</div>
					</div>
				) : (
					<div>
						<p>새롭게 설정할 비밀번호를 입력해주세요.</p>
						<input type="password" value={pw} onChange={OCPW} />
						<p>새 비밀번호를 다시 입력해주세요.</p>
						<input type="password" value={checkPW} onChange={OCCPW} />
						<div
							className="btn"
							onClick={() => {
								newPWSet(pw, checkPW, true);
							}}
						>
							{value.is_lock ? '변경하기' : '비밀번호 설정하기'}
						</div>
						{value.is_lock && (
							<div
								className="btn"
								onClick={() => {
									newPWSet('', '', false);
								}}
							>
								공개 상태로 변경하기
							</div>
						)}
					</div>
				)}
				{status.error && <p className="warn">{status.error}</p>}
			</CPBox>
		</TopComponentContainer>
	);
};

export default ChangePW;
