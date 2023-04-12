import classNames from 'classnames/bind';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import styles from './HavingSidebar.module.scss';

const cx = classNames.bind(styles);

function HavingSidebar({ children }) {
    const { pathname } = useLocation();

    useEffect(() => {
        if (pathname !== '/') {
            window.scrollTo({
                top: 700,
                behavior: 'smooth',
            });
        }
    }, [pathname]);

    return (
        <div className={cx('wrapper')}>
            <Header />
            <Sidebar />
            <div className={cx('grid')}>
                <div className={cx('container')}>
                    <div className={cx('content')}>{children}</div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default HavingSidebar;
