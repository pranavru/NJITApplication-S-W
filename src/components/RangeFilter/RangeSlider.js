import React from "react";
import { Grid } from "@material-ui/core";
import BarChart from "./BarChart";
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";
import { MuiRail, MuiHandle, MuiTrack, MuiTick } from "./components";
// import '../App.css';
import { Card } from 'reactstrap';

class RangeSlider extends React.Component {
    constructor(props) {
        super(props);

        this.startDateAT = new Date(this.props.DataVuzix.startDate);
        this.endDateAT = new Date(this.props.DataVuzix.endDate);
        const range = [0.5, 23.5];

        this.state = {
            domain: range,
            update: range,
            values: range,
            inputValues: null,
            displayChart: false
        };
    }

    render() {
        const { update, domain, displayChart } = this.state;
        // console.log(this.props.data);
        return (
            <Grid container style={{ margin: '3%', marginLeft: 0, bottom: 28, width: '92%', position: "absolute", zIndex: 0 }}>
                <Grid item xs={12}>
                    <Card>
                        <div
                            onMouseLeave={() => {
                                this.setState({ displayChart: false })
                                this.props.handleChangeTime(update[0], update[1]);
                            }}>
                            <div style={{ display: displayChart ? "flex" : "none" }}>
                                <BarChart
                                    data={this.props.data}
                                    highlight={update}
                                    domain={domain}
                                />
                            </div>

                            <Slider
                                rootStyle={{
                                    position: "relative",
                                    width: "100%"
                                }}
                                domain={domain}
                                values={domain}
                                onUpdate={update => {
                                    this.setState({ update, inputValues: update })
                                }}
                                onChange={values => this.setState({ values })}
                                step={0.5}
                            >
                                <Rail>
                                    {({ getRailProps }) => <MuiRail getRailProps={getRailProps} />}
                                </Rail>
                                <Handles>
                                    {({ handles, getHandleProps }) => (
                                        <div className="slider-handles"
                                            onMouseMove={() => { this.setState({ displayChart: true }) }}
                                        >
                                            {handles.map(handle => (
                                                <MuiHandle
                                                    key={handle.id}
                                                    handle={handle}
                                                    domain={domain}
                                                    getHandleProps={getHandleProps}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </Handles>
                                <Tracks left={false} right={false}>
                                    {({ tracks, getTrackProps }) => (
                                        <div className="slider-tracks">
                                            {tracks.map(({ id, source, target }) => (
                                                <MuiTrack
                                                    key={id}
                                                    source={source}
                                                    target={target}
                                                    getTrackProps={getTrackProps}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </Tracks>
                                <Ticks count={12}>
                                    {({ ticks }) => (
                                        <div className="slider-ticks">
                                            {ticks.map(tick => (
                                                <MuiTick key={tick.id} tick={tick} count={ticks.length} />
                                            ))}
                                        </div>
                                    )}
                                </Ticks>
                            </Slider>
                        </div>
                    </Card>
                </Grid>
            </Grid>
        );
    }
}

export default RangeSlider;