import React from "react";
import { Container } from "react-bootstrap";
import AppNavbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <AppNavbar />
      <Container className="flex-grow-1">{children}</Container>
      <footer className="text-center py-3 mt-5 border-top">
        <small className="text-secondary">
          OCTAVA © 2025 LinkShortener. No rights reserved.
        </small>
      </footer>
    </div>
  );
}

export default Layout;
