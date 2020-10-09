import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Card, InputGroup, CardText } from 'reactstrap';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

import DateRangeFilter from '../DateRangeFilter/DateRangeFilter';
import DisplayVideoComponent from '../DisplayVideoComponent/DisplayVideoComponent';

import './MapFilterComponent.css'

import { connect } from 'react-redux';
import { fetchMapFilter, fetchSpeechText, editMapFilter, editDataVuzix, videoPlayer, editVideo, fetchDataUsingSpeechText } from '../../redux/ActionCreators'

const mapStateToProps = (state) => { return { MapFilter: state.mapFilter, MapMarkersData: state.mapMarkersData, SpeechText: state.speechText } }

const mapDispatchToProps = (dispatch) => ({
    fetchMapFilter: (data, dateMap) => dispatch(fetchMapFilter(data, dateMap)),
    fetchSpeechText: () => dispatch(fetchSpeechText()),
    editMapFilter: (type, newValue, props) => dispatch(editMapFilter(type, newValue, props)),
    editDataVuzix: (obj, loader) => dispatch(editDataVuzix(obj, loader)),
    videoPlayer: (data) => dispatch(videoPlayer(data)),
    editVideo: (obj, loader) => dispatch(editVideo(obj, loader)),
    fetchDataUsingSpeechText: (data, props) => dispatch(fetchDataUsingSpeechText(data, props))
});

function groupedPicker(props, handleSubmit) {
    const s = props.SpeechText;
    const speech = s.speechText.map(s => { return { title: s } })
    const options = speech.map((option) => {
        const firstLetter = option.title[0].toUpperCase();
        return {
            firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
            ...option,
        };
    });

    return (
        <Autocomplete
            id="speech-text"
            options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.title}
            style={{ width: '90%', height: '10%' }}
            loading={s.isLoading}
            renderInput={(params) => <TextField
                {...params}
                label="Enter Speech Text"
                InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                        <React.Fragment>
                            {s.isLoading ? <CircularProgress color="#2C4870" size={15} /> : null}
                            {params.InputProps.endAdornment}
                        </React.Fragment>
                    )
                }}
            />}
            filterSelectedOptions={true}
            size="small"
            onChange={(event, value) => {
                if (value) {
                    props.activateLoader(true);
                    props.fetchDataUsingSpeechText(value.title, props);
                } else if (value === null) {
                    handleSubmit();
                }
            }}
        />
    );
}

class MapFilterComponent extends Component {

    constructor(props) {
        super(props);

        this.handleChangeCheck = this.handleChangeCheck.bind(this);
        this.changePersonAsSelected = this.changePersonAsSelected.bind(this)
        this.submitObjectValues = this.submitObjectValues.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount = () => {
        this.props.fetchMapFilter(this.props.DataVuzix);
        this.props.fetchSpeechText();
    }

    handleDateChange = (startDate, endDate) => {
        this.props.editMapFilter("dateValues", [startDate, endDate], this.props.MapFilter)
        this.handleSubmit();
    };

    handleChangeCheck(event) {
        const { name, checked } = event.target;
        this.props.editMapFilter(name, checked, this.props.MapFilter);
        this.handleSubmit()
    }

    changePersonAsSelected(event) {
        let persons = this.props.MapFilter.mapFilter.personNames;
        persons.forEach(person => person.name === event.target.name ? person.checked = event.target.checked : null)
        this.props.editMapFilter("personNames", persons, this.props.MapFilter);
        this.handleSubmit()
    }

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
            vid: "123456789",
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
                <div style={{ marginLeft: "2%", marginRight: '1%' }}>
                    <Card className="filterCard">
                        <Label className="filterFont cardHeaderTitleLabel">FILTER</Label>
                        <Form onSubmit={event => event.preventDefault()} >
                            {/* * Speech Form * */}
                            <FormGroup>
                                <InputGroup className="inputGroupValue">
                                    <Input addon type="checkbox" name="isSpeech" value={isSpeech} aria-label="Speech" onClick={this.handleChangeCheck} className="checkboxButton filterFont" />
                                    <CardText className="checkboxButtonLabel filterFont" style={{ color: '#2C4870' }}>SPEECH</CardText>
                                    {!this.props.SpeechText.isLoading && groupedPicker(this.props, this.handleSubmit)}
                                </InputGroup>
                            </FormGroup>

                            {/* * Persons Form * */}
                            {personNames && <FormGroup>
                                {personNames.length > 0 && <Label className="filterCategoryLabel filterFont">PEOPLE</Label>}
                                <InputGroup className="inputGroupValue overflowPersons">
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
                        </Form>
                    </Card>
                    <DisplayVideoComponent />
                </div >
            );
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapFilterComponent);