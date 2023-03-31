import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import icons from '~/assets/icons';
import Button from '~/components/Button';
import React, { useState, useContext } from 'react';
import Tippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '~/Context/AppContext';

const cx = classNames.bind(styles);

function Header() {
    const navigate = useNavigate(); // <--- initialize useHistory
    // change color when scrolling
    const [color, setColor] = useState(false);
    // const [userName, setUserName] = useState('');
    const changeColor = () => {
        if (window.scrollY > 0) {
            setColor(true);
        } else {
            setColor(false);
        }
    };
    window.addEventListener('scroll', changeColor);

    const pathName = window.location.pathname;

    const  {user}  = useContext(AppContext);
    const userName =  user?.user;

    return (
        <header className={color ? cx('wrapper-bgc') : cx('wrapper-trans')}>
            <div className={cx('grid')}>
                <div className={cx('inner')}>
                    <div className={cx('logo')}>
                        <img src={icons.logo} alt="FedFreight Logo" className={cx('logo-icon')}></img>
                        <div className={cx('logo-description')}>FedFreight</div>
                    </div>

                    <div className={cx('actions')}>
                        <ul className={cx('actions-list')}>
                            <li>
                                <Button text to="/">
                                    Trang Chủ
                                </Button>
                            </li>
                            <li>
                                <Button text to="/" onClick={() => window.location.reload(true)}>
                                    Thông Tin
                                </Button>
                            </li>
                            <li>
                                <Button text to="/contributorList">
                                    Dịch Vụ
                                </Button>
                            </li>
                            <li>
                                <Button
                                    text
                                    to="/chat"
                                    onClick={() => {
                                        navigate('/chat');
                                        window.location.reload(true);
                                    }}
                                >
                                    Liên Lạc
                                </Button>
                            </li>
                            {userName ? (
                                <>
                                    <li>
                                        <Tippy content="Notifications">
                                            <img
                                                src={color ? icons.bell : icons.whiteBell}
                                                alt="Notification"
                                                className={cx('icon')}
                                            ></img>
                                        </Tippy>
                                    </li>
                                    <li>
                                        <Tippy
                                            placement="bottom"
                                            interactive
                                            render={(attrs) => (
                                                <PopperWrapper>
                                                    <h4 className={cx('option')}>Tùy chọn</h4>
                                                    <Button option to="/">
                                                        Xem Hồ sơ
                                                    </Button>
                                                    <Button option to="/">
                                                        Xem Lịch sử
                                                    </Button>
                                                    <Button option to="/">
                                                        Xem Lịch sử
                                                    </Button>

                                                    <Button
                                                        option
                                                        to="/"
                                                        onClick={() => {
                                                            localStorage.removeItem('access-token');
                                                            window.location.reload(true);
                                                        }}
                                                    >
                                                        Đăng Xuất
                                                    </Button>
                                                </PopperWrapper>
                                            )}
                                        >
                                            <img
                                                src={color ? icons.dropdown : icons.whiteDropdown}
                                                alt="Options"
                                                className={cx('icon')}
                                            ></img>
                                        </Tippy>
                                    </li>
                                    <li>
                                        <Button text to="/">
                                            {userName}
                                        </Button>
                                    </li>
                                </>
                            ) : (
                                <li>
                                    {pathName === '/login' ? (
                                        <Button redirectPage to="/register">
                                            Đăng Ký
                                        </Button>
                                    ) : (
                                        <Button redirectPage to="/login">
                                            Đăng Nhập
                                        </Button>
                                    )}
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
