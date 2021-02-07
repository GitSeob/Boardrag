import React, {FC, useState, useCallback, useEffect} from 'react';
import axios from 'axios';

import useInput from '@hooks/useInput';
import LoadingBall from '@components/LoadingBall';
import {
	FormBox,
	BackgroundImageBox,
	ProfileImageBox,
	PageButtonBox
} from './style';

interface ICBF {
	BLRevalidate: () => void,
	username: string
}

const CreateBoardForm:FC<ICBF> = ({ BLRevalidate, username }) => {
	const [title, OCTitle] = useInput('');
	const [des, OCDes] = useInput('');
	const [defaultBlocks, OCDB] = useInput(30);
	const [ETime, OCETime] = useInput(14);
	const [pw, OCPW] = useInput('');
	const [repw, OCREPW] = useInput('');
	const [is_lock, set_lock] = useState(false);
	// const [tags, setTags] = useState([]);
	const [pageState, setPS] = useState(0);
	const [aniCN, setAniCN] = useState('next');
	const [warn, setWarn] = useState('');
	const [nickName, OCNN] = useInput(username);
	const [backgroundImage, setBI] = useState({
		url: '',
		loading: false,
		now: Date.now()
	});
	const [profileImage, setPI] = useState({
		url: '',
		loading: false,
		now: Date.now()
	});
	const [createState, setCS] = useState({
		loading: false,
		success: false,
		error: ''
	});
	const imageInput = React.useRef() as React.MutableRefObject<HTMLInputElement>;
	const backgroundInput = React.useRef() as React.MutableRefObject<HTMLInputElement>;

	const onClickImageUpload = useCallback(() => {
		imageInput.current.click();
	}, [imageInput.current]);

	const onClickBImageUpload = useCallback(() => {
		backgroundInput.current.click();
	}, [backgroundInput.current]);

	const onChangeProfileImg = useCallback( async (e) => {
		const imageFormData = new FormData();
		imageFormData.append('image', e.target.files[0]);
		await setPI({
			...profileImage,
			loading: true,
			now: Date.now()
		});
		await axios.post(`/api/uploadImage?type=profile&name=${title}`, imageFormData).then(res => {
			setPI({
				url: res.data.url,
				loading: false,
				now: Date.now()
			});
		}).catch(e => {
			setPI({
				...profileImage,
				loading: false,
			});
		})
	}, [title]);

	const onChangeBackgroundImg = useCallback( async (e) => {
		const imageFormData = new FormData();
		imageFormData.append('image', e.target.files[0]);
		imageFormData.append('boardname', title);
		await setBI({
			...backgroundImage,
			loading: true
		});
		await axios.post(`/api/uploadImage?type=background&name=${title}`, imageFormData).then(res => {
			setBI({
				url: res.data.url,
				loading: false,
				now: Date.now()
			});
		}).catch(e => {
			setBI({
				...backgroundImage,
				loading: false,
			});
		})
	}, [title]);

	const NextPage = () => {
		if (pageState === 0 && (title.trim() === '' || des.trim() === ''))
			return setWarn('작성되지 않은 항목이 있습니다.');
		else if (pageState === 0 && title.length < 4 )
			return setWarn('Board 이름은 최소 4자 이상으로 설정해야합니다.');
		else if (pageState === 0) {
			return axios.get(`/api/checkBoardName/${title}`).then(res => {
				if (res)
				{
					setWarn('');
					setAniCN('next');
					setPS(pageState + 1);
				}
				else
					setWarn('이미 존재하는 Board name입니다.');
			}).catch(e => { setWarn( e.response.data )});
		}
		else if (pageState === 2) {
			if (is_lock && pw.length < 8) {
				return setWarn('비밀번호는 최소 8자 이상으로 설정해야합니다.');
			} else if (pw !== repw) {
				return setWarn('비밀번호를 확인해주세요.');
			}
		}
		else if (pageState === 4 && ( !nickName || nickName.length < 2 )) {
			setWarn('닉네임은 2자이상으로 설정해야합니다.');
		}
		setWarn('');
		setAniCN('next');
		if (pageState === 4)
		{
			if (nickName.length < 2 || title.length < 4)
				return setWarn('필수 항목을 올바르게 작성했는지 확인해주세요.');
			setCS({
				...createState,
				loading: true,
			});
			axios.post(`/api/createBoard`, {
				title, des, defaultBlocks, is_lock, pw, ETime, nickName,
				profileImage: profileImage.url,
				background: backgroundImage.url
			}).then(() => {
				setCS({
					...createState,
					loading: false,
					success: true,
				})
				BLRevalidate();
			}).catch(e => {
				setCS({
					...createState,
					loading: false,
					error: e.response.data
				})
			})
		}
		setPS(pageState + 1);
	};

	return (
		<>
			<FormBox>
				<h2>New Board</h2>
				<div className={`${pageState === 0 ? aniCN : ""}`}>
					<p>Board Name</p>
					<input
						type="text"
						value={title}
						onChange={OCTitle}
						placeholder="Board 이름을 정해주세요."
					/>
					<p>Board Description</p>
					<input
						type="text"
						value={des}
						onChange={OCDes}
						placeholder="Board 설명을 작성해주세요."
					/>
				</div>
				<div className={`${pageState === 1 ? aniCN : ""}`}>
					<p>Availble Blocks</p>
					<p className="info">각 사용자별 할당할 블럭 수를 설정해주세요. (기본 30칸)</p>
					<p className="info">Board는 '32 x 20' 크기로 최대 640칸입니다.</p>
					<input
						type="number"
						value={defaultBlocks}
						onChange={OCDB}
						placeholder="각 사용자별 할당할 블럭 수를 설정해주세요. (기본 30칸)"
						min="0"
						max="640"
					/>
					<p>Expiry Days</p>
					<p className="info">블럭 등록 일 수를 설정해주세요.(최대 60일)</p>
					<p className="info">0으로 설정하면 블럭이 삭제되지 않도록 설정됩니다.</p>
					<input
						type="number"
						value={ETime}
						onChange={OCETime}
						min="0"
						max="60"
					/>
				</div>
				<div className={`${pageState === 2 ? aniCN : ""}`}>
					<p>Board Private</p>
					<div style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center', padding: '.5rem .5rem .5rem 0'}}>
						<input
							type="checkbox"
							checked={is_lock}
							onChange={() => { set_lock(!is_lock) }}
						/>
						<p>비밀번호를 설정하시겠습니까?</p>
					</div>
					<p>Board Password</p>
					<input
						type="password"
						value={pw}
						onChange={OCPW}
						disabled={!is_lock}
						placeholder="Board 비밀번호를 설정해주세요."
					/>
					<input
						type="password"
						value={repw}
						onChange={OCREPW}
						disabled={!is_lock}
						placeholder="설정한 Board 비밀번호를 다시 입력해주세요."
					/>
				</div>
				<div className={`${pageState === 3 ? aniCN : ""}`}>
					<p>Set Board's background image</p>
					<p className="info">Board는 32x20 size입니다.</p>
					<p className="info">이미지를 선택하지 않으면 기본 배경으로 설정됩니다.</p>
					<BackgroundImageBox>
						{backgroundImage.loading ? (
							"loading..."
						) : (
							<div
								style={backgroundImage.url !== '' ? {
									backgroundImage: `url(${backgroundImage.url}?${backgroundImage.now})`,
								} : {
									background: `radial-gradient(ellipse at bottom, #002534 0%, #090a0f 100%) no-repeat`
								}}
							>
								<button onClick={onClickBImageUpload}>
									<img src="/public/camera.svg" style={{ color: 'white' }} />
								</button>
								<input
									type="file"
									accept=".jpg, .png"
									ref={backgroundInput}
									onChange={onChangeBackgroundImg}
								/>
							</div>
						)}
					</BackgroundImageBox>
				</div>
				<div className={`${pageState === 4 ? aniCN : ""}`}>
					<p>Your profile image in Board</p>
					<ProfileImageBox>
						{profileImage.loading ? (
							"loading..."
						) : (
							<div
								style={profileImage.url !== '' ? {
									backgroundImage: `url(${profileImage.url}?${profileImage.now})`,
								} : {
									background: `linear-gradient(#002534 , #090a0f) no-repeat`
								}}
							>
								{profileImage.url === '' && <img src="/public/person.svg" />}
								<button onClick={onClickImageUpload}>
									<img src="/public/camera.svg" style={{ color: 'white' }} />
								</button>
								<input
									type="file"
									accept=".jpg, .png"
									ref={imageInput}
									onChange={onChangeProfileImg}
								/>
							</div>
						)}
					</ProfileImageBox>
					<p>Your nickname in Board</p>
					<input
						type="text"
						value={nickName}
						onChange={OCNN}
						placeholder="Board에서 사용할 닉네임을 입력해주세요."
					/>
				</div>
				<div className={`${pageState === 5 ? 'created' : ""}`}>
					{ createState.loading && <LoadingBall /> }
					{ createState.success && '생성완료!' }
				</div>
				{warn !== '' && <p className="warn">{warn}</p> }
				<PageButtonBox>
					{ pageState < 5 &&
						<div className="next" onClick={NextPage}>
							{pageState < 4 ? 'Next' : 'Create'}
							<img src="/public/arrow.svg" />
						</div>
					}
					{ 5 > pageState && pageState > 0 &&
						<div onClick={() => {setAniCN('before'); setPS(pageState - 1);}}>
							<img src="/public/arrow.svg" style={{transform: "rotate(180deg)"}}/>
							Prev
						</div>
					}
				</PageButtonBox>
			</FormBox>
		</>
	)
}

export default CreateBoardForm;
