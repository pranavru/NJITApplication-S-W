import React from 'react';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import { Card } from 'reactstrap';

function TimeRangeFilter(props) {
    // const [value, props.handleChange] = useState([new Date(), props.dateVal.endDate]);
    return (
        <Card>
            <TimeRangePicker
                onChange={props.handleChangeDate}
                value={props.dateValue}
                name="timeValue"
                // autoFocus
                // isOpen
                // minTime={props.timeValue[0]}
                // maxTime={props.timeValue[1]}
                rangeDivider=" to "
                // required
                clearIcon={null}
            />

        </Card>
    );
}

export default TimeRangeFilter;