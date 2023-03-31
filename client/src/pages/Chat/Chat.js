import classNames from 'classnames/bind';
import styles from './Chat.module.scss';
import icons from '~/assets/icons/icons';
import UserBox from '~/components/UserBox';
import Bubble from '~/components/Bubble';
import { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { AppContext } from '~/Context/AppContext';
const cx = classNames.bind(styles);

function Chat() {
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const socket = useRef();
    const scrollRef = useRef();
    const { user } = useContext(AppContext);

    useEffect(() => {
        socket.current = io('http://localhost:8000');

        socket.current.on('getMessage', (data) => {
            console.log(data);
            const newMessage = {
                sender: data.senderId,
                text: data.text,
            };
            // data && currentChat?.members.includes(data.sender) &&
            setMessages((oldMsgs) => [...oldMsgs, newMessage]);
        });
        return () => {
            socket.current.disconnect();
        };
    }, []);

    useEffect(() => {
        socket.current.emit('addUser', user.id);
        socket.current.on('getUsers', (users) => {});
    }, [user]);

    useEffect(() => {
        const getConversations = async () => {
            try {
                if (user.id !== '') {
                    const res = await axios.get('http://localhost:8000/conversation/' + user.id);
                    setConversations(res.data);
                }else{
                    console.log('not has new chat box')
                }
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

        socket.current.emit('sendMessage', {
            senderId: user.id,
            receiverId: user.id === currentChat.senderId ? currentChat.receiverId : currentChat.senderId,
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
                            <div onClick={() => setCurrentChat(c)} key={index}>
                                <UserBox
                                    chatbox
                                    key={index}
                                    avatarId={'mono'}
                                    idUser={user.id === c.senderId ? c.receiverId : c.senderId}
                                    content={'nhấn vào để xem'}
                                />
                            </div>
                        ))}
                    </div>

                    <div className={cx('chat-room')}>
                        <div className={cx('chat-screen')}>
                            {currentChat ? (
                                <>
                                    {messages.map((m, index) => (
                                        <div key={index} ref={scrollRef}>
                                            <Bubble key={index} own={m.sender === user.id} content={m.text}></Bubble>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <span className={cx('no-conversations-chat')}>Vui lòng nhấn vào một hộp thoại</span>
                            )}
                        </div>
                        {currentChat && (
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
                                            placeholder="write something..."
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
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;
