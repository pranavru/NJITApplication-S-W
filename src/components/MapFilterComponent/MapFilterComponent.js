import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Card, InputGroup, Button, CardText } from 'reactstrap';

import DateRangeFilter from '../DateRangeFilter/DateRangeFilter';
import DisplayVideoComponent from '../DisplayVideoComponent/DisplayVideoComponent';

import './MapFilterComponent.css'

import { connect } from 'react-redux';
import { fetchMapFilter, editMapFilter, editDataVuzix } from '../../redux/ActionCreators'

const mapStateToProps = (state) => { return { MapFilter: state.mapFilter, MapMarkersData: state.mapMarkersData } }

const mapDispatchToProps = (dispatch) => ({
    fetchMapFilter: (data, dateMap) => dispatch(fetchMapFilter(data, dateMap)),
    editMapFilter: (type, newValue, props) => dispatch(editMapFilter(type, newValue, props)),
    editDataVuzix: (obj, loader) => dispatch(editDataVuzix(obj, loader)),
})

class MapFilterComponent extends Component {

    constructor(props) {
        super(props);

        this.handleChangeCheck = this.handleChangeCheck.bind(this);
        this.changePersonAsSelected = this.changePersonAsSelected.bind(this)
        this.submitObjectValues = this.submitObjectValues.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount = () => this.props.fetchMapFilter(this.props.DataVuzix);

    handleDateChange = (startDate, endDate) => {
        this.props.editMapFilter("dateValues", [startDate, endDate], this.props.MapFilter)
        this.handleSubmit();
    };

    handleChangeCheck(event) {
        if (event.target.name === 'addressValue') {
            const { name, value } = event.target;
            this.setState({ [name]: value })
        } else {
            const { name, checked } = event.target;
            this.props.editMapFilter(name, checked, this.props.MapFilter);
            this.handleSubmit()
        }
    }

    changePersonAsSelected(event) {
        let persons = this.props.MapFilter.mapFilter.personNames;
        persons.forEach(person => person.name === event.target.name ? person.checked = event.target.checked : null)
        this.props.editMapFilter("personNames", persons, this.props.MapFilter);
        this.handleSubmit()
    }

    // addImages = (video) => {
    //     let items_array = video !== undefined ? video : []
    //     if (items_array.length > 0) {
    //         items_array.map(m => {
    //             if (!m.src.includes('http://18.191.247.248/media')) {
    //                 let url = baseURL + m.src;
    //                 m.src = url;
    //             }
    //             return null;
    //         })
    //     }
    //     return items_array;
    // }

    submitObjectValues() {
        const { isSpeech, personNames, mapDateRange } = this.props.MapFilter.mapFilter;
        let people = [];
        personNames.forEach(p => (p.checked === true) ? people.push(p.name) : null)
        let json_body = {
            speech: isSpeech,
            person: people,
            // location: this.state.addressValue,
            lat: "0.0",
            long: "0.0",
            start_date: new Date(mapDateRange.updated[0]).toISOString(),
            end_date: new Date(mapDateRange.updated[1]).toISOString(),
            vid: "123456789"
        }
        console.log(json_body)
        return json_body;
    }

    handleSubmit() {
        this.props.activateLoader(true);
        this.props.editDataVuzix(this.submitObjectValues(), this.props)
    }

    render() {
        const { isSpeech, personNames, isLoading, mapDateRange } = this.props.MapFilter.mapFilter;
        if (!isLoading) {
            return (
                <div style={{ height: '98vh', marginLeft: "2%" }}>
                    <Card className="filterCard">
                        <Label className="filterFont cardHeaderTitleLabel">FILTER</Label>
                        <Form onSubmit={event => event.preventDefault()} >
                            {/* * Speech Form * */}
                            <FormGroup>
                                <InputGroup className="inputGroupValue">
                                    <Input addon type="checkbox" name="isSpeech" value={isSpeech} aria-label="Speech" onClick={this.handleChangeCheck} className="checkboxButton filterFont" />
                                    <CardText className="checkboxButtonLabel filterFont" style={{ color: '#2C4870' }}>SPEECH</CardText>
                                </InputGroup>
                            </FormGroup>

                            {/* * Persons Form * */}
                            <CardText className="filterCategoryLabel filterFont">PEOPLE</CardText>
                            {personNames && <FormGroup>
                                <InputGroup className="inputGroupValue">
                                    {/* <InputGroupAddon addonType="append"></InputGroupAddon> */}
                                    {personNames.map(v =>
                                        <InputGroup key={v.name}>
                                            <Input key={v.name} addon type="checkbox" name={v.name} value={v.checked} aria-label="Person" onClick={this.changePersonAsSelected} className="checkboxButton filterFont" />
                                            <CardText className="checkboxButtonLabel filterFont" style={{ color: '#2C4870' }}>{v.name.toUpperCase()}</CardText>
                                        </InputGroup>
                                    )}
                                </InputGroup>
                            </FormGroup>}

                            {/* * Date Value Form * */}
                            <FormGroup>
                                <CardText className="filterCategoryLabel filterFont">DATE</CardText>
                                {mapDateRange && <DateRangeFilter
                                    handleDateChange={this.handleDateChange.bind(this)}
                                    DataVuzix={this.props.DataVuzix}
                                    mapFilter={this.props.MapFilter}
                                    editMapFilter={this.props.editMapFilter}
                                    handleSubmit={this.handleSubmit.bind(this)}
                                />}
                            </FormGroup>

                            {/* <Button outline color="secondary" size="lg" type="submit" className="submitButton filterFont">SUBMIT</Button> */}
                        </Form>
                    </Card>
                    <DisplayVideoComponent />
                </div >
            );
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapFilterComponent);

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