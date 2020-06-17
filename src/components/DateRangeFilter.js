import React from 'react';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import { Card } from 'reactstrap';

function DateRangeFilter(props) {
    return (
        <Card style={{ padding: 4, width: '26.8vw', fontSize: 0.013 * window.innerWidth }}>
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