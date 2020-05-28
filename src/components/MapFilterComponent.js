import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Card, InputGroup, InputGroupAddon, Button, InputGroupText } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faCalendar, faCode } from '@fortawesome/free-solid-svg-icons'
import { Animated } from 'react-animated-css';
import '../App.css';
import DateRangeFilter from './DateRangeFilter';
import DisplayVideoComponent from './DisplayVideoComponent';


class MapFilterComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSpeech: false,
            isPerson: true,
            personName: '',
            speech: '',
            isDate: false,
            dateValue: [new Date(), new Date()],
            disPlayVideo: false,
            videoSrc: ""
        }

        this.a = [];
        this.dateObj = {}
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeCheck = this.handleChangeCheck.bind(this);
        this.personNamesMethod = this.personNamesMethod.bind(this);

        console.log(this.props.video)

    }

    componentDidMount() {
    }

    personNamesMethod(p) {
        this.personNames = this.props.loadPersonNames(p).values()[Symbol.iterator]();
        this.a = [];
        for (let item of this.personNames) {
            this.a.push({ checked: false, name: item });
        }

        console.log(this.a)
    }

    handleChange(event) {
        const { name, value } = event.target;
        console.log({ name, value });
        this.setState({
            [name]: value === "true" ? true : value === "false" ? false : value,
            disPlayVideo: false
        });
        this.dateObj = name === 'isDate' ? this.props.loadDateValues() : {}

        console.log(this.dateObj)
    }

    handleChangeDate(event) {
        this.setState({
            dateValue: [new Date(event[0]), new Date(event[1])]
        })
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
        this.props.loadDataJson('/vuzixMap/video')

        this.setState({
            disPlayVideo: true, videoSrc: this.props.video
        })
        console.log(this.state)
    }


    render() {
        console.log(this.state)
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
                                            <Input addon type="checkbox" name="isSpeech" value={this.state.isSpeech} aria-Label="Speech" onClick={this.handleChangeCheck} />
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
                                            <Input addon type="checkbox" name="isPerson" value={this.state.isPerson} aria-Label="Person" onClick={this.handleChangeCheck} />
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
                                                        <Input addon type="checkbox" name="isPerson" value={v.checked} aria-Label="Person" onClick={v.checked = !v.checked} />
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
                                    className={this.state.isDate ? "displayBlock" : "displayNone"} style={{ marginLeft: '5%', marginTop: "3%" }} >

                                    <InputGroup>
                                        <InputGroupAddon addonType="append">
                                            <Button style={{ borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }}><FontAwesomeIcon icon={faCalendar} /></Button>
                                        </InputGroupAddon>
                                        <Card style={{ padding: 4, width: '22vw', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
                                            <DateRangeFilter handleChangeDate={this.handleChangeDate.bind(this)} dateValue={this.state.dateValue} />
                                        </Card>
                                    </InputGroup>
                                </Animated>
                            </FormGroup>

                            <Input type="submit" value="Submit" />
                        </Form>
                    </div>
                </Card>
                {this.props.DataVuzix !== undefined ?
                    <DisplayVideoComponent videoSrc={this.props.video} disPlayVideo={this.state.disPlayVideo} dateVal={this.dateObj} />
                    : <div></div>
                }
            </div>
        );
    }
}

export default MapFilterComponent;