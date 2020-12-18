import React from 'react';
import { Card } from 'reactstrap';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';

import RangeSlider from './RangeFilter/RangeSlider';

import "./DateRangeFilter.css";

const DateRangeFilter = (props) => {
    /**
     * multipleHours determines the interval of number of hours for data accumulation.
     */
    const multipleHours = 3, hours = 1000 * 60 * 30 * 2 * multipleHours;
    const { startDate, endDate, mapDateRange } = props.mapFilter.mapFilter;

    /**
     * It handles change in events date range using the Calender props.
     * @param  {} event
     */
    const handleChangeDate = (event) => {
        let startDate = new Date(event[0]).getTime();
        let endDate = new Date(event[1]).getTime();
        props.handleDateChange(startDate, endDate)
    }

    /**
     * This method is called when the user has already updated with the date range values (onMouseUp event)
     * @param  {Number} [ms                     //mapFilterReference.mapDateRange.startDate
     * @param  {Number} ms1]                    //mapFilterReference.mapDateRange.endDate
     */
    const onChange = ([ms, ms1]) => {
        props.editMapFilter("mapDateRange", { type: "onChange", value: [ms, ms1] }, props.mapFilter);
        props.handleSubmit();
    }

    /**
     * This method is called when the user is updating the date range values (onMouseDown event)
     * @param  {Number} [ms                     //mapFilterReference.mapDateRange.startDate
     * @param  {Number} ms1]                    //mapFilterReference.mapDateRange.endDate
     */
    const onUpdate = ([ms, ms1]) => props.editMapFilter("mapDateRange", { type: "update", value: [ms, ms1] }, props.mapFilter);

    const dateRangeProps = {
        onChange: handleChangeDate,
        value: mapDateRange.values.map(m => new Date(m)),
        name: "dateValue",
        minDate: new Date(startDate),
        maxDate: new Date(endDate),
        required: true,
        clearIcon: null,
        /**
         * Format the date object based on the window width 
         * If width is greater than 768 pixels then format should be MM/dd/yy : 12/12/20
         * else if width is less than that then format should be MMM dd : Dec 12
         */
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