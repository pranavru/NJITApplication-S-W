import React from 'react';
import { Animated } from 'react-animated-css';
import { Card, UncontrolledCarousel } from 'reactstrap';

const DisplayVideoComponent = (props) => {
    const items = props.videoSrc
    console.log(items)
    return (
        <div id="caraouselView">
            {items.length > 0 ?
                <Animated
                    animationIn='fadeInUp' animationOut='fadeOut'
                    animationInDuration={400} animationOutDuration={600}
                    className={props.disPlayVideo ? "displayBlock" : "displayNone"}
                >
                    <Card style={{ padding: 4 }}>
                        <UncontrolledCarousel items={items} controls={true} indicators={true} interval={2500} />
                    </Card>
                </Animated> : <></>}
        </div>
    );
}

export default DisplayVideoComponent;