import React from 'react';
import { Card, CardText, CardSubtitle, CardImg } from 'reactstrap';


function MarkerPLaceDetailComponent(props) {
    return (
        <>
            {props.data.vuzixMap.map((p) =>
                <Card style={{ width: '19vw', marginTop: '5%', padding: 5, bottom : 0 }} key={p.id}
                    onMouseOver={() => window.setTimeout(props.AnimateMarker(p), 1000)}
                    onMouseOut={() => props.AnimateMarker(null)}
                >
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <CardImg top src={props.baseURL + p.imageFile} alt={p.id} style={{ top: 8, borderRadius: 4 }} />
                                </td>
                                <td>
                                    <table>
                                        <thead>
                                            <tr>
                                                <td><CardText style={{ fontWeight: 'bold', fontSize: 8, width: '12vw' }}>Loc: {props.mapAddress.get(`${p.lat.toFixed(3)}:${p.long.toFixed(3)}`)} </CardText></td>
                                            </tr>
                                            {p.speech !== "" ? <tr>
                                                <td><CardSubtitle style={{ fontWeight: 'bold', fontSize: 8, paddingTop: 5 }}><q><i>{p.speech}</i></q></CardSubtitle></td>
                                            </tr> : <></>}
                                            {p.person_names.length > 0 ? <tr>
                                                <td>
                                                    <CardSubtitle style={{ fontWeight: 'bold', fontSize: 8, marginTop: '1%' }}>
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