import styled from '@emotion/styled';

export const Menu = styled.div`
    position: fixed;
    height: 100%;
    width: 200px;
    background: rgba(0, 0, 0, .5);
`;

export const RelBox = styled.div`
    position: relative;
    width: 100%;
    height: 100%;

    & > div {
        padding: 1.5rem;
        width: 100%;
        display: flex;
        align-items: center;
        height: 2rem;
        cursor: pointer;
        font-size: 14px;

        &:hover {
            background: #222;
        }

        img {
            height: 1rem;
            margin-right: .3rem;
        }
    }

    .logout {
        position: absolute;
        bottom: 0;
    }

    .logo {
        padding: 2rem 1.5rem;
        img { height: 2rem; }
        &:hover {
            background: none;
        }
    }
`;

export const Container = styled.div`
    margin-left: 200px;
    width: calc(100% - 200px);
    padding: 2rem;
`;

export const BCHeader = styled.div`
    position: relative;
    width: 100%;
`;

export const SearchForm = styled.form`
    position: absolute;
    display: flex;
    align-item: center;
    justify-content: center;
    background: rgba(255, 255, 255, .2);
    border-radius: 1rem;
    height: 1.5rem;
    padding: .25rem .5rem;
    right: 0;
    top: 0;
    font-size: 10px;

    img {
        height: 1rem;
        margin-right: .3rem;
    }

    input {
        background: transparent;
        padding: .1rem .5rem;
        color: #fff;
    }
`;

export const BoardContainer = styled.div`
    position: relative;
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    margin: 1rem 0;
`;

export const BoardCard = styled.div`
    padding: 1rem;
    background: rgba(0, 0, 0, .5);
    border-radius: 10px;
    box-shadow: 0 0 4px 1px #aaa;
    cursor: pointer;
    margin: .5rem 1rem .5rem 0;
    transition: .3s;

    &:hover {
        box-shadow: 0 0 8px 1px #aaa;
        transform: scale(1.05);
    }
`;

