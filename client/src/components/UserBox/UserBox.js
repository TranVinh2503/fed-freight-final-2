import classNames from 'classnames/bind';
import styles from './UserBox.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';

const cx = classNames.bind(styles);

function UserBox({ feedback = false, chatbox = false, search = false, interactiveUser = false, avatarId, idUser, content }) {
    let id = JSON.stringify(avatarId).replaceAll('"', '');
    // let src = '..' + id + '.jpg';
    // console.log(src);

    // const avatarSrc = require(src);
    const [name, setName] = useState('');
    useEffect(() => {
        const getConversations = async () => {
            try {
                await fetch('http://localhost:8000/user/' + idUser)
                    .then((res) => res.json())
                    .then((data) => {
                        setName(data.userName);
                    });
            } catch (err) {
                console.log(err);
            }
        };
        getConversations();
    }, [idUser]);

    const avatarSrc = require('~/assets/images/mono.jpg');
    const classes = cx('wrapper', {
        feedback,
        chatbox,
        search,
        interactiveUser,
    });
    return (
        <div className={classes}>
            <img src={avatarSrc} alt="" className={cx('customer-avatar')}></img>
            <div className={cx('customer-details')}>
                <div className={cx('customer-name')}>{name}{idUser}</div>
                <div className={cx('customer-text')}>{content}</div>
            </div>
        </div>
    );
}

export default UserBox;
