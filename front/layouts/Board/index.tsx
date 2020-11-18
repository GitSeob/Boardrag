import React, {FC, useEffect} from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import LoadingCircle from '@components/LoadingCircle';
import { Redirect } from 'react-router-dom';

import {Stage, Layer, Rect} from 'react-konva';

const WorkSpace:FC = () => {
    const height = 1200;
    const width = 1920;

    const rectSize = 60;

    const RectOnCanvas = ({x = 60, y = 60}) => {
        console.log(x, y);
        return <Rect width={rectSize} height={rectSize} fill='#89b717' x={x} y={y}/>
    }
    const xarr = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
    const yarr = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

    console.log({xarr, yarr});

    return (
        <>
            <Stage width={width} height={height}>
                <Layer>
                    <RectOnCanvas/>
                    {xarr.map((x, i) => {
                        yarr.map((y, j) => {
                            console.log(x, y)
                            return <RectOnCanvas key={(100 * x + y)} x={360 + 60*x} y={360 + 60*y} />
                        })
                    })}
                </Layer>
            </Stage>
        </>
    )
}

const Board:FC = () => {
    const { data:userData, revalidate, error:error } = useSWR('/api/auth', fetcher);

    if (error)
        return <Redirect to="/auth" />

    if (!userData)
        return <LoadingCircle />

    return (
        <>
        <WorkSpace />
        </>
    );
}

export default Board;
