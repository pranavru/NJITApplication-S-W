import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Card, InputGroup, InputGroupAddon, Button, InputGroupText } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faCalendar, faCode } from '@fortawesome/free-solid-svg-icons'
import { Animated } from 'react-animated-css';
import '../App.css';
import DateRangeFilter from './DateRangeFilter';
import DisplayVideoComponent from './DisplayVideoComponent';
import TimeRangeFilter from './TimeRangeFilter'


class MapFilterComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSpeech: false,
            isPerson: false,
            personName: [],
            isDate: false,
            dateValue: [new Date(this.props.DataVuzix.startDate), new Date(this.props.DataVuzix.endDate)],
            timeValue: [new Date(this.props.DataVuzix.startDate), new Date(this.props.DataVuzix.endDate)],
            disPlayVideo: false,
            videoSrc: "",
        }

        this.a = [];
        this.dateObj = {}
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeCheck = this.handleChangeCheck.bind(this);
        this.personNamesMethod = this.personNamesMethod.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        
        console.log(this.state.dateValue)
    }

    handleChange(event) {
        const { name, value } = event.target;
        // console.log({ name, value });
        this.setState({ [name]: value === "true" ? true : value === "false" ? false : value, disPlayVideo: false });

        this.dateObj = name === 'isDate' ? this.props.loadDateValues() : {}
    }

    personNamesMethod(p) {
        this.personNames = this.props.loadPersonNames(p).values()[Symbol.iterator]();
        this.a = [];
        for (let item of this.personNames) {
            this.a.push({ checked: false, name: item });
        }
        this.setState({ personName: this.a });
    }

    handleChangeDate(event) {
        this.setState({
            dateValue: [new Date(event[0]), new Date(event[1])]
        })
    }
    
    handleChangeTime(event) {
        console.log(event)
    }

    handleChangeCheck(event) {
        const { name, checked } = event.target;
        console.log({ name, checked })
        this.setState({
            [name]: checked
        })

        this.personNamesMethod(this.props.DataVuzix);
    }

    handleSubmit(event) {
        event.preventDefault();
        // console.log(this.state.personName)
        // this.setState({ personName: temp_arr_person })
        this.props.loadDataJson('/vuzixMap/video', this.state)
        this.setState({
            disPlayVideo: true, videoSrc: this.props.video
        })
    }


    render() {
        return (
            <div className="col-md-12" style={{ height: '100vh', paddingTop: '5%' }}>
                <Card style={{ padding: 4 }}>
                    <div >
                        <Label>Filters: </Label>
                        <Form onSubmit={this.handleSubmit}>
                            {/* * Speech Form * */}
                            <FormGroup>
                                <InputGroup style={{ width: '22vw', marginLeft: "5%" }}>
                                    <InputGroupAddon addonType="prepend" style={{ width: '3.1vw', backgroundColor: 'white', left: '3%' }}>
                                        <InputGroupText>
                                            <Input addon type="checkbox" name="isSpeech" value={this.state.isSpeech} aria-label="Speech" onClick={this.handleChangeCheck} />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input disabled placeholder='Speech' style={{ backgroundColor: 'white' }} />
                                    <Button><FontAwesomeIcon icon={faCode} size={"lg"} /></Button>
                                </InputGroup>
                            </FormGroup>

                            {/* * Persons Form * */}
                            <FormGroup style={{ width: '22vw', marginLeft: "5%" }}>
                                <Label style={{ width: '14vw', fontWeight: 'bold' }}>People Names</Label>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend" style={{ width: '3.1vw', left: '3%' }}>
                                        <InputGroupText>
                                            <Input addon type="checkbox" name="isPerson" value={this.state.isPerson} aria-label="Person" onClick={this.handleChangeCheck} />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input disabled placeholder='People' style={{ backgroundColor: 'white' }} />
                                    <Button style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}><FontAwesomeIcon icon={faUsers} size={"lg"} /></Button>
                                </InputGroup>

                                <Animated
                                    animationIn='fadeInUp' animationOut='fadeOut'
                                    animationInDuration={400} animationOutDuration={600}
                                    className={this.state.isPerson ? "displayBlock" : "displayNone"} style={{ marginLeft: '5%', marginTop: '3%' }} >
                                    <InputGroup>
                                        {/* <InputGroupAddon addonType="append"></InputGroupAddon> */}
                                        {this.a.map(v =>
                                            <InputGroup style={{ marginTop: '3%' }}>
                                                <InputGroupAddon addonType="prepend" style={{ width: '3.1vw', backgroundColor: 'white', left: '3%' }}>
                                                    <InputGroupText>
                                                        <Input addon type="checkbox" name="isPerson" value={v.checked} aria-label="Person" onClick={v.checked = !v.checked} />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input disabled placeholder={v.name} style={{ backgroundColor: 'white' }} />
                                            </InputGroup>
                                        )}
                                    </InputGroup>
                                </Animated>
                            </FormGroup>

                            {/* * Date Value Form * */}
                            <FormGroup>
                                <Label style={{ width: '14vw', fontWeight: 'bold' }}>Search by Date?</Label>
                                <select style={{ width: '10vw', backgroundColor: 'white' }} value={this.state.isDate} onChange={this.handleChange} name="isDate">
                                    <option value={true}>Yes</option>
                                    <option value={false}>No</option>
                                </select>

                                <Animated
                                    animationIn='fadeInUp' animationOut='fadeOut'
                                    animationInDuration={400} animationOutDuration={600}
                                    // className={this.state.isDate ? "displayBlock" : "displayNone"} 
                                    style={{ marginLeft: '5%', marginTop: "3%" }} >

                                    <InputGroup style={{ marginTop: '3%'}}>
                                        <InputGroupAddon addonType="append">
                                            <Button style={{ borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }}><FontAwesomeIcon icon={faCalendar} /></Button>
                                        </InputGroupAddon>
                                        <Card style={{ padding: 4, width: '22.5vw', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
                                            <DateRangeFilter handleChangeDate={this.handleChangeDate.bind(this)} dateValue={this.state.dateValue} />
                                        </Card>
                                    </InputGroup>
                                    <InputGroup style={{ marginTop: '3%'}}>
                                        <InputGroupAddon addonType="append">
                                            <Button style={{ borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }}><FontAwesomeIcon icon={faCalendar} /></Button>
                                        </InputGroupAddon>
                                        <Card style={{ padding: 4, width: '22.5vw', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
                                            <TimeRangeFilter handleChangeTime={this.handleChangeTime.bind(this)} timeValue={this.state.timeValue} />
                                        </Card>
                                    </InputGroup>
                                </Animated>
                            </FormGroup>

                            <Input type="submit" value="Submit" />
                        </Form>
                    </div>
                </Card>
                {this.props.DataVuzix !== undefined ?
                    <DisplayVideoComponent videoSrc={this.props.video} disPlayVideo={this.state.disPlayVideo} />
                    : <div></div>
                }
            </div>
        );
    }
}

export default MapFilterComponent;