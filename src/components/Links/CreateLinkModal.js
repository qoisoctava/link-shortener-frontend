import React, { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";

function CreateLinkModal({ show, onHide, onCreate }) {
  const [formData, setFormData] = useState({
    originalUrl: "",
    customShortCode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    setError("");
    setLoading(true);

    try {
      await onCreate(formData);
      // Reset form on success
      setFormData({ originalUrl: "", customShortCode: "" });
      onHide();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ originalUrl: "", customShortCode: "" });
    setError("");
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create New Short Link</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Original URL *</Form.Label>
            <Form.Control
              type="url"
              name="originalUrl"
              value={formData.originalUrl}
              onChange={handleChange}
              placeholder="https://example.com/very-long-url"
              autoComplete="off"
              required
              autoFocus
            />
            <Form.Text className="text-muted">
              Enter the long URL you want to shorten
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Custom Short Code (Optional)</Form.Label>
            <Form.Control
              type="text"
              name="customShortCode"
              value={formData.customShortCode}
              onChange={handleChange}
              placeholder="my-custom-link"
              autoComplete="off"
              pattern="[a-zA-Z0-9_-]+"
              minLength={3}
              maxLength={20}
            />
            <Form.Text className="text-muted">
              3-20 characters, letters, numbers, hyphens, and underscores only.
              Leave empty for auto-generated code.
            </Form.Text>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Link"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default CreateLinkModal;
