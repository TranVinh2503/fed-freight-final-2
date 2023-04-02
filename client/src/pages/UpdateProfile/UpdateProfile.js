import classNames from 'classnames/bind';
import styles from './UpdateProfile.module.scss';
import Button from '~/components/Button';
import images from '~/assets/images/images';
import { useContext } from 'react';
import { AppContext } from '~/Context/AppContext';
import { useState } from 'react';

const cx = classNames.bind(styles);

function UpdateProfile() {
    const { user } = useContext(AppContext);
    const [userName, setUserName] = useState(user?.user);
    const [gmail, setGmail] = useState(user?.gmail);

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];

        setSelectedFile(file);

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const reqData = {
            selectedFile:selectedFile,
            userId: user?.id,
            role: user?.role,
        };
        console.log(reqData);

        fetch('http://localhost:8000/avatarUpload', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(reqData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setPreviewUrl(data.avatarUrl);
            })
            .catch((error) => console.error(error));
    };

    const isContributor = ()=>{
        if(user?.role === 'contributor'){
            return true
        }else{
            return false
        }
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('grid')}>
                <div className={cx('content')}>
                    <div className={cx('column1')}>
                        <div className={cx('name')}>Vivianna</div>
                        <div className={cx('nick-name')}>{userName}</div>
                        {isContributor ? (<div className={cx('role')}>Người phân phối</div>):(<div className={cx('role')}>Người phân phối</div>)}
                        
                        {/* <img className={cx('avatar')} src={images.mono}></img> */}
                        <form onSubmit={handleSubmit}>
                            {previewUrl && <img className={cx('avatar')} src={previewUrl} alt="Avatar Preview" />}
                            <label>
                                <input type="file" onChange={handleFileSelect} />
                            </label>
                            <Button search type="submit">
                                Đổi ảnh
                            </Button>
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
                        <Button search>Cập nhật</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateProfile;
