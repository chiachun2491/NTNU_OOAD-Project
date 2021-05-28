import React from 'react';

import { Container, Nav, Navbar, Button, NavDropdown } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import handleLogout from '../components/Logout';

const Header = (props) => {
    const { location } = props;
    const username = localStorage.getItem('username');

    return (
        <Navbar collapseOnSelect expand='lg' bg='light'>
            <Navbar.Brand href='/'>矮人礦坑</Navbar.Brand>
            <Navbar.Toggle className='bg-brown' aria-controls='responsive-navbar-nav' />

            <Navbar.Collapse id='responsive-navbar-nav' className='justify-content-end'>
                <Nav className='mr-auto' activeKey={location.pathname}>
                    {username !== null ? <Nav.Link href='/games/'>遊戲大廳</Nav.Link> : null}
                    <Nav.Link href='/tutorial/'>新手教學</Nav.Link>
                    <Nav.Link href='/rules/'>規則解說</Nav.Link>
                    {username !== null ? <Nav.Link href='/account/history/'>遊玩紀錄</Nav.Link> : null}
                </Nav>
                <Nav>
                    {username !== null ? (
                        <Button onClick={handleLogout} variant={'brown'} className={'my-2 my-lg-0'}>
                            登出 {username}
                        </Button>
                    ) : (
                        <>
                            <Button
                                href={'/account/signup/'}
                                variant={'outline-brown'}
                                className={'my-2 my-lg-0 mr-lg-2'}>
                                註冊
                            </Button>
                            <Button href={'/account/login/'} variant={'brown'} className={'my-2 my-lg-0 '}>
                                登入
                            </Button>
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

const HeaderWithRouter = withRouter(Header);

const CustomLayout = (props) => {
    return (
        <div>
            <header>
                <HeaderWithRouter />
            </header>
            <Container>{props.children}</Container>
            <footer className='text-muted text-center py-2'>
                <Container>
                    <p>2021 NTNU OOAD Project</p>
                </Container>
            </footer>
        </div>
    );
};

export default CustomLayout;
