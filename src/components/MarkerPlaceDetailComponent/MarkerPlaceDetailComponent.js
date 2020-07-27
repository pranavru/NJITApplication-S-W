import React from 'react';
import { Card, CardText, CardImg } from 'reactstrap';
import './MarkerPlaceDetailComponent.css';
import '../../App.css';

const dateStringVal = (p) => {
    const dateTimeFormat = new Intl.DateTimeFormat('en-us', { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false })
    const [{ value: month }, , { value: day }, , { value: year }, , { value: hour }, , { value: minute }, , { value: second }] = dateTimeFormat.formatToParts(p)

    return `${month} ${day}, ${year} ${hour}:${minute}:${second}`;
}

function MarkerPLaceDetailComponent(props) {
    const { mapMarkers } = props.mapReference;
    return (
        <>
            {mapMarkers.length <= 0 ?
                <div className="emptyDivDisplayInfo">
                    <img src="/mapImage.png" alt={""} width="85%" height="17.5%" className="emptyDivImage" />
                    <p className="emptyDivText">NO EVENTS TO DISPLAY !!!</p>
                    <p className="emptyDivText">PLEASE PAN TO DIFFERENT AREA</p>
                </div> :
                mapMarkers.map((p) =>
                    <Card
                        className="container"
                        style={{ width: '21vw', marginTop: '2%' }} key={p.id}
                        onMouseOver={() => props.animateMapMarker(props.mapReference, p)}
                        onMouseOut={() => props.animateMapMarker(props.mapReference, null)}
                    >

                        <div className="row">
                            <p className="dateFieldCard">{dateStringVal(new Date(p.created))}</p>
                            <div className="col-sm-5 displayImage">
                                <CardImg src={props.baseURL + p.imageFile} alt={p.id} className="cardImage" />
                            </div>
                            <div className="col-sm-7 displayText">
                                <table>
                                    <thead>
                                        <tr>
                                            <td>
                                                <CardText className="locationText">{props.mapAddress.get(`${p.lat.toFixed(3)}:${p.long.toFixed(3)}`).length === 0 ? `Location Unavailable` : props.mapAddress.get(`${p.lat.toFixed(3)}:${p.long.toFixed(3)}`)} </CardText>
                                            </td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {p.speech !== "" ?
                                            <tr>
                                                <td style={{ margin: '2%' }}><CardText className="speechText"><q>{p.speech}</q></CardText></td>
                                            </tr> : <></>
                                        }
                                        {p.person_names.length > 0 ?
                                            <tr>
                                                <td>
                                                    <CardText className="speechTextPerson"><img src="iconmonstr-user-1.svg" className="iconImg" alt="Person" />{p.person_names.map(pn => pn.person_name.toUpperCase())} </CardText>
                                                </td>
                                            </tr> : <></>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </Card>
                )
            }
        </>
    );
}

export default MarkerPLaceDetailComponent;


// <table>
// <tbody>
//     <tr>
//         <td>
//             <CardImg src={props.baseURL + p.imageFile} alt={p.id} className="cardImage" />
//         </td>
//         <td>
//             <p className="dateFieldCard">{dateStringVal(new Date(p.created))}</p>
//             <table>
//                 <thead>
//                     <tr>
//                         <td>
//                             <CardText className="locationText">{props.mapAddress.get(`${p.lat.toFixed(3)}:${p.long.toFixed(3)}`).length === 0 ? `Location Unavailable` : props.mapAddress.get(`${p.lat.toFixed(3)}:${p.long.toFixed(3)}`)} </CardText>
//                         </td>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {p.speech !== "" ?
//                         <tr>
//                             <td style={{ margin: '2%' }}><CardText className="speechText"><q>{p.speech}</q></CardText></td>
//                         </tr> : <></>
//                     }
//                     {p.person_names.length > 0 ?
//                         <tr>
//                             <td>
//                                 <CardText className="speechTextPerson"><img src="iconmonstr-user-1.svg" className="iconImg" alt="Person" />{p.person_names.map(pn => pn.person_name.toUpperCase())} </CardText>
//                             </td>
//                         </tr> : <></>
//                     }
//                 </tbody>
//             </table>
//         </td>
//     </tr>
// </tbody>
// </table>