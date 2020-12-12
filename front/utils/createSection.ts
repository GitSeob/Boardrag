import dayjs from 'dayjs';

interface Props {
    id: number,
    userId: number,
    username: string,
    content: string,
    createdAt: Date,
}

export default function makeSection<T extends Props>(chatList: T[]) {
    const sections: { [key: string]: T[] } = {};
    chatList.forEach((chat) => {
        const monthDate = dayjs(chat.createdAt).format('YYYY-MM-DD');
        if (Array.isArray(sections[monthDate])) {
            sections[monthDate].push(chat);
        } else {
            sections[monthDate] = [chat];
        }
    });
    return sections;
}
