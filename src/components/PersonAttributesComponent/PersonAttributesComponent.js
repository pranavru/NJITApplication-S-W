import React from 'react';
import { Card, Label, Input, Form } from 'reactstrap';
import { ButtonComponent } from '../ButtonComponent/ButtonComponent';

import '../PersonAttributesComponent/PersonAttributesComponent.css'

const PersonAttributesComponent = () => {
  const [imageSelection, selectImage] = React.useState(false);
  const fNameRef = React.useRef("");
  const lNameRef = React.useRef('');
  const imageFilesRef = React.useRef([]);

  return (
    <Card style={{ border: '0px', margin: '0.6%' }}>
      <Label className="fontPerson personTitle">Add Person with Image</Label>
      <div className="personAttributesContainer fontPerson">
        <div className="row col-md-12">
          <div className="col-md-3 col-5">
            <div className="labelPersonName col-md-12 col-12">
              <Label>Person Name:</Label>
            </div>
            <div className="col-md-12 col-12" style={{ marginTop: '10%' }}>
              <ButtonComponent name={"Add Face Image"} callBackFunc={() => selectImage(!imageSelection)} />
            </div>
          </div>
          <Form className="col-md-9 col-7" onSubmit={e => e.preventDefault()}>
            <div className="row col-md-12 col-12" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Input placeholder="First name" className="col-md-5 col-6 inputBoxName" />
              <Input placeholder="Last name" className="col-md-6 col-5 inputBoxName"  />
            </div>
            <div className="row col-md-12 col-12 savePersonInput">
              <div className="col-md-4 col-3">
                <ButtonComponent type="submit" name={"Save"} />
              </div>
              <div className="col-md-8 col-9" style={{ display: imageSelection ? "flex" : "none" }}>
                <Input type="file" placeholder="Last name" multiple={true} ref={imageFilesRef} />
              </div>
            </div>
          </Form>
        </div>
      </div>
    </Card>
  );
}

export default PersonAttributesComponent;