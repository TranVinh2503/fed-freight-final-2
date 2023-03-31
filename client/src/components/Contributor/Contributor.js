import classNames from 'classnames/bind';
import styles from './Contributor.module.scss';
import Button from '../Button';
import icons from '~/assets/icons';
import Tippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import { useContext } from 'react';
import axios from 'axios';
import { AppContext } from '~/Context/AppContext';

const cx = classNames.bind(styles);

function Contributor({ idContributor, stars, quantity, name }) {
    const userContext = useContext(AppContext);
    const user = userContext.user;

    const list = [];
    for (let i = 1; i <= stars; i++) {
        list.push(<img src={icons.star} key={i} alt="" className={cx('icon')}></img>);
    }
    for (let i = stars + 1; i <= 5; i++) {
        list.push(<img src={icons.uncolorStar} key={i} alt="" className={cx('icon')}></img>);
    }

    const handleSelect = async () => {
        const conversation = {
            senderId: user.id,
            receiverId: idContributor,
        };
        try {
            const res = await axios.post('http://localhost:8000/conversation', conversation);
            console.log(res.data);
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('detail')}>
                <div className={cx('info')}>
                    <div className={cx('rate')}>
                        <div className={cx('stars')}>{list}</div>
                        <div className={cx('votes')}>{quantity} đánh giá</div>
                    </div>
                    <div className={cx('name')}>{name}</div>
                </div>
                <Tippy
                    placement="top"
                    interactive
                    render={(attrs) => (
                        <PopperWrapper>
                            <Button option to="/chat" onClick={handleSelect}>
                                Nhắn tin
                            </Button>
                            <Button option to="/" onClick={handleSelect}>
                                Đặt Giao hàng
                            </Button>
                        </PopperWrapper>
                    )}
                >
                    <div className={cx('action')}>
                        <Button contact>Liên Lạc</Button>
                    </div>
                </Tippy>
            </div>
        </div>
    );
}

export default Contributor;
