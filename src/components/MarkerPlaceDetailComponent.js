import React from 'react';
import { Card, CardTitle, CardSubtitle, CardImg } from 'reactstrap';

function MarkerPLaceDetailComponent(props) {

    return (
        <>
            {props.data.vuzixMap.map((point) =>
                <Card style={{ width: '20vw', marginTop: '5%', padding: 5, }} key={point.id}
                    // onMouseOver={() => alert(point.id)}
                >
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <CardImg top src={'/images (1).jpeg'} alt={point.id} style={{ width: 105, top: 8, borderRadius: 4 }} />
                                </td>
                                <td>
                                    <table>
                                        <thead>
                                            <tr>
                                                <td><CardTitle style={{ fontWeight: 'bold', fontSize: 8 }}>ID: {point.id}<br />Loc: {point.country}</CardTitle></td>
                                            </tr>
                                        </thead>
                                    </table>
                                    {point.speech !== "" ? <tr>
                                        <td><CardSubtitle style={{ fontWeight: 'bold', fontSize: 8, paddingTop: 5 }}><q><i>{point.speech}</i></q></CardSubtitle></td>
                                    </tr> : <></>}
                                    {point.person_names.length > 0 ? <tr>
                                        <td>
                                            <CardSubtitle style={{ fontWeight: 'bold', fontSize: 8, marginTop: '1%' }}>
                                                <i> &nbsp;&nbsp;&nbsp;&nbsp;--
                                        {point.person_names.map(p => p.person_name)}
                                                </i>
                                            </CardSubtitle>
                                        </td>
                                    </tr> : <></>}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Card>
            )}
        </>
    );
}

export default MarkerPLaceDetailComponent;