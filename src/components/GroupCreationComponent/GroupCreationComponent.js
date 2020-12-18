import React from 'react';
import { Card, Label } from 'reactstrap';

import '../GroupCreationComponent/GroupCreationComponent.css';

/**
 * Loads the Already tagged individuals from a single group
 * @param {} props 
 */
const GroupCreationComponent = (props) => {
  const { groupName, people } = props.tags;
  const { REACT_APP_BASE_URL } = process.env;

  return (
    <Card style={{ border: '0px', margin: '1%' }}>
      <Label className="fontCard personTitleCard">Already Tagged</Label>
      <div className="row col-md-12 col-12 groupNameDiv" style={{ margin: '0px', padding: '0px' }}>
        <div className="personGroupNameLabel fontPersonDetails">
          <Label>Group Name: {groupName.toUpperCase()}</Label>
        </div>
        <div className="groupPeopleDiv">
          {people.map(p =>
            <Card className="container shadow-sm bg-white fontPersonDetails addGroupCard">
              <div className="row col-sm-12 col-12" key={p.id} style={{ margin: '6px 0px', paddingRight: '5px' }}>
                <div className="col-sm-9 col-12"><p>Name: {p.name}</p></div>
                <div className="col-sm-3 col-12 taggedPersonImageContainer">
                  <img className="shadow-sm" src={REACT_APP_BASE_URL + p.img} width="80px" height="85px" style={{ borderTopRightRadius: '4px', borderBottomRightRadius: '4px' }} alt={"Not found"} />
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Card>
  );
};

export default GroupCreationComponent;

/*
 * <Form className="personGroupNameInput fontCard" onSubmit={e => e.preventDefault()}>
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
 */