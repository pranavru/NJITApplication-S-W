import React, { Component } from 'react';
import Gallery from 'react-grid-gallery';

import '../FeedBackComponent/FeedBackComponent.css';
import PersonAttributesComponent from '../PersonAttributesComponent/PersonAttributesComponent';

import { connect } from 'react-redux';
import { editPersonAttr, initializePersonAttr } from '../../redux/ActionCreators';
import GroupCreationComponent from '../GroupCreationComponent/GroupCreationComponent';

const mapStateToProps = (state) => { return state.feedback }
const mapDispatchToProps = (dispatch) => ({
  initializePersonAttr: () => dispatch(initializePersonAttr()),
  editPersonAttr: (data, props) => dispatch(editPersonAttr(data, props))
})

/**
 * This component loads the detailed feedback route.
 * It includes of 2 components. Left: User Feedback & Right: Tagged Individuals
 * Left portion contains a Feedback form and a Gallery of pre defined untagged images.
 * These images can be selected to tag on form submmission
 */
class FeedBackComponent extends Component {

  componentDidMount() {
    this.props.initializePersonAttr();
  }

  render() {
    return (
      <div className="container col-md-12">
        {this.props.feedback && <div className="row feedbackContainer">
          <div className="col-md-8">
            <div className="imageRecogDiv">
              <PersonAttributesComponent />
              <div className="imageSelectionDiv">
                <Gallery
                  images={this.props.feedback.images}
                  enableImageSelection={true}
                  rowHeight={120}
                  backdropClosesModal={true}
                  showCloseButton={false}
                  showImageCount={true}
                  preloadNextImage={true}
                  onSelectImage={(i) => this.props.editPersonAttr({ name: "gallery", value: i }, this.props)}
                  enableLightbox={false}
                />
              </div>
            </div>
          </div>
          <div className="imageRecogDiv col-md-3">
            {this.props.feedback.tags !== undefined && <GroupCreationComponent tags={this.props.feedback.tags} />}
          </div>
        </div>}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedBackComponent);