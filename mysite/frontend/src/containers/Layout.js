import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import handleLogout from '../components/Logout';
import getUserName from '../utils/getUserName';

const Header = (props) => {
    const { location } = props;
    const username = getUserName();

    return (
        <Navbar collapseOnSelect expand='lg' bg='light'>
            <Navbar.Brand href='/'>矮人礦坑</Navbar.Brand>
            <Navbar.Toggle className='bg-brown' aria-controls='responsive-navbar-nav' />

            <Navbar.Collapse id='responsive-navbar-nav' className='justify-content-end'>
                <Nav className='mr-auto' activeKey={location.pathname}>
                    {username ? <Nav.Link href='/games/'>遊戲大廳</Nav.Link> : null}
                    <Nav.Link href='/tutorial/'>新手教學</Nav.Link>
                    <Nav.Link href='/rules/'>規則解說</Nav.Link>
                    {username ? <Nav.Link href='/account/history/'>遊玩紀錄</Nav.Link> : null}
                </Nav>
                <Nav>
                    {username ? (
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
        <div className={'min-vh-100'}>
            <header>
                <HeaderWithRouter />
            </header>
            <Container className={'body-container'}>{props.children}</Container>
            <footer className='text-muted py-2 bg-light d-flex align-items-center justify-content-center'>
                <div className={'text-muted small mr-3'}>2021 NTNU OOAD Project</div>
                <a href={'https://github.com/chiachun2491/NTNU_OOAD-Project'} className={'text-muted'}>
                    <FontAwesomeIcon icon={faGithub} />
                </a>
            </footer>
        </div>
    );
};

export default CustomLayout;
