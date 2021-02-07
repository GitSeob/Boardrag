import React, { useCallback, FC, useState, useEffect } from 'react';
import axios from 'axios';
import {
	Container,
	NickNameIpt,
	SubmitBtn
} from './style';
import {
	ProfileImageBox
} from '@components/CreateBoardForm/style';
import { IBM, IBL, IUser } from '@typings/datas';
import useInput from '@hooks/useInput';

interface IEMI {
	myData: IBM | undefined,
	boardData: IBL,
	toast: any,
	setOpen(flg: boolean): void,
	setLoading(flg: boolean): void,
}

const EditMyInfo:FC<IEMI> = ({ myData, boardData, toast, setOpen, setLoading }) => {
	const [nickname, OCNN, setNN] =  useInput(myData?.username);
	const [uploading, setUploading] = useState({
		url: myData?.profile_img ? myData.profile_img : "",
		loading: false,
		now: Date.now()
	});
	const [isUpdated, setUpdated] = useState(false);

	const imageInput = React.useRef() as React.MutableRefObject<HTMLInputElement>;

	const onClickImageUpload = useCallback(() => {
		imageInput.current.click();
	}, [imageInput.current]);

	const onChangeProfileImg = useCallback( async (e) => {
		const imageFormData = new FormData();
		imageFormData.append('image', e.target.files[0]);
		await setUploading({
			...uploading,
			loading: true
		});
		await axios.post(`/api/uploadImage?type=profile&name=${boardData.name}`, imageFormData).then(res => {
			setUploading({
				url: res.data.url,
				loading: false,
				now: Date.now()
			});
		});
	}, []);

	const onSubmitEdit = useCallback(async () => {
		console.log(nickname);
		if (!nickname || nickname.length < 2)
		{
			setNN(myData?.username);
			return alert('닉네임은 2자 이상으로 입력해주세요.');
		}
		if (confirm('수정하시겠습니까?')) {
			await setLoading(true);
			await axios.post(`/api/BoardMember/edit/${boardData.name}`, {
				username: nickname, profile_img: uploading.url
			}).then(res => {
				setUploading({
					...uploading,
					url: res.data
				})
				setOpen(false);
				toast.dark("정보가 수정되었습니다.");
				setLoading(false);
			}).catch(e => {
				toast.error("에러가 발생했습니다.");
				setLoading(false);
			});
		}
	}, [uploading, nickname]);

	const quitBoard = useCallback(async () => {
		if (boardData.AdminId === myData?.UserId)
		{
			alert("현재 관리자는 탈퇴할 수 없습니다");
			return ;
		}
		else {
			if (confirm(`정말 ${boardData.name} 보드에서 나가겠습니까?`)) {
				setLoading(true);
				axios.delete(`/api/quitBoard/${boardData.name}`).then(res => {
					toast.dark(`${boardData.name} 보드에서 나갔습니다.`);
					setLoading(false);
				}).catch(e => {
					toast.error(e.response.data);
					setLoading(false);
				});
			}
		}
	}, []);

	useEffect(() => {
		if (nickname !== myData?.username || uploading.url !== myData?.profile_img)
			setUpdated(true);
		else
			setUpdated(false);
	}, [nickname, uploading.url])

	return (
		<Container>
			<ProfileImageBox>
				{uploading.loading ? (
					"loading..."
				) : (
					<div
						style={uploading.url !== '' ? {
							backgroundImage: `url(${uploading.url}?${uploading.now})`,
						} : {
							background: `linear-gradient(#002534 , #090a0f) no-repeat`
						}}
					>
						{uploading.url === '' && <img src="/public/person.svg" />}
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
			<NickNameIpt
				type="text"
				value={nickname}
				onChange={OCNN}
			/>
			<SubmitBtn
				onClick={isUpdated ? onSubmitEdit : undefined}
				style = {{
					cursor: `${isUpdated ? "pointer" : "not-allowed"}`
				}}
			>수정하기</SubmitBtn>
			<SubmitBtn
				className="exit"
				onClick={quitBoard}
			>나가기</SubmitBtn>
		</Container>
	);
};

export default EditMyInfo;
