import React from 'react';
import { Card, Label, Input, Form } from 'reactstrap';
import { ButtonComponent } from '../ButtonComponent/ButtonComponent';

import '../PersonAttributesComponent/PersonAttributesComponent.css'

const PersonAttributesComponent = () => {
  const [imageSelection, selectImage] = React.useState(false);
  const [fname, handleFirstNameChange] = React.useState('')
  const [lname, handleLastNameChange] = React.useState('')
  const [images, handleSubmittedImages] = React.useState();
  function handleChange(event) {
    const { name, value } = event.target;
    if (name.match("fname")) { handleFirstNameChange(value) };
    if (name.match("lname")) { handleLastNameChange(value) };
  }

  var files = []
  function previewFile() {
    var file = document.querySelector('input[type=file]').files;
    Array.from(file).forEach((f, index) => {
      var reader = new FileReader();
      if (f) {
        reader.readAsDataURL(f);
        files.push(reader)
      }
    })
    findFile();
  }

  function findFile() {
    var result = [];
    files.map(m => m.onloadend = async function () {
      await result.push(m.result)
      await handleSubmittedImages(result);
    })
  }

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
              <ButtonComponent name={"Add Face Image"} callBackFunc={() => selectImage(!imageSelection)} class="fontButton" />
            </div>
          </div>
          <Form className="col-md-9 col-7" onSubmit={e => e.preventDefault()}>
            <div className="row col-md-12 col-12" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Input placeholder="First name" className="col-md-5 col-6 inputBoxName" value={fname} name="fname" onChange={handleChange} />
              <Input placeholder="Last name" className="col-md-6 col-5 inputBoxName" value={lname} name="lname" onChange={handleChange} />
            </div>
            <div className="row col-md-12 col-12 savePersonInput">
              <div className="col-md-4 col-3">
                <ButtonComponent type="submit" name={"Save"} class="fontButton" />
              </div>
              <div className="col-md-8 col-9" style={{ display: imageSelection ? "flex" : "none", animation: 'fadeIn ease 1s' }}>
                <Input type="file" multiple={true} onChange={previewFile} name='imagesGallery' />
              </div>
            </div>
          </Form>
        </div>
      </div>
    </Card>
  );
}

export default PersonAttributesComponent;