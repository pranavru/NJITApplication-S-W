import React from 'react';
import { Card, CardTitle, CardSubtitle, CardHeader, CardFooter } from 'reactstrap';
import Gallery from 'react-grid-gallery';

import "./MapInfoWindow.css";

import { baseUrl } from "../../shared/baseUrl";

function displayWindowHeader(props, displayVideo, setToVideo) {
    const d = new Date(props.point.created);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return (<>
        <CardHeader>
            <CardTitle className="text-center" style={{ font: "1.1em monospace", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{props.point.address}<br />{months[d.getMonth()]} {d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()}, {d.getFullYear()}  {d.getHours() < 10 ? `0${d.getHours()}` : d.getHours()}:{d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()}</CardTitle>
        </CardHeader>
        {props.point.keepAlive ? <div className="toggleVideoButton">
            <label class="switch" alt="Images/Videos">
                <input type="checkbox" onClick={() => setToVideo(!displayVideo)} />
                <span class="slider"></span>
            </label>
        </div> : <></>}
    </>)

}
function displaySpeech(props) {
    return props.point.all_speech.length > 0 ?
        <CardSubtitle style={{ font: "1em monospace", fontWeight: 'bold', maxHeight: '45px', marginBlockEnd: '4px' }}><q>{props.point.all_speech[0].speech}</q></CardSubtitle>
        : <></>
};

function displayPersonNames(props) {
    return props.point.person_names.length > 0 ?
        <div className="row">
            {props.point.person_names.map((person, key) =>
                <div className="col-md-4" style={{ font: "1em monospace", border: 0, marginLeft: "2%", marginTop: '2%' }} key={key}>
                    <p>{'\u2022'} {person.person_name.toUpperCase()}</p>
                </div>
            )}
        </div> : <></>

}

function MapInfoWindow(props) {
    const [displayVideo, setToVideo] = React.useState(false);

    return (
        <Card style={{ width: "28.5vw", overflow: 'hidden' }}>
            {displayWindowHeader(props, displayVideo, setToVideo)}
            {displayBody(props, displayVideo)}
            {displayFooter(props)}
        </Card>
    )
}

export default MapInfoWindow;


function displayBody(props, displayVideo) {
    const p = props.point;
    return !p.keepAlive ?
        <div id="containerImg">
            <img src={baseUrl + (p.image !== "" ? p.image : p.thumbnail)} alt={p.id} id="theImage" />
        </div> :
        !displayVideo ?
            !p.images.length > 0 ? <></> :
                <Gallery
                    images={p.images}
                    enableImageSelection={false}
                    rowHeight={135}
                    maxRows={3}
                    backdropClosesModal={true}
                    showCloseButton={false}
                    showImageCount={false}
                    preloadNextImage={true} /> :
            <div className="row videoDiv">
                {p.videos.map(m => <div className="cardDisplay" onClick={() => props.v(m)}>
                    <img src={m.thumbnail} className="cardThumb" alt="" />
                    <img src="/mediaControl.svg" className="cardButton" alt="" />
                </div>)}
            </div>;
}

function displayFooter(props) {
    return <CardFooter className="footer" style={{ margin: '0px' }}>
        {displaySpeech(props)}
        {displayPersonNames(props)}
    </CardFooter>;
}
/*
    <CardHeader>
        <CardTitle style={{ fontWeight: 'bold', fontSize: 16 }}>Vizux ID: {props.point.id} </CardTitle>
        <CardSubtitle style={{ fontWeight: 'bold', fontSize: 12 }}>Country Location: {props.point.country}</CardSubtitle>
        <CardImg top src={'/images (1).jpeg'} alt={props.point.id} style={{ width: 50, height: 50, borderRadius: 30, position: 'absolute', left: 300, top: 8 }} />
    </CardHeader>;

    // <ReactPlayer url={props.point.video} controls={playVideo} width="100%"
    //     height="37vh" playing={playVideo} autoPlay muted
    //     onReady={() => setToPlay(true)}
    //     onError={(err) => alert("Unable to Load Video ", err)}
    // />
*/