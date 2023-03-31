import classNames from 'classnames/bind';
import styles from './Login.module.scss';
import icons from '~/assets/icons/icons';
import Button from '~/components/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const Login = () => {
    const [user, setUser] = useState([
        {
            email: '',
            password: '',
        },
    ]);
    const [isLogin, setIsLogin] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // <--- initialize useHistory
    const regexEmail =
        /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+[^<>()\.,;:\s@\"]{2,})$/;

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().required('Email là bắt buộc').matches(regexEmail, 'Vui lòng nhập đúng email'),
            password: Yup.string()
                .required('Mật khẩu là bắt buộc')
                .min(8, 'Mật khẩu chứa ít nhất 8 ký tự')
                .matches(/^(?=.*[a-z]).{8,}$/, 'Mật khẩu chứa chữ thường')
                .matches(/^(?=.*[A-Z]).{8,}$/, 'Mật khẩu chứa chữ hoa')
                .matches(/^(?=.*[0-9]).{8,}$/, 'Mật khẩu chứa chữ số'),
        }),
        onSubmit: (values) => {
            const dataSubmit = {
                email: values.email,
                password: values.password,
            };
            setUser(dataSubmit);
        },
    });

    useEffect(() => {
        fetch('http://localhost:8000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        })
            .then((response) => response.json())
            .then(
                (data) => {
                    if (data.login) {
                        setMessage('successful');
                        setIsLogin(true);
                        localStorage.setItem('access-token', data.token);
                        navigate('/');
                        window.location.reload(true)
                    } else if(data.login === false) {
                        setMessage('fail');
                        setIsLogin(false);
                    }
                },
                (error) => {
                    console.log(error);
                },
            );
    }, [user, navigate]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <h2>Đăng Nhập</h2>
                {(() => {
                    if (message !== ' ' && isLogin === true) {
                        return (
                            <div className={cx('success')}>
                                <h3>Đăng nhập thành công</h3>
                            </div>
                        );
                    } else if (message !== ' ' && isLogin === false) {
                        return (
                            <div className={cx('error')}>
                                <h3>Đăng nhập thất bại, vui lòng kiểm tra lại thông tin đăng nhập</h3>
                            </div>
                        );
                    }
                    return null;
                })()}
                <form action="/" onSubmit={formik.handleSubmit} autoComplete="off">
                    <div className={cx('input-box')}>
                        <img src={icons.email} alt="" className={cx('icon')}></img>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            placeholder=" "
                        ></input>
                        <label htmlFor="email">Email</label>
                    </div>
                    {formik.errors.email && <p className={cx('error-message')}>{formik.errors.email}</p>}
                    <div className={cx('input-box')}>
                        <img src={icons.password} alt="" className={cx('icon')}></img>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            placeholder=" "
                        ></input>
                        <label htmlFor="password">Mật Khẩu</label>
                    </div>
                    {formik.errors.password && <p className={cx('error-message')}>{formik.errors.password}</p>}

                    <div className={cx('remember-forget')}>
                        <div className={cx('remember')}>
                            <input type="checkbox" id="remember" className={cx('checked-box')}></input>
                            <label htmlFor="remember">Ghi nhớ thông tin</label>
                        </div>

                        <a href="/register" className={cx('forget')}>
                            Quên mật khẩu?
                        </a>
                    </div>

                    <Button completeForm type="submit">
                        Đăng Nhập
                    </Button>

                    <p className={cx('redirect')}>
                        Bạn chưa có tài khoản?
                        <a href="/register">Đăng ký</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
