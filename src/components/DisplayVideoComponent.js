import React from 'react';
import ReactPlayer from 'react-player';
import { Animated } from 'react-animated-css';
import { Card } from 'reactstrap';

const DisplayVideoComponent = (props) => {

    console.log(props.videoSrc)
    return (
        <div style={{ bottom: 0, left: 0, position: "absolute", marginLeft: '3.5%', marginBottom: '3%', marginTop: '5%' }}>
            <Animated
                animationIn='fadeInUp' animationOut='fadeOut'
                animationInDuration={400} animationOutDuration={600}
                className={props.disPlayVideo ? "displayBlock" : "displayNone"} >
                <Card style={{ padding: 4 }}>
                    <ReactPlayer width="27vw" height="30vh" playing={props.disPlayVideo} url={props.videoSrc} onError={(err) => console.log(err)} />
                </Card>
            </Animated>
        </div>
    );
}

export default DisplayVideoComponent;