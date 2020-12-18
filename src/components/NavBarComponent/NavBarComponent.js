import React, { useState, useEffect } from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

import './NavBarComponent.css';

import ZoomInOUTComponent from '../ZoomInOUTComponent/ZoomInOUTComponent';

const NavBarComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fillColor, setFillColor] = useState(false);

  const { REACT_APP_BASE_URL, REACT_APP_UNTAGGED_PEOPLE_API } = process.env;
  /**
   * Fetches the Unknown tag people data.
   * If the data is available a Red notification dot is displayed implying that there are unknown people to tag
   * It is determined by the property of fillColor.
   * @param  {} (
   */
  useEffect(() => {
    fetch(REACT_APP_BASE_URL + REACT_APP_UNTAGGED_PEOPLE_API).then(res => res.ok ? res.json() : null).then(res => {
      if (res) {
        (res.length > 0 && !window.location.pathname.includes("feedback")) ? setFillColor(true) : setFillColor(false);
      }
    })
  }, [fillColor, REACT_APP_BASE_URL, REACT_APP_UNTAGGED_PEOPLE_API]);

  return (
    <div className="navContainer">
      <Navbar dark expand="md">
        <NavbarBrand href="/">
          <img src="/logo.png" width="60px" height="25px" style={{ paddingTop: '0px' }} alt="" />
        </NavbarBrand>
        <NavbarToggler onClick={() => setIsOpen(!isOpen)} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="/">Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/feedback">Feedback
              <span className="redNotiDot">
                  <svg height="10" width="10">
                    <circle cx="5" cy="5" r="3"
                      fill={fillColor ? "red" : "#2C4870"}
                    />
                  </svg>
                </span>
              </NavLink>
            </NavItem>
          </Nav>
          {/**
           * 
           */}
          {!window.location.pathname.includes('feedback') ?
            <ZoomInOUTComponent /> : <></>
          }
        </Collapse>
      </Navbar>
    </div>
  );
};

export default NavBarComponent;