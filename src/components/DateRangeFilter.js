import React from 'react';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import { Card } from 'reactstrap';
import RangeSlider from './RangeFilter/RangeSlider';

function DateRangeFilter(props) {
    // console.log("Date Range filter render", props);
    return (
        <Card style={{ padding: 4 }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <DateRangePicker
                    onChange={props.handleChangeDate}
                    value={props.dateValue}
                    name="dateValue"
                    minDate={props.startDate}
                    maxDate={props.endDate}
                    required
                />
            </div>
            <div style={{ padding: 4, height: 40, border: "none", marginTop: '3%' }}>
                <RangeSlider DataVuzix={props.DataVuzix} dateValue={props.dateValue} style={{ height: 40 }} handleChangeTime={props.handleChangeTime} createdAt={props.createdAt} data={props.data}/>
            </div>
        </Card>
    );
}

export default DateRangeFilter;