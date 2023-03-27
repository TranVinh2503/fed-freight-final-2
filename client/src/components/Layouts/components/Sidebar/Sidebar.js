import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import icons from '~/assets/icons';

const cx = classNames.bind(styles);

function Sidebar() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('grid')}>
                <div className={cx('container')}>
                    <div className={cx('content')}>
                        <div className={cx('title')}>Luôn tin tưởng đồng hành cùng FredFreight</div>
                        <div className={cx('mission')}>Cất cánh tung bay, hàng hóa đến tay</div>
                        <div className={cx('rate')}>
                            <div className={cx('stars')}>
                                <img src={icons.star} alt="" className={cx('icon')}></img>
                                <img src={icons.star} alt="" className={cx('icon')}></img>
                                <img src={icons.star} alt="" className={cx('icon')}></img>
                                <img src={icons.star} alt="" className={cx('icon')}></img>
                                <img src={icons.star} alt="" className={cx('icon')}></img>
                            </div>
                            <div className={cx('vote')}>2,100+ Bài đánh giá</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
