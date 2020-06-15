import React from 'react';
import { Animated } from 'react-animated-css';
import { Card } from 'reactstrap';
import ReactPlayer from 'react-player'

const DisplayVideoComponent = (props) => {

    const [playVideo, setToPlay] = React.useState(false);
    // const [playVideo, setToPlay] = React.useState(false);
    const url = props.videoSrc
    return (
        <div style={{ marginTop: '5%' }}>
            {url !== "" ?
                <Animated
                    animationIn='fadeInUp' animationOut='fadeOut'
                    animationInDuration={400} animationOutDuration={600}
                // className={props.disPlayVideo ? "displayBlock" : "displayNone"}
                >
                    <Card style={{ padding: 4 }}>
                        {/* <UncontrolledCarousel items={items} controls={false} interval={500} slide={false} /> */}
                        <ReactPlayer
                            url={"http://18.191.247.248" + url} controls={playVideo} width="26.7vw"
                            height="30vh" style={{ marginLeft: 2 }} playing={playVideo} autoPlay muted
                            onReady={() => setToPlay(true)} onStart={() => console.log("Video is playing? ", playVideo)}
                            onPause={() => console.log("Video is playing? ", playVideo)}
                        />
                    </Card>
                </Animated> : <div className="loader"></div>}
        </div>
    );
}

export default DisplayVideoComponent;