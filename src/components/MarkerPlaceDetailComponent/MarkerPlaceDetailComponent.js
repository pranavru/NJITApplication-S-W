import React from 'react';
import { Card, CardText, CardSubtitle, CardImg } from 'reactstrap';
import './MarkerPlaceDetailComponent.css';
import '../../App.css';

const dateStringVal = (p) => {
    const dateTimeFormat = new Intl.DateTimeFormat('en-us', { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false })
    const [{ value: month }, , { value: day }, , { value: year }, , { value: hour }, , { value: minute }, , { value: second }] = dateTimeFormat.formatToParts(p)

    return `${month} ${day}, ${year} ${hour}:${minute}:${second}`;
}

function MarkerPLaceDetailComponent(props) {
    return (
        <>
            {props.data === [] ? <div className="loader" style={{ width: "19vw", position: "relative" }}></div> :
                props.data.map((p) =>
                    <Card style={{ width: '19vw', marginTop: '2%', padding: '2px' }} key={p.id}
                        onMouseOver={() => window.setTimeout(props.AnimateMarker(p), 1000)}
                        onMouseOut={() => props.AnimateMarker(null)}
                    >
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <CardImg src={props.baseURL + p.imageFile} alt={p.id} className="cardImage" />
                                    </td>
                                    <td>
                                        <p className="dateFieldCard">{dateStringVal(new Date(p.created))}</p>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <td>
                                                        <CardText className="locationText">{props.mapAddress.get(`${p.lat.toFixed(3)}:${p.long.toFixed(3)}`).length === 0 ? `Location Unavailable` : props.mapAddress.get(`${p.lat.toFixed(3)}:${p.long.toFixed(3)}`)} </CardText>
                                                    </td>
                                                </tr>
                                                {p.speech !== "" ?
                                                    <tr>
                                                        <td><CardSubtitle className="speechText"><q>{p.speech}</q></CardSubtitle></td>
                                                    </tr> : <></>
                                                }
                                                {p.person_names.length > 0 ?
                                                    <tr>
                                                        <td>
                                                            <CardText className="speechTextPerson"><img src="iconmonstr-user-1.svg" className="iconImg" alt="Person" />{p.person_names.map(pn => pn.person_name.toUpperCase())} </CardText>
                                                        </td>
                                                    </tr> : <></>
                                                }
                                            </thead>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Card>
                )
            }
        </>
    );
}

export default MarkerPLaceDetailComponent;