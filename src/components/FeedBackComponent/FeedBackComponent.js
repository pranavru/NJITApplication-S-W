import React, { Component } from 'react';

import '../FeedBackComponent/FeedBackComponent.css';
import { GroupCreationComponent } from '../GroupCreationComponent/GroupCreationComponent';
import PersonAttributesComponent from '../PersonAttributesComponent/PersonAttributesComponent';

export default class FeedBackComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container col-md-12">
        <div className="row feedbackContainer">
          <div className="groupPersonDiv col-md-4">
            <GroupCreationComponent />
          </div>
          <div className="imageRecogDiv col-md-7">
            <PersonAttributesComponent />
          </div>
        </div>
      </div>
    );
  }
}