import React from 'react';
import { Card, CardTitle, CardSubtitle, CardHeader, CardFooter } from 'reactstrap';
import Gallery from 'react-grid-gallery';

import "./MapInfoWindow.css";
import ImageComponent from '../ImageComponent/ImageComponent';

/**
 * @param  {Object} props
 * @param  {Boolean} displayImagesVideo
 * @param  {function} setToDisplay
 */
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

/**
 * @param  {Object} props
 * @param  {Boolean} displayImagesVideo
 * @param  {function} setSpeechValues
 * @param  {function} setToDisplay
 */
function displayBody(props, displayImagesVideo, setSpeechValues, setToDisplay) {
    const p = props.point;
    const { REACT_APP_BASE_URL } = process.env;

    return !p.keepAlive ?

        /**
         * Display Image if Marker is not clicked and only hovered. 
         * If No Image Found then checks for Video or else "No Image Found" Thumbnail is displayed
         */
        (p.image && !p.video) ?
            <div id="containerImg">
                <ImageComponent src={REACT_APP_BASE_URL + p.image} alt={p.id} idTag="theImage" />
            </div>
            : <div id="containerImg" onClick={() => onVideoClicked(props, p, setSpeechValues)}>
                <img src={REACT_APP_BASE_URL + p.thumbnail} id="theImage" alt="Thumbnail not found" />
                <img src="/mediaControl.svg" className="cardButtonOnHover" alt="Load svg" onClick={() => onVideoClicked(props, p, setSpeechValues)} title="Click to view the video" />
            </div>

        : !displayImagesVideo ?

            /**
             * If the marker is clicked and the displayImagesVideo is set to true then 
             * It checks for the Images and Videos to load in the Gallery, If Images found, then the gallery is loaded.
             * Else the Toggle button is hidden and the video div is loaded.
             */

            !p.images ?

                /**
                 * If No Images are found a markup is loaded, with NO IMAGE FOUND.
                 * Else if the images are present then the gallery of images is loaded.
                 * Else if there are videos then a function is called and displayImagesVideo value is set to true.
                 */
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

            /**
             * Video Card div markup
             */
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

/**
 * Displays the speech text if any when the video is clicked 
 * @param  {Object} props
 */
function displayFooter(props) {
    return <CardFooter className="footer" style={{ margin: '0px', minHeight: '40px' }}>
        {displaySpeech(props)}
    </CardFooter>;
}

/**
 * It loads the markup of Info Window over the marker
 */
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