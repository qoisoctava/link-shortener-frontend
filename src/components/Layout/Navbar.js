import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import authService from "../../services/auth";
import { ROUTES } from "../../utils/constants";

function AppNavbar() {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to={ROUTES.HOME}>
          🔗 LinkShortener
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to={ROUTES.DASHBOARD}>
                  Dashboard
                </Nav.Link>
                <Nav.Item className="d-flex align-items-center px-3 text-secondary">
                  {user?.email}
                </Nav.Item>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to={ROUTES.LOGIN}>
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to={ROUTES.REGISTER}>
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
