import React from 'react';
import { Animated } from 'react-animated-css';
import { Card, UncontrolledCarousel } from 'reactstrap';

const addImages = (props) => {
    console.log(props.videoSrc, props.baseURL)
    let items_array = props.videoSrc !== undefined ? props.videoSrc : []
    if (items_array.length > 0) {
        items_array.map(m => {
            let url = props.baseURL + m.src;
            console.log(url)
            m.src = url;
        })
    }
    return items_array;
}

const DisplayVideoComponent = (props) => {
    const items = addImages(props);
    return (
        <div id="caraouselView">
            {items.length > 0 ? <Animated
                animationIn='fadeInUp' animationOut='fadeOut'
                animationInDuration={400} animationOutDuration={600}
                className={props.disPlayVideo ? "displayBlock" : "displayNone"}
            >
                <Card style={{ padding: 4 }}>
                    <UncontrolledCarousel items={items} controls={false} indicators={false} />
                </Card>
            </Animated> : <></>}
        </div>
    );
}

export default DisplayVideoComponent;