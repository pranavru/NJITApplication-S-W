import React from 'react';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import { Card } from 'reactstrap';

function DateRangeFilter(props) {
    // const [value, props.handleChange] = useState([new Date(), props.dateVal.endDate]);
    return (
        <Card>
            <DateRangePicker
                onChange={props.handleChangeDate}
                value={[new Date, new Date]}
                name="dateValue"
                autoFocus
                isOpen
                minDate={props.dateValue[0]}
                maxDate={props.dateValue[1]}
                rangeDivider=" to "
                required
                format="y/MM/dd"
                clearIcon={null}
            />

        </Card>
    );
}

export default DateRangeFilter;