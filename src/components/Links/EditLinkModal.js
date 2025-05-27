import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";

function EditLinkModal({ show, onHide, onUpdate, link }) {
  const [formData, setFormData] = useState({
    originalUrl: "",
    customShortCode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Update form when link prop changes
  useEffect(() => {
    if (link) {
      setFormData({
        originalUrl: link.originalUrl,
        customShortCode: link.shortCode,
      });
    }
  }, [link]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if anything changed
    const hasChanges =
      formData.originalUrl !== link.originalUrl ||
      formData.customShortCode !== link.shortCode;

    if (!hasChanges) {
      onHide();
      return;
    }

    setError("");
    setLoading(true);

    try {
      const updateData = {};

      if (formData.originalUrl !== link.originalUrl) {
        updateData.originalUrl = formData.originalUrl;
      }

      if (formData.customShortCode !== link.shortCode) {
        updateData.customShortCode = formData.customShortCode;
      }

      await onUpdate(link.id, updateData);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    onHide();
  };

  if (!link) return null;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Link</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Original URL</Form.Label>
            <Form.Control
              type="url"
              name="originalUrl"
              value={formData.originalUrl}
              onChange={handleChange}
              placeholder="https://example.com"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Short Code</Form.Label>
            <Form.Control
              type="text"
              name="customShortCode"
              value={formData.customShortCode}
              onChange={handleChange}
              pattern="[a-zA-Z0-9_-]+"
              minLength={3}
              maxLength={20}
              required
            />
            <Form.Text className="text-muted">
              Changing the short code will break existing links using the old
              code.
            </Form.Text>
          </Form.Group>

          <div className="text-muted small">
            <strong>Click Count:</strong> {link.clickCount}
            <br />
            <strong>Created:</strong>{" "}
            {new Date(link.createdAt).toLocaleString()}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Link"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default EditLinkModal;
