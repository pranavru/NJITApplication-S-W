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

class FeedBackComponent extends Component {

  componentDidMount() {
    this.props.initializePersonAttr();
  }

  render() {
    return (
      <div className="container col-md-12">
        {this.props.feedback && <div className="row feedbackContainer">
          <div className="imageRecogDiv col-md-8">
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
                onSelectImage={(i) => this.props.editPersonAttr({ name: "galleryImage", value: i }, this.props)}
                enableLightbox={false}
              />
            </div>
          </div>
          <div className="imageRecogDiv col-md-3">
            {this.props.feedback.tags !== undefined && <GroupCreationComponent tags= {this.props.feedback.tags} />}
          </div>
        </div>}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedBackComponent);