import React from 'react';
import { Card, Label, Input, Form } from 'reactstrap';
import { ButtonComponent } from '../ButtonComponent/ButtonComponent';

import '../GroupCreationComponent/GroupCreationComponent.css';

export default class GroupCreationComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Card style={{ border: '0px', margin: '1%' }}>
        <Label className="fontCard personTitleCard">Add Group</Label>
        <div className="addGroupCard">
          <div className="row col-md-12 col-12 groupNameDiv">
            <div className="personGroupNameLabel fontCard">
              <Label>Group Name:</Label>
            </div>
            <Form className="personGroupNameInput fontCard" onSubmit={e => e.preventDefault()}>
              <Input placeholder="Enter Group Name" className="personInputBoxCSS" />
              <div className="row col-md-10 groupButtonDiv">
                <div className="col-md-6 col-5">
                  <ButtonComponent name={"Add Person"} />
                </div>
                <div className="col-md-3 col-6">
                  <ButtonComponent type="submit" name={"Save"} />
                </div>
              </div>
            </Form>
          </div>
        </div>
      </Card>
    );
  };
}