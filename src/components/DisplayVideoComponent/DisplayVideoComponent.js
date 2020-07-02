import React from 'react';
import { Animated } from 'react-animated-css';
import { Card } from 'reactstrap';
import ReactPlayer from 'react-player'
import "../DisplayVideoComponent/DisplayVideoComponent.css"

const DisplayVideoComponent = (props) => {

    const [playVideo, setToPlay] = React.useState(false);
    const url = props.videoSrc
    return (
        <div style={{ marginTop: '5%' }}>
            {/* {url !== "" ? */}
                <Animated animationIn='fadeInUp' animationOut='fadeOut'>
                        {/* <UncontrolledCarousel items={items} controls={false} interval={500} slide={false} /> */}
                        {/* <ReactPlayer wait={3000}
                            url={"http://18.191.247.248" + url} controls={playVideo} width="98%"
                            height="30vh" style={{ marginLeft: 2 }} playing={playVideo} autoPlay muted
                            onReady={() => setToPlay(true)} onStart={() => console.log("Video is playing? ", playVideo)}
                        /> */}
                        <iframe src="https://localhost:3443/index.html" className="videoDisplay"/>
                </Animated>
                 {/* : <div className="loader"></div>} */}
        </div>
    );
}

export default DisplayVideoComponent;