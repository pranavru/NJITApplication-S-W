import React from 'react';
import { Animated } from 'react-animated-css';
import { Card, Spinner } from 'reactstrap';
import ReactPlayer from 'react-player/lazy'
import "../DisplayVideoComponent/DisplayVideoComponent.css"
import { connect } from 'react-redux';

const mapStateToProps = (state) => { return state.videoDetails }

const DisplayVideoComponent = (props) => {
    console.log(props)
    const [playVideo, setToPlay] = React.useState(false);
    return (
        <div style={{ marginTop: '3%' }}>
            {!props.isLoading && !props.errMess ?
                <Animated animationIn='fadeInUp' animationOut='fadeOut'>
                    <Card style={{ padding: '4px' }}>
                        {/* <UncontrolledCarousel items={items} controls={false} interval={500} slide={false} /> */}
                        {/* <iframe src="https://localhost:3443/index.html" className="videoDisplay" /> */}
                        {/* {playVideo ? <></> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner /></div>} */}
                        < ReactPlayer url={props.videoDetails.video} controls={playVideo} width="100%"
                            height="29.5vh" muted light={props.videoDetails.thumbnail} onReady={() => setToPlay(true)}
                            onError={(err) => alert("Unable to Load Video ", err)}
                        />
                    </Card>
                </Animated>
                : <></>}
        </div>
    );
}

export default connect(mapStateToProps)(DisplayVideoComponent);