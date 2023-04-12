import classNames from 'classnames/bind';
import styles from './Chat.module.scss';
import icons from '~/assets/icons/icons';
import UserBox from '~/components/UserBox';
import Bubble from '~/components/Bubble';
import { useState, useEffect, useRef } from 'react';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import { io } from 'socket.io-client';
const cx = classNames.bind(styles);

function Chat() {
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const socket = useRef();
    const scrollRef = useRef();
    const [user, setUser] = useState([
        {
            id: '',
            userName: '',
        },
    ]);
    useEffect(() => {
        socket.current = io('ws://localhost:8900');
        socket.current.on('getMessage', (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createAt: Date.now(),
            });
        });
    }, []);

    useEffect(() => {
        arrivalMessage &&
            currentChat?.senderId === arrivalMessage?.sender &&
            setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat]);

    useEffect(() => {
        socket.current.emit('addUser', user.id);
        socket.current.on('getUsers', (users) => {
            console.log(users);
        });
    }, [user]);

    function getUserFromToken(token) {
        try {
            const decodedToken = jwtDecode(token);
            console.log(decodedToken);

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

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get('http://localhost:8000/conversation/' + user.id);
                setConversations(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getConversations();
    }, [user.id]);

    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get('http://localhost:8000/message/' + currentChat?.id);
                setMessages(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getMessages();
    }, [currentChat]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const message = {
            sender: user.id,
            text: newMessage,
            conversationId: currentChat.id,
        };

        // console.log( parseInt(user.id) === parseInt(currentChat.senderId) , currentChat.senderId )

        socket.current.emit('sendMessage', {
            senderId: user.id,
            receiverId:
                parseInt(user.id) === parseInt(currentChat.senderId) ? currentChat.receiverId : currentChat.senderId,
            text: newMessage,
        });

        try {
            const res = await axios.post('http://localhost:8000/message', message);
            setMessages([...messages, res.data]);
            setNewMessage('');
        } catch (err) {
            console.log(err);
        }
    };
    console.log(user.id);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('grid')}>
                <div className={cx('search-container')}>
                    <div className={cx('search')}>
                        <img src={icons.search} alt="" className={cx('logo')}></img>
                        <input type="text" className={cx('input')} placeholder="Tìm kiếm người dùng"></input>
                    </div>
                </div>
                <div className={cx('chat-container')}>
                    <div className={cx('chat-list')}>
                        {conversations.map((c, index) => (
                            <div>
                                <input className={cx('chat-box')} type="radio" name="chat-box" id={index}></input>
                                <label
                                    className={cx('user-box')}
                                    htmlFor={index}
                                    onClick={() => setCurrentChat(c)}
                                    key={index}
                                >
                                    <UserBox
                                        chatbox
                                        key={index}
                                        avatarId={'mono'}
                                        idUser={parseInt(user.id) === parseInt(c.senderId) ? c.receiverId : c.senderId}
                                        content={'nhấn vào để xem'}
                                    ></UserBox>
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className={cx('chat-room')}>
                        <div className={cx('chat-screen')}>
                            {currentChat ? (
                                <>
                                    {messages.map((m, index) => (
                                        <div key={index} ref={scrollRef}>
                                            <Bubble
                                                key={index}
                                                own={parseInt(m.sender) === user.id}
                                                content={m.text}
                                            ></Bubble>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <span className={cx('no-conversations-chat')}>Vui lòng nhấn vào một hộp thoại</span>
                            )}
                        </div>
                        <div className={cx('chat-send')}>
                            <form>
                                <input type="file" name="file" id="file" className={cx('file')}></input>
                                <label htmlFor="file">
                                    <img src={icons.picture} alt="" className={cx('icon')}></img>
                                </label>

                                <div className={cx('message-input')}>
                                    <input
                                        type="text"
                                        name="message"
                                        id="message"
                                        className={cx('input')}
                                        placeholder="Aa..."
                                        onChange={(e) => {
                                            setNewMessage(e.target.value);
                                        }}
                                        value={newMessage}
                                    ></input>
                                </div>

                                <input
                                    type="submit"
                                    name="send"
                                    id="send"
                                    className={cx('send')}
                                    onClick={handleSubmit}
                                ></input>
                                <label htmlFor="send">
                                    <img src={icons.send} alt="" className={cx('icon')}></img>
                                </label>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;
