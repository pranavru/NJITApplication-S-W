import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Card, InputGroup, Button } from 'reactstrap';
import './MapFilterComponent.css'
import DateRangeFilter from '../DateRangeFilter/DateRangeFilter';
import DisplayVideoComponent from '../DisplayVideoComponent/DisplayVideoComponent';

class MapFilterComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isSpeech: false,
            personName: [],
            dateValue: [new Date(this.props.DataVuzix.startDate), new Date(this.props.DataVuzix.endDate)],
            disPlayVideo: false,
            isLoading: true,
            // addressValue: '',
            createdAtValues: new Map(),
            dataValues: []
        }

        this.handleChangeCheck = this.handleChangeCheck.bind(this);
        this.changePersonAsSelected = this.changePersonAsSelected.bind(this)
        this.submitObjectValues = this.submitObjectValues.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
        this.locations = JSON.parse(localStorage.getItem('addresses'))
    }

    componentDidMount() {
        this.dateValuesData();
    }

    handleChangeCheck(event) {
        if (event.target.name === 'addressValue') {
            const { name, value } = event.target;
            this.setState({ [name]: value })
        } else {
            const { name, checked } = event.target;
            this.setState({ [name]: checked, disPlayVideo: false })
        }
    }

    changePersonAsSelected(event) {
        let persons = this.props.people
        persons.forEach(person => { if (person.name === event.target.name) person.checked = event.target.checked })
        this.setState({ personName: persons, disPlayVideo: false })
    }

    handleChangeDate(event) {
        let startDate = this.state.dateValue[0];
        let endDate = this.state.dateValue[1];
        startDate.setFullYear(event[0].getFullYear(), event[0].getMonth(), event[0].getDate());
        endDate.setFullYear(event[1].getFullYear(), event[1].getMonth(), event[1].getDate());

        this.setState({ dateValue: [startDate, endDate], disPlayVideo: false });
        this.dateValuesData();
    }

    handleChangeTime(startTime, endTime) {
        let startDate = this.state.dateValue[0];
        let endDate = this.state.dateValue[1];
        startDate.setHours(startTime);
        startDate.setMinutes(Math.floor(startTime) < startTime ? 30 : 0);
        endDate.setHours(endTime)
        endDate.setMinutes(Math.floor(endTime) < endTime ? 30 : 0);
        console.log(startDate, endDate);
        this.setState({ dateValue: [startDate, endDate], disPlayVideo: false })
    }

    submitObjectValues() {
        let persons = []
        this.state.personName.map(p => p.checked === true ? persons.push(p.name) : null)

        let json_body = {
            speech: this.state.isSpeech,
            person: persons,
            // location: this.state.addressValue,
            lat: "0.0",
            long: "0.0",
            start_date: this.state.dateValue[0].toISOString(),
            end_date: this.state.dateValue[1].toISOString(),
            vid: "123456789"
        }

        return json_body;
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.changeVideoProps();
        this.props.loadDataJson('/query/', this.submitObjectValues())
        this.setState({ disPlayVideo: true })
    }

    addImages = (video) => {
        let items_array = video !== undefined ? video : []
        if (items_array.length > 0) {
            items_array.map(m => {
                if (!m.src.includes('http://18.191.247.248/media')) {
                    let url = this.props.baseURL + m.src;
                    m.src = url;
                }
            })
        }
        return items_array;
    }

    dateValuesData = () => {
        let createdAt = new Map();
        let data = [];
        this.props.DataVuzix.vuzixMap.map(m => {
            const dateValue = new Date(m.created);
            if (this.state.dateValue[0].getTime() <= dateValue.getTime() && dateValue.getTime() <= this.state.dateValue[1].getTime()) {
                const dateValueHours = dateValue.getHours()
                data.push(dateValueHours);
                if (!createdAt.has(dateValueHours)) {
                    createdAt.set(dateValueHours, 1)
                } else {
                    createdAt.set(new Date(dateValueHours, dateValueHours + 1))
                }
            }
        })
        this.setState({ createdAtValues: createdAt, dataValues: data })
    }

    render() {

        return (
            <div style={{ height: '98vh', marginLeft: "2%" }}>
                <Card className="filterCard">
                    <Button disabled className="cardHeaderTitleButton"><Label className="cardHeaderTitleLabel filterFont">FILTER</Label></Button>
                    <div>
                        <Form onSubmit={this.handleSubmit}>
                            {/* * Speech Form * */}
                            <FormGroup>
                                <InputGroup className="inputGroupValue">
                                    <Input addon type="checkbox" name="isSpeech" value={this.state.isSpeech} aria-label="Speech" onClick={this.handleChangeCheck} className="checkboxButton filterFont" />
                                    <Button outline disabled className="checkboxButtonLabel filterFont" style={{ color: "black" }}>SPEECH</Button>
                                </InputGroup>
                            </FormGroup>

                            {/* * Persons Form * */}

                            <Label className="filterCategoryLabel filterFont">PEOPLE</Label>
                            <FormGroup >
                                <InputGroup className="inputGroupValue">
                                    {/* <InputGroupAddon addonType="append"></InputGroupAddon> */}
                                    {this.props.people.map(v =>
                                        <InputGroup key={v.name}>
                                            <Input key={v.name} addon type="checkbox" name={v.name} value={v.checked} aria-label="Person" onClick={this.changePersonAsSelected} className="checkboxButton filterFont" />
                                            <Button outline disabled className="checkboxButtonLabel filterFont" style={{ color: "black" }}>{v.name.toUpperCase()}</Button>
                                        </InputGroup>
                                    )}
                                </InputGroup>
                            </FormGroup>

                            {/* * Date Value Form * */}
                            <FormGroup>
                                <Label className="filterCategoryLabel filterFont">DATE</Label>
                                <DateRangeFilter handleChangeDate={this.handleChangeDate.bind(this)} dateValue={this.state.dateValue} DataVuzix={this.props.DataVuzix} startDate={this.props.startDate} endDate={this.props.endDate} handleChangeTime={this.handleChangeTime.bind(this)} dateValuesData={this.dateValuesData.bind(this)} createdAt={this.state.createdAtValues} data={this.state.dataValues} />
                            </FormGroup>

                            {/* <FormGroup style={{ marginLeft: '1%' }}>
                                <Label style={{ width: '14vw', fontWeight: 'bold' }}>Location</Label>
                                <select value={this.state.addressValue} name="addressValue" onChange={this.handleChangeCheck} style={{ width: "26.2vw", height: "3vw", marginLeft: '1%' }}>
                                    {this.locations.address.map(m => {
                                        if(m.value !== "") {
                                            return <option key={m.key} value={m.value}>{m.value}</option>
                                        }
                                    })}
                                </select>
                            </FormGroup> */}

                            <Button outline color="secondary" size="lg" type="submit" className="submitButton filterFont" >SUBMIT</Button>
                        </Form>
                    </div>
                </Card>
                {this.state.disPlayVideo && <DisplayVideoComponent videoSrc={this.props.video} disPlayVideo={this.state.disPlayVideo} />}
            </div>
        );
    }
}

export default MapFilterComponent;