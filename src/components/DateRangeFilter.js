import React from 'react';
import DateRangeTimePicker from '@wojtekmaj/react-datetimerange-picker';
import { Card } from 'reactstrap';

function DateRangeFilter(props) {
    // const [value, props.handleChange] = useState([new Date(), props.dateVal.endDate]);

    return (
        <Card>
            <DateRangeTimePicker
                onChange={props.handleChangeDate}
                value={props.dateValue}
                name="dateValue"
                autoFocus
                isOpen
                rangeDivider='to'
            />
        </Card>
    );
}

export default DateRangeFilter;