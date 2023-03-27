import classNames from 'classnames/bind';
import styles from './Contributor.module.scss';
import Button from '../Button';
import icons from '~/assets/icons';
import Tippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import { useState,useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';


const cx = classNames.bind(styles);

function Contributor({ idContributor,stars, quantity, name }) {
    const [user, setUser] = useState([
        {
            id: '',
            userName: '',
        },
    ]);
    const list = [];
    for (let i = 1; i <= stars; i++) {
        list.push(<img src={icons.star} key={i} alt="" className={cx('icon')}></img>);
    }

    function getUserFromToken(token) {
        try {
            const decodedToken = jwtDecode(token);
            return decodedToken;
        } catch (error) {
            if (error.name === 'InvalidTokenError') {
                console.log('Invalid token specified');
            } else {
                console.log('Error decoding token:', error.message);
            }
        }
    }
    useEffect(() => {
        const userFromToken = localStorage.getItem('access-token');
        setUser(getUserFromToken(userFromToken));
    }, []);

    const handleSelect = async ()=>{
        const conversation = {
            senderId: user.id,
            receiverId:idContributor

        }
        try{
            
            const res = await axios.post('http://localhost:8000/conversation',conversation)
            console.log(res.data)

        }catch(err){
            console.log(err)
        }
    }
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
