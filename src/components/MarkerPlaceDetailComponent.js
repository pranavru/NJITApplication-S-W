import React from 'react';
import { Card, CardTitle, CardSubtitle, CardImg, Button } from 'reactstrap';

function MarkerPLaceDetailComponent(props) {
    return (
        <>
            {props.data.vuzixMap.map((point) =>
                <Card style={{ width: '20vw', height: '16vh', marginTop: '5%', padding: 5, }} key={point.id}>
                    <table>
                        <tr>
                            <td>
                                <CardImg top src={'/images (1).jpeg'} alt={point.id} style={{ width: 125, height: '14vh', top: 8, borderRadius: 4 }} />
                            </td>
                            <td>
                                <table>
                                    <tr>
                                        <td><CardTitle style={{ fontWeight: 'bold', fontSize: 10 }}>ID: {point.id} </CardTitle></td>
                                    </tr>
                                    <tr>
                                        <td><CardSubtitle style={{ fontWeight: 'bold', fontSize: 8 }}>Country Location: {point.country}</CardSubtitle></td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </Card>
            )}
        </>
    );
}

export default MarkerPLaceDetailComponent;