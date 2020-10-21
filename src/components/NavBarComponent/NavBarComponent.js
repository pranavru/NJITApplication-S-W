import React, { useState, useEffect } from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

import './NavBarComponent.css';

import ZoomInOUTComponent from '../ZoomInOUTComponent/ZoomInOUTComponent';
import { baseUrl } from '../../shared/baseUrl';

const NavBarComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fillColor, setFillColor] = useState(false);

  useEffect(() => {
    fetch(baseUrl + '/get_unk').then(res => res.ok ? res.json() : null).then(res => {
      if (res) {
        (res.length > 0 && !window.location.pathname.includes("feedback")) ? setFillColor(true) : setFillColor(false);
      }
    })
  }, [fillColor]);

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

export default NavBarComponent;
//connect(mapStateToProps, mapDispatchToProps)