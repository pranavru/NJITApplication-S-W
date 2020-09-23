import React, { Component } from 'react';
import Gallery from 'react-grid-gallery';

import '../FeedBackComponent/FeedBackComponent.css';
import PersonAttributesComponent from '../PersonAttributesComponent/PersonAttributesComponent';

import { connect } from 'react-redux';
import { editPersonAttr, initializePersonAttr } from '../../redux/ActionCreators';

const mapStateToProps = (state) => { return state.feedback }
const mapDispatchToProps = (dispatch) => ({
  initializePersonAttr: () => dispatch(initializePersonAttr()),
  editPersonAttr: (data, props) => dispatch(editPersonAttr(data, props))
})

class FeedBackComponent extends Component {

  componentDidMount() {
    this.props.initializePersonAttr();
  }

  render() {
    return (
      <div className="container col-md-12">
        <div className="row feedbackContainer">
          <div className="imageRecogDiv col-md-7">
            <PersonAttributesComponent />
            <div className="imageSelectionDiv">
              {this.props.feedback && <Gallery
                images={this.props.feedback.images}
                enableImageSelection={true}
                rowHeight={120}
                backdropClosesModal={true}
                showCloseButton={false}
                showImageCount={true}
                preloadNextImage={true}
                onSelectImage={(i) => this.props.editPersonAttr({ name: "galleryImage", value: i }, this.props)}
                enableLightbox={false}
              />}
            </div>
          </div>
          <div className="col-md-4">
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedBackComponent);