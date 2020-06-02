import React from 'react';
import { Card, CardText, CardSubtitle, CardImg } from 'reactstrap';

function MarkerPLaceDetailComponent(props) {

    return (
        <>
            {/* {console.log(props.data)} */}
            {props.data.map((p) =>
                <>
                    {/* {props.ReverseGeoCodeAPI(point.lat, point.long)} */}
                    <Card style={{ width: '20vw', marginTop: '5%', padding: 5, }} key={p.data.id}
                        onMouseOver={() => props.AnimateMarker(p.data)}
                        onMouseOut={() => props.AnimateMarker(null)}
                    >
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <CardImg top src={'/images (1).jpeg'} alt={p.data.id} style={{ width: 85, height: '55%', top: 8, borderRadius: 4 }} />
                                    </td>
                                    <td>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <td><CardText style={{ fontWeight: 'bold', fontSize: 8, width: '12vw' }}>Loc: {p.address}</CardText></td>
                                                </tr>
                                            </thead>
                                        </table>
                                        {p.data.speech !== "" ? <tr>
                                            <td><CardSubtitle style={{ fontWeight: 'bold', fontSize: 8, paddingTop: 5 }}><q><i>{p.data.speech}</i></q></CardSubtitle></td>
                                        </tr> : <></>}
                                        {p.data.person_names.length > 0 ? <tr>
                                            <td>
                                                <CardSubtitle style={{ fontWeight: 'bold', fontSize: 8, marginTop: '1%' }}>
                                                    <i> &nbsp;&nbsp;&nbsp;&nbsp;--
                                        {p.data.person_names.map(pn => pn.person_name)}
                                                    </i>
                                                </CardSubtitle>
                                            </td>
                                        </tr> : <></>}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Card>
                </>
            )}
        </>
    );
}

export default MarkerPLaceDetailComponent;