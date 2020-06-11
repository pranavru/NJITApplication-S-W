import React from 'react';
import { Animated } from 'react-animated-css';
import { Card, UncontrolledCarousel } from 'reactstrap';
import ReactPlayer from 'react-player'

const DisplayVideoComponent = (props) => {
    const items = props.videoSrc
    return (
        <div style={{ marginTop: '5%' }}>
            {items !== "" ?
                <Animated
                    animationIn='fadeInUp' animationOut='fadeOut'
                    animationInDuration={400} animationOutDuration={600}
                // className={props.disPlayVideo ? "displayBlock" : "displayNone"}
                >
                    <Card style={{ padding: 4 }}>
                        {/* <UncontrolledCarousel items={items} controls={false} interval={500} slide={false} /> */}
                        <ReactPlayer url={"http://18.191.247.248" + items} autoPlay={true} controls={true} width="26.7vw" height="30vh" style={{ marginLeft: 2 }} muted={true} playing={false} />
                    </Card>
                </Animated> : <div className="loader"></div>}
        </div>
    );
}

export default DisplayVideoComponent;