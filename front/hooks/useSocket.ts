
import { useCallback } from 'react';
import io from 'socket.io-client';

const backUrl = process.env.NODE_ENV === 'production' ? 'https://api.42board.com' : 'http://localhost:3095';

const sockets: { [key: string]: SocketIOClient.Socket } = {};

const useSocket = (board?: string): [SocketIOClient.Socket | undefined, () => void] => {
    const disconnect = useCallback(() => {
        if (board && sockets[board]) {
            sockets[board].disconnect();
            delete sockets[board];
        }
    }, [board]);

    if (!board) {
        return [undefined, disconnect];
    }

    if (!sockets[board]) {
        sockets[board] = io(`${backUrl}/board-${board}`, {
            transports: ['websocket'],
        });
        console.info('create socket', board, sockets[board].id);
    }

    return [sockets[board], disconnect];
};

export default useSocket;
