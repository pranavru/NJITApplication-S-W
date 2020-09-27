import React from 'react';
import { Card } from 'reactstrap';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';

import RangeSlider from './RangeFilter/RangeSlider';

import "./DateRangeFilter.css";

const DateRangeFilter = (props) => {
    const multipleHours = 3, hours = 1000 * 60 * 30 * 2 * multipleHours;
    const { startDate, endDate, mapDateRange } = props.mapFilter.mapFilter;

    const handleChangeDate = (event) => {
        let startDate = new Date(event[0]).getTime();
        let endDate = new Date(event[1]).getTime();
        props.handleDateChange(startDate, endDate)
    }

    const onChange = ([ms, ms1]) => {
        props.editMapFilter("mapDateRange", { type: "onChange", value: [ms, ms1] }, props.mapFilter);
        props.handleSubmit();
    }

    const onUpdate = ([ms, ms1]) => props.editMapFilter("mapDateRange", { type: "update", value: [ms, ms1] }, props.mapFilter);

    const dateRangeProps = {
        onChange: handleChangeDate,
        value: mapDateRange.values.map(m => new Date(m)),
        name: "dateValue",
        minDate: new Date(startDate),
        maxDate: new Date(endDate),
        required: true,
        clearIcon: null,
        format: window.innerWidth > 768 ? "MM/dd/yy" : "MMM dd",
        className: "dateCSS"
    };
    const rangeSliderProps = {
        DataVuzix: props.DataVuzix,
        multipleHours: multipleHours,
        hours: hours,
        mapFilter: props.mapFilter.mapFilter,
        onChange: onChange,
        onUpdate: onUpdate,
    };
    
    return (
        <Card className="dateRangeCard" style={{ border: '0px' }} >
            <div className="dateRange">
                <DateRangePicker {...dateRangeProps} />
            </div>
            {mapDateRange.updated[0] === mapDateRange.updated[1] ? <></> : <div className="rangeSliderDiv">
                <RangeSlider {...rangeSliderProps} />
            </div>}
        </Card >
    );

}

export default DateRangeFilter;