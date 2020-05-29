import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Card, InputGroup, InputGroupAddon, Button, InputGroupText, CardText } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faCalendar, faCode, faClock } from '@fortawesome/free-solid-svg-icons'
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
            isPerson: true,
            personName: [],
            isDate: false,
            dateValue: [new Date(this.props.DataVuzix.startDate), new Date(this.props.DataVuzix.endDate)],
            disPlayVideo: false,
            videoSrc: "",
        }

        this.a = [];
        this.dateObj = {}
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeCheck = this.handleChangeCheck.bind(this);
        this.personNamesMethod = this.personNamesMethod.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);


        // console.log(new Date(`${this.state.dateValue[0].getFullYear()}/${this.state.dateValue[0].getMonth()}/${this.state.dateValue[0].getDate()}`))
    }

    componentDidMount() {
        this.personNamesMethod(this.props.DataVuzix);
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
        // const date1 = new Date(`${this.state.dateValue[0].getFullYear()}/${this.state.dateValue[0].getMonth()}/${this.state.dateValue[0].getDate()} ${this.state.dateValue[0].getHours()}:${this.state.dateValue[0].getMinutes()}:${this.state.dateValue[0].getSeconds()} ${this.state.dateValue[0].getTimezoneOffset()}`)
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
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.loadDataJson('/vuzixMap/video', this.state)
        this.setState({
            disPlayVideo: true, videoSrc: this.props.video
        })
    }


    render() {
        return (
            <div className="col-md-12" style={{ height: '98vh' }}>
                <Card style={{ padding: 4, marginTop: '4%' }}>
                    <Button disabled style={{ borderBottomRightRadius: 0, borderBottomLeftRadius: 0 }}><Label style={{ width: '30vw', fontWeight: 'bold', textAlign: 'left', top: '2%' }}>Filter</Label></Button>
                    <div style={{ marginLeft: '3%', marginTop: "3%" }}>
                        <Form onSubmit={this.handleSubmit}>
                            {/* * Speech Form * */}
                            <FormGroup>
                                <InputGroup style={{ width: '22vw', marginLeft: "5%" }}>
                                    <Input addon type="checkbox" name="isSpeech" value={this.state.isSpeech} aria-label="Speech" onClick={this.handleChangeCheck} style={{ marginTop: '3.7%' }} />
                                    <Button disabled style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, backgroundColor: 'white', color: '#000000', border: 0, fontWeight: "bold" }}>Speech</Button>
                                </InputGroup>
                            </FormGroup>

                            {/* * Persons Form * */}
                            <Label style={{ width: '14vw', fontWeight: 'bold' }}>People</Label>
                            <FormGroup >
                                <InputGroup style={{ width: '22vw', marginLeft: '5%' }}>
                                    {/* <InputGroupAddon addonType="append"></InputGroupAddon> */}
                                    {this.a.map(v =>
                                        <InputGroup>
                                            <Input addon type="checkbox" name="isPerson" value={v.checked} aria-label="Person" onClick={v.checked = !v.checked} style={{ marginTop: '3.7%' }} />
                                            <Button disabled style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, backgroundColor: 'white', color: '#000000', border: 0, fontWeight: "bold" }}>{v.name}</Button>
                                        </InputGroup>
                                    )}
                                </InputGroup>
                            </FormGroup>
                            {/* * Date Value Form * */}
                            <FormGroup>
                                <Label style={{ width: '14vw', fontWeight: 'bold' }}>Date</Label>
                                <Animated
                                    animationIn='fadeInUp' animationOut='fadeOut'
                                    animationInDuration={400} animationOutDuration={600}
                                    // className={this.state.isDate ? "displayBlock" : "displayNone"} 
                                    style={{ marginLeft: '5%', marginTop: "3%" }} >

                                    <InputGroup style={{ marginTop: '3%' }}>
                                        <InputGroupAddon addonType="append">
                                            <Button disabled style={{ borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }}><FontAwesomeIcon icon={faCalendar} /></Button>
                                        </InputGroupAddon>
                                        <Card style={{ padding: 4, width: '20vw', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
                                            <DateRangeFilter handleChangeDate={this.handleChangeDate.bind(this)} dateValue={this.state.dateValue} />
                                        </Card>
                                    </InputGroup>
                                    {/* <InputGroup style={{ marginTop: '3%'}}>
                                        <InputGroupAddon addonType="append">
                                            <Button disabled style={{ borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }}><FontAwesomeIcon icon={faClock} /></Button>
                                        </InputGroupAddon>
                                        <Card style={{ padding: 4, width: '22.5vw', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
                                            <TimeRangeFilter handleChangeTime={this.handleChangeTime.bind(this)} timeValue={this.state.timeValue} />
                                        </Card>
                                    </InputGroup> */}
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