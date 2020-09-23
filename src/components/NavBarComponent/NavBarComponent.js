import React from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

import './NavBarComponent.css';

import { connect } from 'react-redux';
const mapStateToProps = (state) => state.mapFilter;

const NavBarComponent = (props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  // const [unknownDetected, setToUnknown] = React.useState(false);
  let unknowns;
  if (props.mapFilter.personNames) {
    unknowns = props.mapFilter.personNames.filter(p => p.name === "unknown").length;
  }
  //   if (unknowns > 0) {
  //     setToUnknown(true);
  const toggle = () => setIsOpen(!isOpen);
  return (
    <div className="navContainer">
      <Navbar dark expand="md">
        <NavbarBrand href="/">Vuzix Blade</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="/">Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/feedback">Feedback <span className="redNotiDot">
                <svg height="10" width="10">
                  <circle cx="5" cy="5" r="3" fill={unknowns > 0 ? "red" : "green"} />
                </svg>
              </span></NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default connect(mapStateToProps)(NavBarComponent);
