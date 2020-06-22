import React from 'react';
import DateRangePicker from '@wojtekmaj/react-datetimerange-picker';
import { Card } from 'reactstrap';
import RangeSlider from './RangeFilter/RangeSlider';

function DateRangeFilter(props) {
    return (
        <Card style={{ padding: 4, fontSize: 0.013 * window.innerWidth }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
                <DateRangePicker
                    onChange={props.handleChangeDate}
                    value={props.dateValue}
                    name="dateValue"
                    minDate={props.startDate}
                    maxDate={props.endDate}
                    required
                    format="y/MM/dd"
                />
            </div>
                <div style={{ padding: 4, height: 40, border: "none", marginTop: '3%' }}>
                    <RangeSlider DataVuzix={props.DataVuzix} style={{ height: 40 }} />
                </div>
        </Card>
    );
}

export default DateRangeFilter;