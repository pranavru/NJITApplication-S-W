import React from 'react';
import { Animated } from 'react-animated-css';
import { Card } from 'reactstrap';
import ReactPlayer from 'react-player'
import "../DisplayVideoComponent/DisplayVideoComponent.css"
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    return {
        Video: state.video
    }
}
const DisplayVideoComponent = (props) => {
    const [playVideo, setToPlay] = React.useState(false);
    return (
        <div style={{ marginTop: '5%' }}>
            {!props.Video.isLoading ?
                <Card style={{ padding: '4px' }}>
                    <Animated animationIn='fadeInUp' animationOut='fadeOut'>
                        {/* <UncontrolledCarousel items={items} controls={false} interval={500} slide={false} /> */}
                        <ReactPlayer url={props.Video.video} controls={playVideo} width="100%"
                            height="37vh" playing={playVideo} autoPlay muted
                            onReady={() => setToPlay(true)}
                            onError={(err) => alert("Unable to Load Video ", err.message)}
                        />
                        {/* <iframe src="https://localhost:3443/index.html" className="videoDisplay" /> */}
                    </Animated>
                </Card>
                : <div className="loader"></div>}
        </div>
    );
}

export default connect(mapStateToProps)(DisplayVideoComponent);