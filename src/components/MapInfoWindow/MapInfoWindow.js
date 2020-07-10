import React from 'react';
import { Card, CardText, CardTitle, CardSubtitle, CardHeader, CardFooter } from 'reactstrap';
import "./MapInfoWindow.css";

function displayWindowHeader(props) {
    const d = new Date(props.point.created);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return (
        <>
            <CardHeader>
                <CardTitle className="text-center" style={{ fontWeight: 'bold', fontSize: 16 }}>{props.address} <br /> {months[d.getMonth()]} {d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()}, {d.getFullYear()}  {d.getHours() < 10 ? `0${d.getHours()}` : d.getHours()}:{d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()}</CardTitle>
            </CardHeader>
            <div id="containerImg">
                <img src={props.baseURL + props.point.imageFile} alt={props.point.id} id="theImage" />
            </div>
        </>)

}
function displayBody(props) {
    return props.point.speech !== "" ?
        <CardFooter style={{ paddingBottom: 15, paddingTop: 25 }}>
            <CardSubtitle style={{ fontWeight: 'bold', fontSize: 14 }}><i><q>{props.point.speech}</q></i></CardSubtitle>
        </CardFooter> : <div></div>
};

function displayFooter(props) {
    return props.point.person_names.length !== 0 ?
        <>
            <hr />
            <CardText>
                <div className="row">
                    {props.point.person_names.map(person =>
                        <div className="col-md-4" style={{ fontWeight: 'normal', fontSize: 12, border: 0, marginLeft: "2%" }} ><p>{'\u2022'} {person.person_name}</p> </div>
                    )}
                </div>
            </CardText>
        </> : <div></div>

}

function MapInfoWindow(props) {
    return (
        <Card>
            {displayWindowHeader(props)}
            {displayBody(props)}
            {displayFooter(props)}
        </Card>
    )
}

export default MapInfoWindow;

/* <CardHeader>
            <CardTitle style={{ fontWeight: 'bold', fontSize: 16 }}>Vizux ID: {props.point.id} </CardTitle>
            <CardSubtitle style={{ fontWeight: 'bold', fontSize: 12 }}>Country Location: {props.point.country}</CardSubtitle>
            <CardImg top src={'/images (1).jpeg'} alt={props.point.id} style={{ width: 50, height: 50, borderRadius: 30, position: 'absolute', left: 300, top: 8 }} />
        </CardHeader>; */