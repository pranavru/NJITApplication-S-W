import React from 'react';
import { Card, CardText, CardImg } from 'reactstrap';

import './MarkerPlaceDetailComponent.css';

import { connect } from 'react-redux';
import { updateMapAddressOnExpiry, animateMapMarker } from '../../redux/ActionCreators'
import { LoadingDivSpinner } from '../MainComponent/LoadingDivSpinner';

/**
 * Converts ISODate String and returns date in the format of "MM DDD, YYYY HH:mm:ss"
 * @param  {String} p
 */
const dateStringVal = (p) => {
    const dateTimeFormat = new Intl.DateTimeFormat('en-us', { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false })
    const [{ value: month }, , { value: day }, , { value: year }, , { value: hour }, , { value: minute }, , { value: second }] = dateTimeFormat.formatToParts(p)

    return `${month} ${day}, ${year} ${hour}:${minute}:${second}`;
}

const mapStateToProps = (state) => { return { DataVuzix: state.dataVuzix, MapMarkersData: state.mapMarkersData, Addresses: state.addresses } }

const mapDispatchToProps = (dispatch) => ({
    animateMapMarker: (data, marker) => dispatch(animateMapMarker(data, marker)),
    updateMapAddressOnExpiry: () => dispatch(updateMapAddressOnExpiry())
})


function MarkerPLaceDetailComponent(props) {
    const { mapMarkers } = props.MapMarkersData.mapMarkersData;
    const { address } = props.Addresses.addresses;
    const { dataVuzix } = props.DataVuzix;
    const { REACT_APP_BASE_URL } = process.env;

    if (props.MapMarkersData.isLoading) {
        return <LoadingDivSpinner />
    }
    return (
        <>
            {mapMarkers.length <= 0 ?
                /**
                 * Displays an image card markup of "No Data Found" when no data is there to display.
                 */
                <div className="emptyDivDisplayInfo">
                    <img src="/mapImage.png" alt={""} width="85%" height="17.5%" className="emptyDivImage" />
                    <p className="emptyDivText">NO EVENTS TO DISPLAY !!!</p>
                    <p className="emptyDivText">PLEASE PAN TO DIFFERENT AREA</p>
                </div> :
                /**
                 * Displays cards of different events happening in the vicinity of the user.
                 */
                <>
                    <div className="containerDiv">
                        {mapMarkers.map((p) =>
                            <Card
                                className="container shadow-sm bg-white"
                                style={{ width: '100%', marginTop: '3%', minHeight: '120px' }} key={p.id}
                                onMouseOver={() => props.animateMapMarker(props.MapMarkersData.mapMarkersData, p)}
                                onMouseOut={() => props.animateMapMarker(props.MapMarkersData.mapMarkersData, null)}
                            >

                                <div className="row">
                                    <p className="dateFieldCard">{dateStringVal(new Date(p.created))}</p>
                                    <div className="col-md-5 col-12 displayImage">
                                        {p.image === '' ? <div className="detailsButton"><img src='/mediaControl.svg' className="detailsPlayButton" alt="Load the svg" /></div> : <></>}
                                        <CardImg src={REACT_APP_BASE_URL + (p.image !== "" ? p.image : p.thumbnail)} alt={p.id} className="cardImage" />
                                    </div>
                                    <div className="col-md-7 col-12 displayText">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <td>
                                                        <CardText className="locationText">{address.get(`${p.lat.toFixed(3)}:${p.long.toFixed(3)}`).length === 0 ? `Location Unavailable` : address.get(`${p.lat.toFixed(3)}:${p.long.toFixed(3)}`)} </CardText>
                                                    </td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {p.all_speech.length > 0 ?
                                                    <tr>
                                                        <td style={{ margin: '2%' }}><CardText className="speechText"><q>{p.all_speech[0].speech}</q></CardText></td>
                                                    </tr> : <></>
                                                }
                                                {p.person_names.length > 0 ?
                                                    <tr>
                                                        <td>
                                                            <div className="speechTextPerson">
                                                                {p.person_names.map((pn, key) =>
                                                                    <div className="peopleCSS" key={key}>
                                                                        <img src="iconmonstr-user-1.svg" className="iconImg" alt="Per" /> {pn.person_name.toUpperCase()}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr> : <></>
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </Card>
                        )}
                    </div>
                    {/** 
                     * Markup to indicate End of list.
                     */}
                    <div>
                        <p className="endOfList">End of List</p>
                        <p className="endOfList">Displaying {mapMarkers.length} of {dataVuzix.vuzixMap.length} </p>
                    </div>
                </>
            }
        </>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(MarkerPLaceDetailComponent);