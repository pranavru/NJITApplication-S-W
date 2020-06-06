import React from 'react';
import ReactPlayer from 'react-player';
import { Animated } from 'react-animated-css';
import { Card } from 'reactstrap';

const DisplayVideoComponent = (props) => {
    return (
        <div style={{ bottom: 0, left: 0, position: "absolute", marginLeft: '3.5%', marginBottom: '3%', marginTop: '5%' }}>
            <Animated
                animationIn='fadeInUp' animationOut='fadeOut'
                animationInDuration={400} animationOutDuration={600}
                className={props.disPlayVideo ? "displayBlock" : "displayNone"}
            >
                <Card style={{ padding: 4 }}>
                    <ReactPlayer width="27vw" height="30vh" playing={props.disPlayVideo} url={props.videoSrc} onError={(err) => console.log(err)} />
                    {/* <embed src="videoNew.avi" width="400" height="300" CONTROLLER="true" LOOP="false" AUTOPLAY="false" name="IBM Video"></embed> */}
                    {/* <object data='/videoNew.mp4' width="340" height="220"> <param name="src" value='/videoNew.mp4' /> </object> */}
                </Card>
            </Animated>
        </div>
    );
}

export default DisplayVideoComponent;