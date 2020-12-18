import React from "react";
import { Grid } from "@material-ui/core";
import BarChart from "./BarChart";
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";
import { MuiRail, MuiHandle, MuiTrack, MuiTick } from "./components";
import './RangeSlider.css';
import { Card } from 'reactstrap';
import { format } from "date-fns";
import { scaleLinear } from "d3-scale";

const sliderStyle = {
    position: "relative",
    width: "100%"
};

class RangeSlider extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            displayChart: false,
        };
    }

    render() {
        const { updated, values, domain, data } = this.props.mapFilter.mapDateRange;
        const { displayChart } = this.state
        /**
         * @param  {mapFilterReference.mapDateRange.domain} .domain(domain
         * .ticks is used to display number of ticks below the range bar indicating the Day and the hours.
         */
        const dateTicks = scaleLinear().domain(domain).ticks(4).map(d => +d);
        const formatTick = (ms) => ((domain[1] - domain[0]) < new Date("Jan 02, 1970")) ? format(new Date(ms), "HH:ss") : format(new Date(ms), "MMM dd");

        return (
            <Grid container className="rangeSliderGrid" style={{ width: "85%", zIndex: displayChart ? 5 : 1 }} >
                <Grid item xs={12}>
                    <Card>
                        <div
                            onMouseLeave={() => this.setState({ displayChart: false })}>
                            <div style={{ display: displayChart ? "flex" : "none" }}>
                                <BarChart
                                    data={data}
                                    highlight={updated}
                                    domain={domain}
                                    multipleHours={this.props.multipleHours}
                                />
                            </div>

                            <Slider
                                mode={3}
                                step={this.props.hours}
                                domain={domain}
                                rootStyle={sliderStyle}
                                onUpdate={this.props.onUpdate}
                                onChange={this.props.onChange}
                                values={values}
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
                                <Ticks values={dateTicks}>
                                    {({ ticks }) => (
                                        <div>
                                            {ticks.map(tick => (
                                                <MuiTick
                                                    key={tick.id}
                                                    tick={tick}
                                                    count={ticks.length}
                                                    format={formatTick}
                                                />
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