import React from 'react';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import { Card } from 'reactstrap';
import RangeSlider from './RangeFilter/RangeSlider';
import "./DateRangeFilter.css";

const multipleHours = 3;
class DateRangeFilter extends React.Component {

    constructor(props) {
        super(props);
        const range = [
            +this.setDateValueinMilliSeconds(props.DataVuzix.startDate),
            +this.setDateValueinMilliSeconds(props.DataVuzix.endDate)
        ];
        this.state = {
            hours: 1000 * 60 * 30 * 2 * multipleHours,
            updated: range,
            domain: range,
            values: range,
            dateData: [],
            displayChart: false,
            multipleHours: 3
        };
    }

    handleChangeDate(event) {
        let startDate = this.props.dateValue[0];
        let endDate = this.props.dateValue[1];
        startDate = new Date(event[0].getFullYear(), event[0].getMonth(), event[0].getDate());
        endDate = new Date(event[1].getFullYear(), event[1].getMonth(), event[1].getDate());
        this.dateValuesData(startDate, endDate);
        this.props.handleDateChange(startDate, endDate)
    }

    componentDidMount = () => this.dateValuesData(new Date(this.state.domain[0]), new Date(this.state.domain[1]))
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
        // if (this.props.multipleHours === 6) {
        //     hours -= hours % 6 === 1 ? 1 : hours % 6 === 2 ? 2 : hours % 6 === 3 ? 3 : hours % 6 === 4 ? 4 : hours % 6 === 5 ? 5 : 0;
        // } else if (this.props.multipleHours === 4) {
        //     hours -= hours % 4 === 1 ? 1 : hours % 4 === 2 ? 2 : hours % 4 === 3 ? 3 : 0;
        // } else if (this.props.multipleHours === 3) {
        hours -= hours % 3 === 1 ? 1 : hours % 3 === 2 ? 2 : 0;
        // } else if (this.props.multipleHours === 2) {
        //     hours -= hours % 2 === 1 ? 1 : 0;
        // }

        return new Date(`${month} ${day}, ${year} ${hours}:00:00`).getTime();
    }

    getDateFromMilliSeconds = (ms) => new Date(ms);

    onChange = ([ms, ms1]) => this.setState({ values: [ms, ms1] })

    onUpdate = ([ms, ms1]) => this.setState({ updated: [ms, ms1] })

    onUpdateData = dateData => this.setState({ dateData: dateData });

    updateDomain = (event) => {
        const range = [
            +new Date(event[0]).getTime(),
            +new Date(event[1]).getTime() + 300
        ];
        this.setState({
            updated: range,
            domain: range,
            values: range,
        })
        this.handleChangeDate(event)
    }

    render() {
        return (
            <Card className="dateRangeCard">
                <div className="dateRange">
                    <DateRangePicker
                        onChange={this.updateDomain}
                        value={this.state.values}
                        name="dateValue"
                        minDate={new Date(this.props.DataVuzix.startDate)}
                        maxDate={new Date(this.props.DataVuzix.endDate)}
                        required
                        clearIcon={null}
                        rangeDivider="to  "
                    />
                </div>
                <div className="rangeSliderDiv">
                    <RangeSlider
                        DataVuzix={this.props.DataVuzix}
                        dateValue={this.props.dateValue}
                        multipleHours={multipleHours}
                        state={this.state}
                        dateValuesData={this.dateValuesData.bind(this)}
                        onChange={this.onChange.bind(this)}
                        onUpdate={this.onUpdate.bind(this)}
                    />
                </div>
            </Card>
        );
    }
}

export default DateRangeFilter;