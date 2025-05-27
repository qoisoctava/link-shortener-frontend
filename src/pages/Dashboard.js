import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import linkService from "../services/linkService";
import CreateLinkModal from "../components/Links/CreateLinkModal";
import LinkCard from "../components/Links/LinkCard";
import EditLinkModal from "../components/Links/EditLinkModal";

function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLink, setEditingLink] = useState(null);

  // Load links on component mount
  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      setLoading(true);
      const data = await linkService.getLinks();
      setLinks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLink = async (linkData) => {
    try {
      const newLink = await linkService.createLink(
        linkData.originalUrl,
        linkData.customShortCode
      );

      // Add new link to the beginning of the list
      setLinks([newLink, ...links]);
      setShowCreateModal(false);
      setSuccess("Link created successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      throw err; // Let modal handle the error
    }
  };

  const handleEditLink = async (id, linkData) => {
    try {
      const updatedLink = await linkService.updateLink(id, linkData);

      // Update link in the list
      setLinks(links.map((link) => (link.id === id ? updatedLink : link)));

      setShowEditModal(false);
      setEditingLink(null);
      setSuccess("Link updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteLink = async (id) => {
    if (!window.confirm("Are you sure you want to delete this link?")) {
      return;
    }

    try {
      await linkService.deleteLink(id);
      setLinks(links.filter((link) => link.id !== id));
      setSuccess("Link deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const openEditModal = (link) => {
    setEditingLink(link);
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1 className="h2">My Links</h1>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            + Create New Link
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {links.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <h5 className="text-muted mb-3">No links yet</h5>
            <p className="text-muted">
              Create your first short link to get started!
            </p>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              Create Your First Link
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {links.map((link) => (
            <Col key={link.id} lg={6} className="mb-3">
              <LinkCard
                link={link}
                onEdit={() => openEditModal(link)}
                onDelete={() => handleDeleteLink(link.id)}
              />
            </Col>
          ))}
        </Row>
      )}

      <CreateLinkModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onCreate={handleCreateLink}
      />

      <EditLinkModal
        show={showEditModal}
        onHide={() => {
          setShowEditModal(false);
          setEditingLink(null);
        }}
        onUpdate={handleEditLink}
        link={editingLink}
      />
    </Container>
  );
}

export default Dashboard;
