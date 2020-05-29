import React from 'react';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import { Card } from 'reactstrap';

function DateRangeFilter(props) {
    // const [value, props.handleChange] = useState([new Date(), props.dateVal.endDate]);
    return (
        <Card style={{ padding: 4, width: '26.2vw' }}>
            <DateTimeRangePicker
                onChange={props.handleChangeDate}
                value={props.dateValue}
                name="dateValue"
                // autoFocus
                // isOpen
                minDate={props.dateValue[0]}
                maxDate={props.dateValue[1]}
                // rangeDivider=" to "
                required
                format="y/MM/dd HH:mm"
                clearIcon={null}
            />

        </Card>
    );
}

export default DateRangeFilter;