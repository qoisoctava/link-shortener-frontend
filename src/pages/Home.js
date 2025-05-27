import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import authService from "../services/auth";
import { ROUTES } from "../utils/constants";

function Home() {
  const isAuthenticated = authService.isAuthenticated();

  return (
    <div>
      {/* Hero Section */}
      <section className="py-5 text-center">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-4">
                Shorten Your Links,{" "}
                <span className="text-primary">Amplify Your Reach</span>
              </h1>
              <p className="lead mb-5">
                Create short, memorable links in seconds. Track clicks, manage
                your URLs, and share with confidence. No ads, no hassle, just
                powerful link management.
              </p>

              {isAuthenticated ? (
                <Link to={ROUTES.DASHBOARD}>
                  <Button variant="primary" size="lg" className="px-5">
                    Go to Dashboard →
                  </Button>
                </Link>
              ) : (
                <div className="d-flex gap-3 justify-content-center">
                  <Link to={ROUTES.REGISTER}>
                    <Button variant="primary" size="lg" className="px-5">
                      Get Started Free
                    </Button>
                  </Link>
                  <Link to={ROUTES.LOGIN}>
                    <Button variant="outline-light" size="lg" className="px-5">
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <Row className="g-4">
            <Col md={4}>
              <div className="text-center">
                <div className="mb-3">
                  <span style={{ fontSize: "3rem" }}>🚀</span>
                </div>
                <h4>Lightning Fast</h4>
                <p className="text-secondary">
                  Create short links instantly. No waiting, no complex setup.
                  Just paste your URL and go.
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div className="text-center">
                <div className="mb-3">
                  <span style={{ fontSize: "3rem" }}>📊</span>
                </div>
                <h4>Track Performance</h4>
                <p className="text-secondary">
                  See how many clicks your links get. Understand your audience
                  and optimize your sharing strategy.
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div className="text-center">
                <div className="mb-3">
                  <span style={{ fontSize: "3rem" }}>🎨</span>
                </div>
                <h4>Custom Links</h4>
                <p className="text-secondary">
                  Create branded short links with custom endings. Make your
                  links memorable and professional.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 text-center">
        <Container>
          <h2 className="mb-4">Ready to Start Shortening?</h2>
          <p className="lead mb-4">
            Join thousands of users who trust our platform for their link
            management needs.
          </p>
          {!isAuthenticated && (
            <Link to={ROUTES.REGISTER}>
              <Button variant="primary" size="lg">
                Create Your Free Account
              </Button>
            </Link>
          )}
        </Container>
      </section>
    </div>
  );
}

export default Home;
