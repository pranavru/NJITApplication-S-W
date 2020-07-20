import React from 'react';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import { Card } from 'reactstrap';
import RangeSlider from './RangeFilter/RangeSlider';
import "./DateRangeFilter.css";

const multipleHours = 3, hours = 1000 * 60 * 30 * 2 * multipleHours;
class DateRangeFilter extends React.Component {

    constructor(props) {
        super(props);
    }

    handleChangeDate(event) {
        let startDate = this.props.mapFilter.dateValues[0];
        let endDate = this.props.mapFilter.dateValues[1];
        startDate = new Date(event[0]).getTime();
        endDate = new Date(event[1]).getTime();
        this.props.handleDateChange(startDate, endDate)
    }

    componentDidMount = () => { }

    dateValuesData = (start, end) => {
        let data = [];
        this.props.DataVuzix.vuzixMap.map(m => {
            const date = this.setDateValueinMilliSeconds(m.created);
            if (start.getTime() <= date && date <= end.getTime()) {
                data.push(date);
            }
            return null;
        })
        data.sort();
        this.onUpdateData(data);
    }

    setDateValueinMilliSeconds = (dateValue) => {
        let dateVal = new Date(dateValue);
        const dateTimeFormat = new Intl.DateTimeFormat('en-us', { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false })
        let [{ value: month }, , { value: day }, , { value: year }, , { value: hours }] = dateTimeFormat.formatToParts(dateVal);
        hours -= hours % 3 === 1 ? 1 : hours % 3 === 2 ? 2 : 0;

        return new Date(`${month} ${day}, ${year} ${hours}:00:00`).getTime();
    }

    getDateFromMilliSeconds = (ms) => new Date(ms);

    onChange = ([ms, ms1]) => this.props.editMapFilter("mapDateRange", { type: "onChange", value: [ms, ms1] }, this.props.mapFilter)

    onUpdate = ([ms, ms1]) => this.props.editMapFilter("mapDateRange", { type: "update", value: [ms, ms1] }, this.props.mapFilter)

    onUpdateData = dateData => this.setState({ dateData: dateData });

    updateDomain = (event) => this.handleChangeDate(event);

    render() {
        const { startDate, endDate, mapDateRange } = this.props.mapFilter;
        return (
            <Card className="dateRangeCard">
                <div className="dateRange">
                    <DateRangePicker
                        onChange={this.updateDomain}
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
                        mapFilter={this.props.mapFilter}
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