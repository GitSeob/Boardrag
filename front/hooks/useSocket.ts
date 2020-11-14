
import { useCallback } from 'react';
import io from 'socket.io-client';

const backUrl = process.env.NODE_ENV === 'production' ? 'https://api.42board.com' : 'http://localhost:3095';

const sockets: { [key: string]: SocketIOClient.Socket } = {};

const useSocket = (workspace?: string): [SocketIOClient.Socket | undefined, () => void] => {
    const disconnect = useCallback(() => {
        if (workspace && sockets[workspace]) {
        sockets[workspace].disconnect();
        delete sockets[workspace];
        }
    }, [workspace]);
    if (!workspace) {
        return [undefined, disconnect];
    }
    if (!sockets[workspace]) {
        sockets[workspace] = io(`${backUrl}/ws-${workspace}`, {
        transports: ['websocket'],
        });
        console.info('create socket', workspace, sockets[workspace].id);
    }

    return [sockets[workspace], disconnect];
};

export default useSocket;
