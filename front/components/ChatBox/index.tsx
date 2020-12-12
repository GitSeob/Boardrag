import React, { FC, useEffect, useCallback, useRef, RefObject } from 'react';
import { useSWRInfinite } from 'swr';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);
import axios from 'axios';
import { Scrollbars } from 'react-custom-scrollbars';
import { IUser } from '@typings/datas';
import fetcher from '@utils/fetcher';
import { Chat, ChatForm, ChatRoom, StickyHeader } from './style';
import createSection from '@utils/createSection';
import useSocket from '@hooks/useSocket';
import useInput from '@hooks/useInput';

const PAGE_SIZE = 20;

interface IChatBox {
    userData: IUser,
    board: string
}

interface IChat {
    id: number,
    userId: number,
    username: string,
    content: string,
    createdAt: Date,
}

const ChatBox:FC<IChatBox> = ({ userData, board }) => {
    const [socket, disconnectSocket] = useSocket(board);
    const { data:chatData, mutate:mutateChat, setSize } = useSWRInfinite<IChat[]>(
        (index) => userData ? `/api/board/${board}/chats?perPage=${PAGE_SIZE}&page=${index + 1}` : null,
        fetcher
    );
    const [chat, OCChat, setChat] = useInput('');
    const [isFirst, setIsFirst] = React.useState(true);
    const now = new Date();
    const scrollbarRef = useRef<Scrollbars>(null);

    const chatSections = createSection(chatData ? ([] as IChat[]).concat(...chatData).reverse() : []);

    const isEmpty = chatData?.[0]?.length === 0;
    const isReachingEnd = isEmpty || (chatData && chatData[0]?.length < PAGE_SIZE);

    const submitMessage = useCallback((e) => {
        e.preventDefault();
        if (chat?.trim() && chatData && userData) {
            const savedChat = chat;
            mutateChat((prevChatData) => {
                prevChatData[0].unshift({
                    id: (chatData[0][0]?.id || 0) + 1,
                    userId: userData.id,
                    username: userData.username,
                    content: savedChat,
                    createdAt: new Date(),
                });
                return prevChatData;
            }, false).then(() => {
                setChat('');
                if (scrollbarRef.current)
                    scrollbarRef.current.scrollToBottom();
            });
            axios.post(`/api/board/${board}/chat`, {
                content: savedChat,
                userId: userData.id,
                username: userData.username
            }).catch(console.error);
        }
    }, [userData, chat]);

    const onKeydownChat = useCallback((e) => {
        if (e.key === 'Enter') {
            if (!e.shiftKey) {
                e.preventDefault();
                submitMessage(e);
            }
        }
    }, [chat]);

    const onMessage = (data: IChat) => {
        if (userData && data.userId !== userData?.id) {
            mutateChat((chatData) => {
                chatData[0].unshift(data);
                return chatData;
            }, false).then(() => {
                console.log('get new Message');
            });
        }
    };

    const onScroll = useCallback(
        (values) => {
            if (values.scrollTop === 0 && !isReachingEnd && !isEmpty ) {
                setSize((size) => size + 1).then(() => {
                    scrollbarRef.current?.scrollTop(scrollbarRef.current?.getScrollHeight() - values.scrollHeight);
                });
            }
        }, [scrollbarRef, isReachingEnd, isEmpty]);

    useEffect(() => {
        socket?.on("newChat", onMessage);
        return () => {
            socket?.off('newChat', onMessage);
        };
    }, [socket, userData]);

    useEffect(() => {
        if (chatData?.length === 1) {
            scrollbarRef.current?.scrollToBottom();
            setIsFirst(false);
        }
    }, [chatData, isReachingEnd, isEmpty]);

    return (
        <>
            <p>현재 접속한 사람들과 채팅을 할 수 있습니다.</p>
            <ChatRoom>
                <Scrollbars
                    autoHide
                    ref={scrollbarRef}
                    onScrollFrame={onScroll}
                    style={{height: "100%", overflow: 'auto'}}
                >
                    {Object.entries(chatSections).map(([date, chats]) => {
                        return (
                            <section key={date}>
                                <StickyHeader>{date}</StickyHeader>
                                { chats.map(c => (
                                    <Chat key={(c.id)} className={`${c.userId === userData?.id ? 'myChat' : '' }`}>
                                        <p>{c.username}</p>
                                        <div>
                                            <div>{c.content}</div>
                                            <p>{dayjs(c.createdAt).diff(now, 'day') > -1 ? dayjs(c.createdAt).format('LT') : dayjs(c.createdAt).format('YYYY년 MM월 DD일')}</p>
                                        </div>
                                    </Chat>
                                ))}
                            </section>
                        )
                    })}
                </Scrollbars>
            </ChatRoom>
            <ChatForm
                onSubmit={submitMessage}
            >
                <input
                    type="text"
                    value={chat}
                    onChange={OCChat}
                    onKeyPress={onKeydownChat}
                    placeholder="이곳에 채팅을 입력해주세요"
                />
            </ChatForm>
        </>
    );
}

export default ChatBox;
