import React from 'react';
import { Card, Label, Input, Form } from 'reactstrap';
import { ButtonComponent } from '../ButtonComponent/ButtonComponent';

import '../PersonAttributesComponent/PersonAttributesComponent.css'

import { connect } from 'react-redux';
import { editPersonAttr, personAttributes } from '../../redux/ActionCreators';

const mapStateToProps = (state) => { return state.feedback }
const mapDispatchToProps = (dispatch) => ({
  personAttributes: data => dispatch(personAttributes(data)),
  editPersonAttr: (data, props) => dispatch(editPersonAttr(data, props))
})

const PersonAttributesComponent = (props) => {
  const [imageSelection, selectImage] = React.useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    if (typeof value !== null) { props.editPersonAttr({ name, value }, props) }
  };

  function previewFile() {
    var files = [], result = [];
    var file = document.querySelector('input[type=file]').files;
    Array.from(file).forEach((f) => {
      var reader = new FileReader();
      if (f) {
        reader.readAsDataURL(f);
        files.push(reader)
      }
    })
    files.forEach(m => m.onloadend = async () => {
      await result.push(m.result)
      if (typeof result !== null) { props.editPersonAttr({ name: "images", value: result }, props) };
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
              <Input placeholder="First name" className="col-md-5 col-6 inputBoxName" value={props.fname} name="fname" onChange={handleChange} />
              <Input placeholder="Last name" className="col-md-6 col-5 inputBoxName" value={props.lname} name="lname" onChange={handleChange} />
            </div>
            <div className="row col-md-12 col-12 savePersonInput">
              <div className="col-md-4 col-3">
                <ButtonComponent type="submit" name={"Save"} class="fontButton" callBackFunc={async () => {
                  props.personAttributes(props.feedback);
                  if (props.errMess !== null && !props.isLoading) {
                    await alert(props.errMess);
                  }
                }} />
              </div>
              <div className="col-md-8 col-9" style={{ display: imageSelection ? "flex" : "none" }}>
                <Input type="file" multiple={true} onChange={previewFile} name='imagesGallery' />
              </div>
            </div>
          </Form>
        </div>
      </div>  
    </Card>
  );
}


export default connect(mapStateToProps, mapDispatchToProps)(PersonAttributesComponent);