import React from 'react';
import { Card } from 'reactstrap';
import { Animated } from 'react-animated-css';
import ReactPlayer from 'react-player/lazy'

import "../DisplayVideoComponent/DisplayVideoComponent.css"

import { connect } from 'react-redux';

const mapStateToProps = (state) => { return state.videoDetails }

const DisplayVideoComponent = (props) => {
    const [playVideo, setToPlay] = React.useState(false);
    const { REACT_APP_BASE_URL } = process.env;
    const v = props.videoDetails;
    const params = {
        url: REACT_APP_BASE_URL + v.video,
        light: REACT_APP_BASE_URL + v.thumbnail,
        controls: playVideo,
        width: "100%", height: "29.5vh",
        autoPlay: true, muted: true,
        onReady: () => setToPlay(true),
        onError: (err) => alert("Unable to Load Video ", err)
    }
    return (
        <div style={{ marginTop: '3%' }}>
            {!props.isLoading && !props.errMess ?
                <Animated animationIn='fadeInUp' animationOut='fadeOut'>
                    <Card style={{ padding: '4px' }}>
                        <ReactPlayer {...params} />
                    </Card>
                </Animated>
                : <></>}
        </div>
    );
}

export default connect(mapStateToProps)(DisplayVideoComponent);