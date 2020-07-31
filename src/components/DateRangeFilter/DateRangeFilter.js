import React from 'react';
import { Card } from 'reactstrap';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';

import RangeSlider from './RangeFilter/RangeSlider';

import "./DateRangeFilter.css";

const multipleHours = 3, hours = 1000 * 60 * 30 * 2 * multipleHours;
class DateRangeFilter extends React.Component {

    handleChangeDate = (event) => {
        let startDate = new Date(event[0]).getTime();
        let endDate = new Date(event[1]).getTime();
        this.props.handleDateChange(startDate, endDate)
    }

    onChange = ([ms, ms1]) => {
        this.props.editMapFilter("mapDateRange", { type: "onChange", value: [ms, ms1] }, this.props.mapFilter);
        this.props.handleSubmit();
    }

    onUpdate = ([ms, ms1]) => this.props.editMapFilter("mapDateRange", { type: "update", value: [ms, ms1] }, this.props.mapFilter);

    render() {
        const { startDate, endDate, mapDateRange } = this.props.mapFilter.mapFilter;
        return (
            <Card className="dateRangeCard" style={{ border: '0px' }}>
                <div className="dateRange">
                    <DateRangePicker
                        onChange={this.handleChangeDate}
                        value={mapDateRange.values.map(m => new Date(m))}
                        name="dateValue"
                        minDate={new Date(startDate)}
                        maxDate={new Date(endDate)}
                        required
                        clearIcon={null}
                        rangeDivider="to  "
                    />
                </div>
                <div className="rangeSliderDiv">
                    <RangeSlider
                        DataVuzix={this.props.DataVuzix}
                        multipleHours={multipleHours}
                        hours={hours}
                        mapFilter={this.props.mapFilter.mapFilter}
                        onChange={this.onChange.bind(this)}
                        onUpdate={this.onUpdate.bind(this)}
                    />
                </div>
            </Card>
        );
    }
}

export default DateRangeFilter;