import React from 'react';
import { Card, CardText, CardSubtitle, CardImg } from 'reactstrap';
import './MarkerPlaceDetailComponent.css';

const dateStringVal = (p) => {
    const dateTimeFormat = new Intl.DateTimeFormat('en-us', { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: false })
    const [{ value: month }, , { value: day }, , { value: year }, , { value: hour }, , { value: minute }] = dateTimeFormat.formatToParts(p)

    return `${month} ${day}, ${year} ${hour}:${minute}`;
}

function MarkerPLaceDetailComponent(props) {
    return (
        <>
            {props.data.vuzixMap.map((p) =>
                <Card style={{ width: '19vw', marginTop: '2%', padding: '4px' }} key={p.id}
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
                                                <td><CardText className="locationText">Loc: {props.mapAddress.get(`${p.lat.toFixed(3)}:${p.long.toFixed(3)}`)} </CardText></td>
                                            </tr>
                                            {p.speech !== "" ? <tr>
                                                <td><CardSubtitle className="speechText"><q>{p.speech}</q></CardSubtitle></td>
                                            </tr> : <></>}
                                            {p.person_names.length > 0 ? <tr>
                                                <td>
                                                    <CardSubtitle className="speechTextPerson">
                                                        <i> &nbsp;&nbsp;&nbsp;&nbsp;--
                                        {p.person_names.map(pn => pn.person_name)}
                                                        </i>
                                                    </CardSubtitle>
                                                </td>
                                            </tr> : <></>}
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