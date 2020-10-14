import React from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

import './NavBarComponent.css';

import { connect } from 'react-redux';
import ZoomInOUTComponent from '../ZoomInOUTComponent/ZoomInOUTComponent';
import { taggingCompleted } from '../../redux/ActionCreators';
import { baseUrl } from '../../shared/baseUrl';
const mapStateToProps = (state) => { return { filter: state.mapFilter, feed: state.feedback, } };
const mapDispatchToProps = (dispatch) => ({
  taggingCompleted: () => dispatch(taggingCompleted()),
});

const checkUnknownPeople = (setFillColor) => {
  fetch(baseUrl + '/get_unk').then(res => res.ok ? res.json() : null).then(res => {
    if (res) {
      res.length > 0 ? setFillColor(true) : setFillColor(false);
    }
  })
}

const NavBarComponent = (props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [fillColor, setFillColor] = React.useState(false);
  checkUnknownPeople(setFillColor);

  return (
    <div className="navContainer">
      <Navbar dark expand="md">
        <NavbarBrand href="/">Vuzix Blade</NavbarBrand>
        <NavbarToggler onClick={() => setIsOpen(!isOpen)} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="/">Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/feedback">Feedback <span className="redNotiDot">
                <svg height="10" width="10">
                  <circle cx="5" cy="5" r="3"
                    fill={fillColor ? "red" : "#2C4870"}
                  />
                </svg>
              </span></NavLink>
            </NavItem>
          </Nav>
          {!window.location.pathname.includes("feedback") ?
            <ZoomInOUTComponent /> : <></>
          }
        </Collapse>
      </Navbar>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBarComponent);

{/* 
<Link to="/" 
  className="btn btn-secondary"
  style={{ backgroundColor: '#2C4870' }}
  onClick={taggingCompleted}
>Done Tagging</Link> 
*/}