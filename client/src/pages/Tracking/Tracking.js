import classNames from 'classnames/bind';
import styles from './Tracking.module.scss';
import icons from '~/assets/icons/icons';
import Tippy from '@tippyjs/react/headless';
import UserBox from '~/components/UserBox';
import Button from '~/components/Button';
import 'tippy.js/dist/tippy.css';
import { Wrapper as PopperWrapper } from '~/components/Popper';
const cx = classNames.bind(styles);

function Tracking() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('grid')}>
                <div className={cx('content')}>
                    <div className={cx('content-heading')}>Theo dõi đơn hàng</div>
                    <Tippy
                        placement="bottom"
                        interactive
                        render={(attrs) => (
                            <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                                <PopperWrapper>
                                    <h4 className={cx('search-title')}>Đơn hàng</h4>
                                    <UserBox search avatarId="mono" name="Moi Moi Moi" content="moimoimoimoi"></UserBox>
                                </PopperWrapper>
                            </div>
                        )}
                    >
                        <div className={cx('search-container')}>
                            <img src={icons.blackSearch} alt="" className={cx('logo')}></img>
                            <input type="text" className={cx('input')} placeholder="Tìm kiếm Đơn hàng"></input>
                            <Button search>Tìm Kiếm</Button>
                        </div>
                    </Tippy>
                    <div className={cx('order-result')}>
                        <h3 className={cx('content-sub-heading')}>Kết quả tra cứu</h3>
                        <table>
                            <tr>
                                <th className={cx('column2')}>Mã bill</th>
                                <th className={cx('column2')}>Người gửi</th>
                                <th className={cx('column2')}>Người nhận</th>
                                <th className={cx('column3')}>Thông tin sản phẩm</th>
                                <th className={cx('column1')}>Số lượng</th>
                            </tr>
                            <tr>
                                <td>572269893861</td>
                                <td>Lê Quang Trung</td>
                                <td>Lê Trung Đức</td>
                                <td>
                                    <ul>
                                        <li>32 tuýp kem đánh răng Sensodie 32 tuýp kem đánh răng Sensodie</li>
                                        <li>20kg bột mì chính</li>
                                    </ul>
                                </td>
                                <td>01</td>
                            </tr>
                        </table>
                    </div>
                    <div className={cx('order-detail')}>
                        <h3 className={cx('content-sub-heading')}>Kiểm tra trạng thái đơn hàng</h3>
                        <table>
                            <tr>
                                <th className={cx('column2')}>Trạng thái</th>
                                <th className={cx('column2')}>Thời gian</th>
                                <th className={cx('column3')}>Chi tiết</th>
                                <th className={cx('column3')}>Chi nhánh phụ trách</th>
                            </tr>
                            <tr>
                                <td>Sản phẩm đang vận chuyển</td>
                                <td>2023-03-18 19:45:01</td>
                                <td>Chúng tôi đã nhận được sản phẩm từ khách hàng đã gửi nó</td>
                                <td>Trung tâm thực vật Incheon</td>
                            </tr>
                            <tr>
                                <td>Tiếp quản sản phẩm</td>
                                <td>2023-03-18 19:45:01</td>
                                <td>Chúng tôi đã nhận được sản phẩm từ khách hàng đã gửi nó</td>
                                <td>Trung tâm thực vật Incheon</td>
                            </tr>
                            <tr>
                                <td>Sản phẩm đang vận chuyển</td>
                                <td>2023-03-19 22:55:55</td>
                                <td>Sản phẩm đang được vận chuyển đến khu vực giao hàng</td>
                                <td>Trung tâm thực vật Incheon</td>
                            </tr>
                            <tr>
                                <td>Đến nhận sản phẩm</td>
                                <td>2023-03-20 08:47:41</td>
                                <td>Hàng hóa đang chuyển đến kho cảng hậu cần</td>
                                <td>Quản lý trực tiếp trung tâm Incheon (Nam Gyeong-seop)</td>
                            </tr>
                            <tr>
                                <td>Bắt đầu giao hàng</td>
                                <td>2023-03-20 09:28:22</td>
                                <td>Sản phẩm của bạn đã đến đích</td>
                                <td>Trung tâm thực vật Incheon</td>
                            </tr>
                            <tr>
                                <td>Giao hàng hoàn tất</td>
                                <td>2023-03-20 11:22:09</td>
                                <td>Hàng hóa đang chuyển đến kho cảng hậu cần</td>
                                <td>Trung tâm thực vật Incheon</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Tracking;
