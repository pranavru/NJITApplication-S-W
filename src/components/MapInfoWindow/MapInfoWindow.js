import React from 'react';
import { Card, CardTitle, CardSubtitle, CardHeader, CardFooter } from 'reactstrap';
import Gallery from 'react-grid-gallery';

import "./MapInfoWindow.css";
import ImageComponent from '../ImageComponent/ImageComponent';

function displayWindowHeader(props, displayImagesVideo, setToDisplay) {
    const p = props.point;
    return (<>
        <CardHeader style={{ marginBottom: '0px' }}>
            <CardTitle className="text-center" style={{ font: "1.1em monospace", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", marginBottom: 0 }}>{p.address}
                <p> Images: {p.images.length}, Videos: {p.videos.length}</p>
            </CardTitle>
        </CardHeader>
        {(p.keepAlive && p.videos) ? <div className="toggleVideoButton">
            {(p.videos.length > 0 && !p.images.length > 0) || (!p.videos.length > 0 && p.images.length > 0) ?
                <></>
                : <label className="switch" alt="Images/Videos">
                    <input type="checkbox" onClick={() => setToDisplay(!displayImagesVideo)} />
                    <span className="slider"></span>
                </label>}
        </div> : <></>}
    </>)
}

function displayBody(props, displayImagesVideo, setSpeechValues, setToDisplay) {
    const p = props.point;
    const { REACT_APP_BASE_URL } = process.env;

    return !p.keepAlive ?

        //Display Image if Marker is not clicked and only hovered. If No Image Found then checks for Video or else "No Image Found" is displayed
        (p.image && !p.video) ?
            <div id="containerImg">
                <ImageComponent src={REACT_APP_BASE_URL + p.image} alt={p.id} idTag="theImage" />
            </div>
            : <div id="containerImg" onClick={() => onVideoClicked(props, p, setSpeechValues)}>
                <img src={REACT_APP_BASE_URL + p.thumbnail} id="theImage" alt="Thumbnail not found" />
                <img src="/mediaControl.svg" className="cardButtonOnHover" alt="Load svg" onClick={() => onVideoClicked(props, p, setSpeechValues)} title="Click to view the video" />
            </div>

        : !displayImagesVideo ?
            //If Info Window is kept alive, as Marker is clicked

            !p.images ?

                //If no Images found  
                <div id="containerImg">
                    <ImageComponent src={REACT_APP_BASE_URL + p.image} alt={p.id} idTag="theImage" />
                </div>

                : p.images.length > 0 ?
                    <div className="galleryDiv">
                        <Gallery
                            images={p.images}
                            enableImageSelection={false}
                            rowHeight={130}
                            maxRows={5}
                            backdropClosesModal={true}
                            showCloseButton={false}
                            showImageCount={true}
                            preloadNextImage={true}
                            tagStyle={{ backgroundColor: "#2C4870", font: "8px monospace", fontWeight: "bold", color: "#ffff1a", padding: '3px', borderRadius: '3px' }}
                        />
                    </div>
                    : setToDisplay(true)

            : <div className="row videoDiv" style={{ margin: '0px' }}>
                {p.videos.map(m =>
                    <div className="cardDisplay" onClick={() => onVideoClicked(props, m, setSpeechValues)}>
                        <ImageComponent src={REACT_APP_BASE_URL + m.thumbnail} classes="cardThumb" alt="Thumbnail not found" />
                        <img src="/mediaControl.svg" className="cardButton" alt="Load svg" onClick={() => onVideoClicked(props, m, setSpeechValues)} />
                        <div className="row cardDate">
                            {m.tags.map(t =>
                                <div className="tagStyle">
                                    {t.value}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>;
}

function onVideoClicked(props, m, setSpeechValues) {
    props.v(m); setSpeechValues(m);
}

function displaySpeech(props) {
    const p = props.caption;
    return p.length > 0 ?
        <CardSubtitle className="infoWindowSpeech">
            {p.map(s =>
                <div style={{ margin: '1px', borderBottom: "1px solid #e6e6e6" }}>
                    <p style={{ margin: 'inherit' }}>
                        <q>{s.speech}</q>
                    </p>
                </div>
            )}
        </CardSubtitle >
        : <></>
};

function displayFooter(props) {
    return <CardFooter className="footer" style={{ margin: '0px', minHeight: '40px' }}>
        {displaySpeech(props)}
    </CardFooter>;
}

function MapInfoWindow(props) {
    const [displayImagesVideo, setToDisplay] = React.useState(false);
    const [displaySpeechValue, setSpeechValues] = React.useState(undefined);
    return (
        <Card style={{ width: "30vw", overflow: 'hidden' }} >
            {displayWindowHeader(props, displayImagesVideo, setToDisplay)}
            {displayBody(props, displayImagesVideo, setSpeechValues, setToDisplay)}
            {displayImagesVideo && displaySpeechValue ? displayFooter(displaySpeechValue) : <CardFooter style={{ minHeight: '40px' }}></CardFooter>}
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
    function displayPersonNames(props) {
        const p = props.tags;
        return p.length > 0 ?
            <div className="row">
                {p.map((person, key) =>
                    key !== 0 ? <div className="col-md-4" style={{ font: "1em monospace", border: 0, marginLeft: "2%", marginTop: '2%' }} key={key}>
                        <p style={{ margin: '1px' }}>{'\u2022'} {person.value.toUpperCase()}</p>
                    </div> : <></>
                )}
            </div> : <></>
    }
*/