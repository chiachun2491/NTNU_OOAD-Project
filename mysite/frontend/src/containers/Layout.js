import React from 'react';

import {Container, Nav, Navbar, NavDropdown, Button} from "react-bootstrap";
import {withRouter} from 'react-router-dom';
import CustomButton from "../components/CustomButton";
import handleLogout from "../components/Logout";

const Header = (props) => {
    const {location} = props;

    const username = localStorage.getItem('username');
    let dynamicNav = <div/>;
    if (username != null) {
        dynamicNav =
            <React.Fragment>
                <Nav className="mr-auto" activeKey={location.pathname}>
                    <Nav.Link href="/games/">Lobby</Nav.Link>
                    <Nav.Link href="/account/">Account</Nav.Link>
                </Nav>
                <Nav>
                    <Button onClick={handleLogout} variant={'brown'} className={'my-2 my-lg-0'}>登出 {username}</Button>
                </Nav>
            </React.Fragment>
        ;
    } else {
        dynamicNav = <Nav>
            <Button href={'/account/signup/'} variant={'outline-brown'} className={'my-2 my-lg-0 mr-lg-2'}>註冊</Button>
            <Button href={'/account/login/'} variant={'brown'} className={'my-2 my-lg-0 '}>登入</Button>
        </Nav>;
    }

    return (
        <Navbar collapseOnSelect expand="lg" bg='light'>
            <Navbar.Brand href="/">矮人礦坑</Navbar.Brand>
            <Navbar.Toggle className="bg-brown" aria-controls="responsive-navbar-nav"/>

            <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                {dynamicNav}
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