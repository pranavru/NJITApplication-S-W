import React from 'react';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import { Card } from 'reactstrap';
import RangeSlider from './RangeFilter/RangeSlider';
import "./DateRangeFilter.css";

const multipleHours = 3, hours = 1000 * 60 * 30 * 2 * multipleHours;
class DateRangeFilter extends React.Component {

    handleChangeDate = (event) => {
        let startDate = new Date(event[0]).getTime();
        let endDate = new Date(event[1]).getTime();
        this.props.handleDateChange(startDate, endDate)
    }

    onChange = ([ms, ms1]) => this.props.editMapFilter("mapDateRange", { type: "onChange", value: [ms, ms1] }, this.props.mapFilter)

    onUpdate = ([ms, ms1]) => this.props.editMapFilter("mapDateRange", { type: "update", value: [ms, ms1] }, this.props.mapFilter)

    render() {
        const { startDate, endDate, mapDateRange } = this.props.mapFilter.mapFilter;
        return (
            <Card className="dateRangeCard">
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

// if (this.props.multipleHours === 6) {
        //     hours -= hours % 6 === 1 ? 1 : hours % 6 === 2 ? 2 : hours % 6 === 3 ? 3 : hours % 6 === 4 ? 4 : hours % 6 === 5 ? 5 : 0;
        // } else if (this.props.multipleHours === 4) {
        //     hours -= hours % 4 === 1 ? 1 : hours % 4 === 2 ? 2 : hours % 4 === 3 ? 3 : 0;
        // } else if (this.props.multipleHours === 3) {
        // } else if (this.props.multipleHours === 2) {
        //     hours -= hours % 2 === 1 ? 1 : 0;
        // }