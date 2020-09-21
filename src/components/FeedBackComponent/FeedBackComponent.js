import React, { Component } from 'react';

import '../FeedBackComponent/FeedBackComponent.css';
import PersonAttributesComponent from '../PersonAttributesComponent/PersonAttributesComponent';

import { connect } from 'react-redux';
import { initializePersonAttr } from '../../redux/ActionCreators';

const mapStateToProps = (state) => { return state.feedback }
const mapDispatchToProps = (dispatch) => ({
  initializePersonAttr: () => dispatch(initializePersonAttr())
})

class FeedBackComponent extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.initializePersonAttr();
  }

  render() {
    return (
      <div className="container col-md-12">
        <div className="row feedbackContainer">
          <div className="imageRecogDiv col-md-7">
            <PersonAttributesComponent />
          </div>
          <div className="col-md-4">
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedBackComponent);