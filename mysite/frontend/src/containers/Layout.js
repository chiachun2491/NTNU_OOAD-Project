import React from 'react';

import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import { withRouter } from 'react-router-dom';

const Header = (props) => {
    const {location} = props;
    return (
        <Navbar collapseOnSelect expand="lg" bg='light'>
            <Navbar.Brand href="/">矮人礦坑</Navbar.Brand>
            <Navbar.Toggle className="bg-brown" aria-controls="responsive-navbar-nav"/>

            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto" activeKey={location.pathname}>

                    <Nav.Link href="/games/">Lobby</Nav.Link>
                    <Nav.Link href="/profile/">Profile</Nav.Link>
                    {/*<NavDropdown title="Dropdown" id="collasible-nav-dropdown">*/}
                    {/*    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>*/}
                    {/*    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>*/}
                    {/*    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>*/}
                    {/*    <NavDropdown.Divider/>*/}
                    {/*    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>*/}
                    {/*</NavDropdown>*/}
                </Nav>
                {/*<Nav>*/}
                {/*    <Nav.Link href="#deets">More deets</Nav.Link>*/}
                {/*    <Nav.Link eventKey={2} href="#memes">*/}
                {/*        Dank memes*/}
                {/*    </Nav.Link>*/}
                {/*</Nav>*/}
            </Navbar.Collapse>
        </Navbar>
    );
};

const HeaderWithRouter = withRouter(Header);

const CustomLayout = (props) => {
    return (
        <div>
            <header>
                <HeaderWithRouter/>
            </header>
            <Container>
                {props.children}
            </Container>
            <footer className='text-muted text-center py-2'>
                <Container>
                    <p>2021 NTNU OOAD Project</p>
                </Container>
            </footer>
        </div>
    );
};


export default CustomLayout;