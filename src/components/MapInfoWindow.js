import React from 'react';
import { Card, CardImg, CardBody, CardTitle, CardSubtitle, CardHeader, CardFooter, CardText } from 'reactstrap';

function displayWindowHeader(props) {
    return (
        <>
            <CardHeader>
                {/* <CardTitle style={{ fontWeight: 'bold', fontSize: 16 }}>ID: {props.point.id} </CardTitle> */}
                <CardTitle style={{ fontWeight: 'bold', fontSize: 14 }}>{props.address}</CardTitle>
            </CardHeader>
            <CardImg top src={'/images (1).jpeg'} alt={props.point.id} />
        </>)

}
function displayBody(props) {
    return props.point.speech !== "" ?
        <CardFooter>
            <CardSubtitle style={{ fontWeight: 'bold', fontSize: 14 }}><i><q>{props.point.speech}</q></i></CardSubtitle>
            {/* <CardText>&nbsp;&nbsp;&nbsp;&nbsp;{props.point.speech}</CardText> */}
        </CardFooter> : <div></div>
};

function displayFooter(props) {
    return props.point.person_names.length !== 0 ?
        <CardBody>
            {/* <p style={{ fontWeight: 'bold', fontSize: 14 }} > Person Names</p> */}
            <div className="row">
                {props.point.person_names.map(person =>
                    <div className="col-md-4 col-sm-6" style={{ fontWeight: 'normal', fontSize: 12, border: 0 }} ><p>{'\u2022'} {person.person_name}</p> </div>
                )}
            </div>
        </CardBody> : <div></div>

}

function MapInfoWindow(props) {

    // console.log(props.geoLocation(props.point.lat, props.point.long))
    return (
        <div className="col-md-12" style={{ width: 325 }}>
            <Card >
                {displayWindowHeader(props)}
                {displayBody(props)}
                {displayFooter(props)}
            </Card>
        </div>
    )
}

export default MapInfoWindow;

/* <CardHeader>
            <CardTitle style={{ fontWeight: 'bold', fontSize: 16 }}>Vizux ID: {props.point.id} </CardTitle>
            <CardSubtitle style={{ fontWeight: 'bold', fontSize: 12 }}>Country Location: {props.point.country}</CardSubtitle>
            <CardImg top src={'/images (1).jpeg'} alt={props.point.id} style={{ width: 50, height: 50, borderRadius: 30, position: 'absolute', left: 300, top: 8 }} />
        </CardHeader>; */