import React, {FC} from 'react';
import {LoadingCircleContainer, LoadingCircleBox, LoadingCircleCore} from './style';

const LoadingCircle:FC = () => {
    return (
        <LoadingCircleContainer>
            <LoadingCircleBox>
                <LoadingCircleCore></LoadingCircleCore>
            </LoadingCircleBox>
        </LoadingCircleContainer>
    );
}

export default LoadingCircle;
