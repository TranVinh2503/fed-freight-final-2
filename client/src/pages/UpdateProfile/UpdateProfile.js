import classNames from 'classnames/bind';
import styles from './UpdateProfile.module.scss';
import Button from '~/components/Button';
import images from '~/assets/images/images';
import { useContext } from 'react';
import { AppContext } from '~/Context/AppContext';
import { useState } from 'react';
import axios from 'axios';

const cx = classNames.bind(styles);

function UpdateProfile() {
    const { user } = useContext(AppContext);
    const [userName, setUserName] = useState(user?.user);
    const [gmail, setGmail] = useState(user?.gmail);

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        console.log(file);

        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const fileName = `${user?.id}_${selectedFile.name}`;

        const formData = new FormData();
        formData.append('avatar', selectedFile, fileName);
        formData.append('userName', user?.user);
        formData.append('userId', user?.id);
        formData.append('role', user?.role);
        try {
            const response = await axios.post('http://localhost:8000/avatarUpload', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access-token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            const blobResponse = await fetch(response.data.url);
            const blob = await blobResponse.blob();
            setPreviewUrl(URL.createObjectURL(blob));
        } catch (error) {
            console.error(error);
        }
    };

    const isContributor = () => {
        if (user?.role === 'contributor') {
            return true;
        } else {
            return false;
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('grid')}>
                <div className={cx('content')}>
                    <div className={cx('column1')}>
                        <div className={cx('name')}>Vivianna</div>
                        <div className={cx('nick-name')}>{userName}</div>
                        {isContributor ? (
                            <div className={cx('role')}>Người phân phối</div>
                        ) : (
                            <div className={cx('role')}>Khách hàng</div>
                        )}
                        <form onSubmit={handleSubmit}>
                            {previewUrl && <img className={cx('avatar')} src={previewUrl} alt="Avatar Preview" />}
                            <input type="file" id="avatar" onChange={handleFileSelect}/>
                            <label htmlFor='avatar'>Thay đổi ảnh</label>
                        </form>
                    </div>
                    <div className={cx('column2')}>
                        <div className={cx('heading')}>Thông tin cá nhân</div>
                        <form className={cx('input-form')}>
                            <div>
                                <label className={cx('title')}>Họ</label>
                                <input type="text" className={cx('input')}></input>
                            </div>
                            <div>
                                <label className={cx('title')}>Tên</label>
                                <input type="text" className={cx('input')}></input>
                            </div>
                            <div>
                                <label className={cx('title')}>Tên hiển thị</label>
                                <input type="text" className={cx('input')} defaultValue={userName}></input>
                            </div>
                            <div>
                                <label className={cx('title')}>Số điện thoại</label>
                                <input type="text" className={cx('input')}></input>
                            </div>
                            <div>
                                <label className={cx('title')}>Ngày sinh</label>
                                <input type="text" className={cx('input')}></input>
                            </div>
                            <div>
                                <label className={cx('title')}>Email</label>
                                <input type="text" className={cx('input')} defaultValue={gmail}></input>
                            </div>
                        </form>
                        <Button update>Cập nhật</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateProfile;
