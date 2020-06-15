import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Card, InputGroup, Button } from 'reactstrap';
import '../App.css';
import DateRangeFilter from './DateRangeFilter';
import DisplayVideoComponent from './DisplayVideoComponent';


class MapFilterComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isSpeech: false,
            personName: [],
            dateValue: [new Date(this.props.DataVuzix.startDate), new Date(this.props.DataVuzix.startDate)],
            disPlayVideo: false,
            isLoading: true,
            // addressValue: ''
        }

        this.handleChangeCheck = this.handleChangeCheck.bind(this);
        this.changePersonAsSelected = this.changePersonAsSelected.bind(this)
        this.submitObjectValues = this.submitObjectValues.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
        this.locations = JSON.parse(localStorage.getItem('addresses'))
    }

    shouldComponentUpdate(nextProps) {
        return this.props !== nextProps;
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
        this.setState({ dateValue: [new Date(event[0]), new Date(event[1])], disPlayVideo: false })
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

    render() {

        return (
            <div className="col-md-12" style={{ height: '98vh' }}>
                <Card style={{ padding: 4, marginTop: '4%' }}>
                    <Button disabled style={{ borderBottomRightRadius: 0, borderBottomLeftRadius: 0 }}><Label style={{ width: '30vw', fontWeight: 'bold', textAlign: 'left', top: '2%' }}>Filter</Label></Button>
                    <div style={{ marginTop: "3%" }}>
                        <Form onSubmit={this.handleSubmit}>
                            {/* * Speech Form * */}
                            <FormGroup>
                                <InputGroup style={{ width: '22vw', marginLeft: "5%" }}>
                                    <Input addon type="checkbox" name="isSpeech" value={this.state.isSpeech} aria-label="Speech" onClick={this.handleChangeCheck} style={{ marginTop: '3.7%' }} />
                                    <Button disabled style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, backgroundColor: 'white', color: '#000000', border: 0, fontWeight: "bold" }}>Speech</Button>
                                </InputGroup>
                            </FormGroup>

                            {/* * Persons Form * */}

                            <Label style={{ width: '14vw', fontWeight: 'bold', marginLeft: '2%' }}>People</Label>
                            <FormGroup >
                                <InputGroup style={{ width: '22vw', marginLeft: '5%' }}>
                                    {/* <InputGroupAddon addonType="append"></InputGroupAddon> */}
                                    {this.props.people.map(v =>
                                        <InputGroup key={v.name}>
                                            <Input key={v.name} addon type="checkbox" name={v.name} value={v.checked} aria-label="Person" onClick={this.changePersonAsSelected} style={{ marginTop: '3.7%' }} />
                                            <Button disabled style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, backgroundColor: 'white', color: '#000000', border: 0, fontWeight: "bold" }}>{v.name}</Button>
                                        </InputGroup>
                                    )}
                                </InputGroup>
                            </FormGroup>

                            {/* * Date Value Form * */}
                            <FormGroup style={{ marginLeft: '1%' }}>
                                <Label style={{ width: '14vw', fontWeight: 'bold' }}>Date</Label>
                                <DateRangeFilter handleChangeDate={this.handleChangeDate.bind(this)} dateValue={this.state.dateValue} DataVuzix={this.props.DataVuzix} startDate={this.props.startDate} endDate={this.props.endDate} />
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

                            <Input type="submit" value="Submit" />
                        </Form>
                    </div>
                </Card>
                {this.state.disPlayVideo && <DisplayVideoComponent videoSrc={this.props.video} disPlayVideo={this.state.disPlayVideo} />}
            </div>
        );
    }
}

export default MapFilterComponent;