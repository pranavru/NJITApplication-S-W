import React from 'react';
import ReactPlayer from 'react-player';
import { Animated } from 'react-animated-css';
import { Card, UncontrolledCarousel } from 'reactstrap';


const items = []
const DisplayVideoComponent = (props) => {
    console.log(props.videoSrc)
    return (
        <div style={{ bottom: 0, left: 0, position: "absolute", marginLeft: '3%', marginTop: '5%', width: '28vw', height: '30vh' }}>
            <Animated
                animationIn='fadeInUp' animationOut='fadeOut'
                animationInDuration={400} animationOutDuration={600}
                className={props.disPlayVideo ? "displayBlock" : "displayNone"}
            >
                <Card style={{ padding: 4 }}>
                    {/* <ReactPlayer width="27vw" height="30vh" playing={props.disPlayVideo} url={props.videoSrc} onError={(err) => console.log(err)} /> */}
                    <UncontrolledCarousel items={items} controls={false} indicators={false} />

                </Card>
            </Animated>
        </div>
    );
}

export default DisplayVideoComponent;