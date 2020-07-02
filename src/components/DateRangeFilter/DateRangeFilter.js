import React from 'react';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import { Card } from 'reactstrap';
import RangeSlider from './RangeFilter/RangeSlider';
import "./DateRangeFilter.css";

function DateRangeFilter(props) {
    return (
        <Card className="dateRangeCard">
            <div className="dateRange">
                <DateRangePicker
                    onChange={props.handleChangeDate}
                    value={props.dateValue}
                    name="dateValue"
                    minDate={props.startDate}
                    maxDate={props.endDate}
                    required
                    clearIcon={null}
                    rangeDivider="to  "
                    style={{ fontSize: '12px', fontWeight: 'light', fontFamily: 'monospace' }}
                />
            </div>
            <div className="rangeSliderDiv">
                <RangeSlider
                    DataVuzix={props.DataVuzix}
                    dateValue={props.dateValue}
                    handleChangeTime={props.handleChangeTime}
                    data={props.data}
                    dateValuesData={props.dateValuesData}
                />
            </div>
        </Card>
    );
}

export default DateRangeFilter;