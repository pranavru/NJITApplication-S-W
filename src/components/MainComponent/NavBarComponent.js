import React from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, NavbarText } from 'reactstrap';

export const NavBarComponent = (props) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div style={{ font: '1.2em monospace', backgroundColor: "#2C4870"}}>
      <Navbar dark expand="md">
        <NavbarBrand href="/home">Vuzix Blade</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="/home">Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/feedback">Feedback</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};
