import React from 'react';
import { Card, CardTitle, CardSubtitle, CardHeader, CardFooter } from 'reactstrap';
import Gallery from 'react-grid-gallery';

import "./MapInfoWindow.css";
import { baseUrl } from "../../shared/baseUrl";

function displayWindowHeader(props, displayImagesVideo, setToDisplay) {
    const p = props.point;
    const d = new Date(p.created);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return (<>
        <CardHeader>
            <CardTitle className="text-center" style={{ font: "1.1em monospace", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{p.address}<br />{months[d.getMonth()]} {d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()}, {d.getFullYear()}  {d.getHours() < 10 ? `0${d.getHours()}` : d.getHours()}:{d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()}</CardTitle>
        </CardHeader>
        {(p.keepAlive && p.videos) ? <div className="toggleVideoButton">
            <label className="switch" alt="Images/Videos">
                <input type="checkbox" onClick={() => setToDisplay(!displayImagesVideo)} />
                <span className="slider"></span>
            </label>
        </div> : <></>}
    </>)

}
function displaySpeech(props) {
    const p = props.point.all_speech;
    return p.length > 0 ?
        <CardSubtitle style={{ font: "1em monospace", fontWeight: 'bold', maxHeight: '45px', marginBlockEnd: '4px' }}><q>{p[0].speech}</q></CardSubtitle>
        : <></>
};

function displayPersonNames(props) {
    const p = props.point.person_names;
    return p.length > 0 ?
        <div className="row">
            {p.map((person, key) =>
                <div className="col-md-4" style={{ font: "1em monospace", border: 0, marginLeft: "2%", marginTop: '2%' }} key={key}>
                    <p>{'\u2022'} {person.person_name.toUpperCase()}</p>
                </div>
            )}
        </div> : <></>

}

function displayBody(props, displayImagesVideo) {
    const p = props.point;
    return !p.keepAlive ?
        (<div id="containerImg">
            <img src={baseUrl + (p.image !== "" ? p.image : p.thumbnail)} alt={p.id} id="theImage" />
        </div>) :
        (!displayImagesVideo ?
            !p.images ?
                <div id="containerImg">
                    <img src={baseUrl + (p.image !== "" ? p.image : p.thumbnail)} alt={p.id} id="theImage" />
                </div> :
                p.images.length > 0 ?
                    <Gallery
                        images={p.images}
                        enableImageSelection={false}
                        rowHeight={115}
                        maxRows={3}
                        backdropClosesModal={true}
                        showCloseButton={false}
                        showImageCount={true}
                        preloadNextImage={true}
                    /> :
                    <div id="containerImg">
                        <img src={baseUrl + (p.image !== "" ? p.image : p.thumbnail)} alt={p.id} id="theImage" />
                    </div> :
            <div className="row videoDiv">
                {p.videos.map(m => <div className="cardDisplay" onClick={() => props.v(m)}>
                    <img src={baseUrl + m.thumbnail} className="cardThumb" alt="" />
                    <img src="/mediaControl.svg" className="cardButton" alt="" />
                </div>)}
            </div>);
}

function displayFooter(props) {
    return <CardFooter className="footer" style={{ margin: '0px' }}>
        {displaySpeech(props)}
        {displayPersonNames(props)}
    </CardFooter>;
}

function MapInfoWindow(props) {
    const [displayImagesVideo, setToDisplay] = React.useState(false);
    console.log(displayImagesVideo)
    return (
        <Card style={{ width: "30vw", overflow: 'hidden' }}>
            {displayWindowHeader(props, displayImagesVideo, setToDisplay)}
            {displayBody(props, displayImagesVideo)}
            {displayFooter(props)}
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
*/