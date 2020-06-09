import React from 'react';
import { Animated } from 'react-animated-css';
import { Card, UncontrolledCarousel } from 'reactstrap';

const DisplayVideoComponent = (props) => {
    const items = props.videoSrc
    return (
        <div id="caraouselView">
            {items.length > 0 ?
                <Animated
                    animationIn='fadeInUp' animationOut='fadeOut'
                    animationInDuration={400} animationOutDuration={600}
                    className={props.disPlayVideo ? "displayBlock" : "displayNone"}
                >
                    <Card style={{ padding: 4 }}>
                        <UncontrolledCarousel items={items} controls={true} indicators={true} interval={50} />
                    </Card>
                </Animated> : <></>}
        </div>
    );
}

export default DisplayVideoComponent;