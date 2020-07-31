import React from 'react';
import { Card, CardText, CardImg } from 'reactstrap';

import './MarkerPlaceDetailComponent.css';
import { baseUrl } from "../../shared/baseUrl";

import { connect } from 'react-redux';
import { updateMapAddressOnExpiry, animateMapMarker } from '../../redux/ActionCreators'

const dateStringVal = (p) => {
    const dateTimeFormat = new Intl.DateTimeFormat('en-us', { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false })
    const [{ value: month }, , { value: day }, , { value: year }, , { value: hour }, , { value: minute }, , { value: second }] = dateTimeFormat.formatToParts(p)

    return `${month} ${day}, ${year} ${hour}:${minute}:${second}`;
}

const mapStateToProps = (state) => { return { MapMarkersData: state.mapMarkersData, Addresses: state.addresses } }

const mapDispatchToProps = (dispatch) => ({
    animateMapMarker: (data, marker) => dispatch(animateMapMarker(data, marker)),
    updateMapAddressOnExpiry: () => dispatch(updateMapAddressOnExpiry())
})


function MarkerPLaceDetailComponent(props) {
    const { mapMarkers } = props.MapMarkersData.mapMarkersData;
    const { address } = props.Addresses.addresses;
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
                        onMouseOver={() => props.animateMapMarker(props.MapMarkersData.mapMarkersData, p)}
                        onMouseOut={() => props.animateMapMarker(props.MapMarkersData.mapMarkersData, null)}
                    >

                        <div className="row">
                            <p className="dateFieldCard">{dateStringVal(new Date(p.created))}</p>
                            <div className="col-sm-5 displayImage">
                                <CardImg src={baseUrl + p.imageFile} alt={p.id} className="cardImage" />
                            </div>
                            <div className="col-sm-7 displayText">
                                <table>
                                    <thead>
                                        <tr>
                                            <td>
                                                <CardText className="locationText">{address.get(`${p.lat.toFixed(3)}:${p.long.toFixed(3)}`).length === 0 ? `Location Unavailable` : address.get(`${p.lat.toFixed(3)}:${p.long.toFixed(3)}`)} </CardText>
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
            <div><p className="endOfList">End of List</p></div>
        </>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(MarkerPLaceDetailComponent);