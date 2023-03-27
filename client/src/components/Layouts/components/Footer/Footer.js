import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import icons from '~/assets/icons';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function Footer() {
    return (
        <footer className={cx('wrapper')}>
            <div className={cx('grid')}>
                <div className={cx('footer-container')}>
                    <div className={cx('footer-column')}>
                        <div className={cx('logo-des')}>
                            <img src={icons.logo} alt="" className={cx('logo')}></img>
                            <div className={cx('des')}>FedFreight</div>
                        </div>
                        <div className={cx('contact-des')}>
                            <img src={icons.contact} alt="" className={cx('logo')}></img>
                            <div className={cx('detail')}>
                                <div className={cx('contact-heading')}>Liên Lạc</div>
                                <div className={cx('phone')}>(+84)031102342</div>
                            </div>
                        </div>
                        <div className={cx('slogan')}>Cất cánh tung bay, hàng hóa đến tay</div>
                    </div>
                    <div className={cx('footer-column')}>
                        <div className={cx('footer-heading')}>
                            Để cập nhật những thông tin mới nhất, hãy đăng ký nhận bản tin!
                        </div>
                        <div className={cx('footer-text')}>
                            Tìm kiếm những cơ hội mới mẻ và đầy hứa hẹn với các bài báo hàng tuần của chúng tôi.
                        </div>
                        <form className={cx('footer-form')}>
                            <input type="email" placeholder="Email*" required></input>
                            <Button mail>Đăng Ký</Button>
                        </form>
                        <div className={cx('footer-social-media')}>
                            <a href="https://vi-vn.facebook.com/">
                                <img src={icons.facebook} alt="" className={cx('social-media-icon')}></img>
                            </a>
                            <a href="https://twitter.com/?lang=vi">
                                <img src={icons.twitter} alt="" className={cx('social-media-icon')}></img>
                            </a>
                            <a href="https://www.linkedin.com/">
                                <img src={icons.linkedin} alt="" className={cx('social-media-icon')}></img>
                            </a>
                            <a href="https://www.youtube.com/?gl=VN">
                                <img src={icons.youtube} alt="" className={cx('social-media-icon')}></img>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
