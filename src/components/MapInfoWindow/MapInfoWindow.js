import React from 'react';
import { Card, CardText, CardTitle, CardSubtitle, CardHeader, CardFooter } from 'reactstrap';
import ReactPlayer from 'react-player'
import Gallery from 'react-grid-gallery';

import "./MapInfoWindow.css";
import { baseUrl } from "../../shared/baseUrl";

function displayWindowHeader(props, playVideo, setToPlay) {
    const d = new Date(props.point.created);
    const styleImg = { width: '800px', height: '800px' };
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return (
        <>
            <CardHeader>
                <CardTitle className="text-center" style={{ font: "1.1em monospace", overflow: "clip", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{props.point.address} <br /> {months[d.getMonth()]} {d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()}, {d.getFullYear()}  {d.getHours() < 10 ? `0${d.getHours()}` : d.getHours()}:{d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()}</CardTitle>
            </CardHeader>
            {
            !props.point.keepAlive ?
                <div id="containerImg">
                    <img src={baseUrl + props.point.imageFile} alt={props.point.id} id="theImage" />
                </div> :
                <Gallery
                    images={props.point.video}
                    enableImageSelection={false}
                    rowHeight={95}
                    maxRows={3}
                    backdropClosesModal={true}
                    showCloseButton={false}
                    lightBoxProps={styleImg}
                    showImageCount={false}
                    preloadNextImage={true}
                />
            }
        </>)

}
function displayBody(props) {
    return props.point.speech !== "" ?
        <CardSubtitle style={{ font: "1em monospace", fontWeight: 'bold' }}><q>{props.point.speech}</q></CardSubtitle>
        : <div></div>
};

function displayFooter(props) {
    return props.point.person_names.length !== 0 ?
        <>
            <CardText>
                <div className="row">
                    {props.point.person_names.map(person =>
                        <div className="col-md-4" style={{ font: "1em monospace", border: 0, marginLeft: "2%", marginTop: '2%' }} ><p>{'\u2022'} {person.person_name.toUpperCase()}</p> </div>
                    )}
                </div>
            </CardText>
        </> : <div></div>

}

function MapInfoWindow(props) {
    const [playVideo, setToPlay] = React.useState(false);

    return (
        <Card style={{ width: "30vw" }}>
            {displayWindowHeader(props, playVideo, setToPlay)}
            <CardFooter className="footer" style={{ margin: '0px' }}>
                {displayBody(props)}
                {displayFooter(props)}
            </CardFooter>
        </Card>
    )
}

export default MapInfoWindow;

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