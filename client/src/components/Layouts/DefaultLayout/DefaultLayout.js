import classNames from 'classnames/bind';
import Header from '../components/Header/Header';
import styles from './DefaultLayout.module.scss';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('wrapper-layout')}>
                <Header />
                <div className={cx('grid')}>
                    <div className={cx('container')}>
                        <div className={cx('content')}>{children}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DefaultLayout;
