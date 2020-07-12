import React from 'react';
import { usePromiseTracker } from "react-promise-tracker";
import Loader from 'react-loader-spinner';

const LoadingIndicator = props => {
    const { promiseInProgress } = usePromiseTracker();

    return promiseInProgress &&
        <div
            style={{
                position: "absolute",
                width: "75%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                right: "0"
            }}
        >
            <Loader type="Oval" color="#000000" height="200" width="200" />
        </div>
};

export default LoadingIndicator;