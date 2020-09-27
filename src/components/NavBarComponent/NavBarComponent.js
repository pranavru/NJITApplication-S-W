import React from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

import './NavBarComponent.css';

import { connect } from 'react-redux';
const mapStateToProps = (state) => { return { filter: state.mapFilter, feed: state.feedback } };

const NavBarComponent = (props) => {
  const [isOpen, setIsOpen] = React.useState(false);

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
                  <circle cx="5" cy="5" r="3" fill={(!props.filter.isLoading ? props.filter.mapFilter.personNames.filter(p => p.name === "unknown").length : (!props.feed.isLoading ? props.feed.feedback.images.length : 0)) > 0 ? "red" : "#2C4870"} />
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
