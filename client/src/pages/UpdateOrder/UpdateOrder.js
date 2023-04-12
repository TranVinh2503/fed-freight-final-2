import classNames from 'classnames/bind';
import styles from './UpdateOrder.module.scss';
import icons from '~/assets/icons/icons';
import Tippy from '@tippyjs/react/headless';
import UserBox from '~/components/UserBox';
import Button from '~/components/Button';
import 'tippy.js/dist/tippy.css';
import { Wrapper as PopperWrapper } from '~/components/Popper';
const cx = classNames.bind(styles);

function UpdateOrder() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('grid')}>
                <div className={cx('content')}>
                    <div className={cx('content-heading')}>Cập nhật trạng thái đơn hàng</div>
                    <Tippy
                        placement="bottom"
                        interactive
                        render={(attrs) => (
                            <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                                <PopperWrapper>
                                    <h4 className={cx('search-title')}>Kết quả phù hợp</h4>
                                    <UserBox search avatarId="mono" name="Moi Moi Moi" content="moimoimoimoi"></UserBox>
                                </PopperWrapper>
                            </div>
                        )}
                    >
                        <div className={cx('search-container')}>
                            <img src={icons.blackSearch} alt="" className={cx('logo')}></img>
                            <input
                                type="text"
                                className={cx('input')}
                                placeholder="Nhập mã đơn của khách hàng"
                            ></input>
                            <Button search>Tra cứu</Button>
                        </div>
                    </Tippy>

                    <div className={cx('user')}>
                        <UserBox interactiveUser avatarId="mono" idUser="Moi Moi Moi" content="Tư Vấn Viên"></UserBox>
                        <Button contact>Liên lạc</Button>
                    </div>

                    <div className={cx('input-field')}>
                        <div className={cx('sender')}>
                            <div className={cx('heading')}>Việt Nam</div>
                            <form className={cx('input-form')}>
                                <label htmlFor="">Người gửi</label>
                                <input type="text" placeholder="Họ và Tên"></input>
                                <label htmlFor="">Số điện thoại</label>
                                <input type="text" placeholder="Số điện thoại người gửi"></input>
                                <label htmlFor="">Địa chỉ gửi hàng</label>
                                <input type="text" placeholder="Địa chỉ người gửi"></input>
                                <label htmlFor="">Chọn chi nhánh gửi hàng</label>
                                <select></select>
                            </form>
                        </div>
                        <div className={cx('receiver')}>
                            <div className={cx('heading')}>Hàn Quốc</div>
                            <form className={cx('input-form')}>
                                <label htmlFor="">Người nhận hàng</label>
                                <input type="text" placeholder="Họ và Tên"></input>
                                <label htmlFor="">Số điện thoại</label>
                                <input type="text" placeholder="Số điện thoại người nhận"></input>
                                <label htmlFor="">Địa chỉ nhận hàng</label>
                                <input type="text" placeholder="Địa chỉ người gửi"></input>
                            </form>
                        </div>
                        <div className={cx('order')}>
                            <div className={cx('heading')}>Thông tin đơn hàng</div>
                            <div className={cx('order-container')}>
                                <form className={cx('order-info')}>
                                    <table>
                                        <tr>
                                            <th className={cx('column6')}>Nhập tên mặt hàng</th>
                                            <th className={cx('column1')}>Số lượng</th>
                                        </tr>
                                        <tr>
                                            <td>
                                                <input type="text" placeholder="Tên mặt hàng muốn gửi..."></input>
                                            </td>
                                            <td>
                                                <input type="text" placeholder="..."></input>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <input type="text" placeholder="Tên mặt hàng muốn gửi..."></input>
                                            </td>
                                            <td>
                                                <input type="text" placeholder="..."></input>
                                            </td>
                                        </tr>
                                        
                                    </table>
                                    <Button search>+</Button>
                                </form>
                                <form className={cx('order-note')}>
                                    <div>Mục ghi chú (Không bắt buộc)</div>
                                    <textarea></textarea>
                                </form>
                            </div>
                        </div>
                        <div className={cx('submit')}>
                            <Button search>Cập nhật</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateOrder;
