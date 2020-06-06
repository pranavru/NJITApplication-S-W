import React from 'react';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import { Card } from 'reactstrap';

function DateRangeFilter(props) {
    // const [value, props.handleChange] = useState([new Date(), props.dateVal.endDate]);
    return (
        <Card style={{ padding: 4, width: '26.6vw' }}>
            <DateTimeRangePicker
                onChange={props.handleChangeDate}
                value={props.dateValue}
                name="dateValue"
                minDate={props.startDate}
                maxDate={props.endDate}
                required
                format="y/MM/dd HH:mm"
                clearIcon={null}
                disableClock={true}
            />

        </Card>
    );
}

export default DateRangeFilter;