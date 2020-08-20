import React from 'react';
import { Card } from 'reactstrap';
import { Animated } from 'react-animated-css';
import ReactPlayer from 'react-player/lazy'

import "../DisplayVideoComponent/DisplayVideoComponent.css"

import { baseUrl } from "../../shared/baseUrl";
import { connect } from 'react-redux';

const mapStateToProps = (state) => { return state.videoDetails }

const DisplayVideoComponent = (props) => {
    const [playVideo, setToPlay] = React.useState(false);
    const v = props.videoDetails;
    return (
        <div style={{ marginTop: '3%' }}>
            {!props.isLoading && !props.errMess ?
                <Animated animationIn='fadeInUp' animationOut='fadeOut'>
                    <Card style={{ padding: '4px' }}>
                        <ReactPlayer url={baseUrl + v.video} light={baseUrl + v.thumbnail}
                            controls={playVideo} width="100%" autoPlay height="29.5vh" muted
                            onReady={() => { setToPlay(true) }} onError={(err) => alert("Unable to Load Video ", err)}
                        />
                    </Card>
                </Animated>
                : <></>}
        </div>
    );
}

export default connect(mapStateToProps)(DisplayVideoComponent);