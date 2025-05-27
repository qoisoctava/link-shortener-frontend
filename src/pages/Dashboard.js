import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Form,
  InputGroup,
} from "react-bootstrap";
import linkService from "../services/linkService"; // Ensure this matches your actual file name exactly
import CreateLinkModal from "../components/Links/CreateLinkModal";
import LinkCard from "../components/Links/LinkCard";
import EditLinkModal from "../components/Links/EditLinkModal";
import Loading from "../components/Loading";
import { formatNumber, debounce } from "../utils/helpers";
import authService from "../services/auth";

function Dashboard() {
  const [links, setLinks] = useState([]);
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("created"); // created, clicks, updated
  const [sortOrder, setSortOrder] = useState("desc"); // asc, desc

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLink, setEditingLink] = useState(null);

  // Get current user
  const user = authService.getCurrentUser();

  // Load links function
  const loadLinks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await linkService.getLinks();
      setLinks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading links:", err);
      setError(err.message || "Failed to load links. Please try again.");
      setLinks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter and sort function
  const filterAndSortLinks = useCallback(() => {
    let filtered = [...links];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (link) =>
          link.originalUrl.toLowerCase().includes(term) ||
          link.shortCode.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "clicks":
          aValue = a.clickCount;
          bValue = b.clickCount;
          break;
        case "updated":
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
          break;
        case "created":
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredLinks(filtered);
  }, [links, searchTerm, sortBy, sortOrder]);

  // Create debounced search function
  const debouncedSetSearchTerm = useMemo(
    () => debounce((term) => setSearchTerm(term), 300),
    []
  );

  // Load links on component mount
  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  // Filter and sort links when dependencies change
  useEffect(() => {
    filterAndSortLinks();
  }, [filterAndSortLinks]);

  // Handle search input change
  const handleSearchChange = useCallback(
    (e) => {
      debouncedSetSearchTerm(e.target.value);
    },
    [debouncedSetSearchTerm]
  );

  // Link management functions
  const handleCreateLink = async (linkData) => {
    try {
      const newLink = await linkService.createLink(
        linkData.originalUrl,
        linkData.customShortCode
      );

      setLinks((prevLinks) => [newLink, ...prevLinks]);
      setShowCreateModal(false);
      showSuccessMessage("Link created successfully! 🎉");
    } catch (err) {
      throw err; // Let modal handle the error
    }
  };

  const handleEditLink = async (id, linkData) => {
    try {
      const updatedLink = await linkService.updateLink(id, linkData);

      setLinks((prevLinks) =>
        prevLinks.map((link) => (link.id === id ? updatedLink : link))
      );

      setShowEditModal(false);
      setEditingLink(null);
      showSuccessMessage("Link updated successfully! ✅");
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteLink = async (id) => {
    const linkToDelete = links.find((link) => link.id === id);
    const confirmMessage = `Are you sure you want to delete the link "${linkToDelete?.shortCode}"?\n\nThis action cannot be undone and will break any existing links.`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      await linkService.deleteLink(id);
      setLinks((prevLinks) => prevLinks.filter((link) => link.id !== id));
      showSuccessMessage("Link deleted successfully! 🗑️");
    } catch (err) {
      setError(err.message || "Failed to delete link. Please try again.");
    }
  };

  // Modal functions
  const openEditModal = useCallback((link) => {
    setEditingLink(link);
    setShowEditModal(true);
  }, []);

  // Utility functions
  const showSuccessMessage = useCallback((message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 4000);
  }, []);

  const clearError = useCallback(() => setError(""), []);
  const clearSuccess = useCallback(() => setSuccess(""), []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    // Clear the input field
    const searchInput = document.querySelector('input[placeholder*="Search"]');
    if (searchInput) {
      searchInput.value = "";
    }
  }, []);

  // Calculate statistics
  const statistics = useMemo(() => {
    const totalClicks = links.reduce((sum, link) => sum + link.clickCount, 0);
    const activeLinks = links.length;

    return {
      totalClicks,
      activeLinks,
      averageClicks:
        activeLinks > 0 ? Math.round(totalClicks / activeLinks) : 0,
    };
  }, [links]);

  if (loading) {
    return <Loading.Page message="Loading your links..." />;
  }

  return (
    <Container>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h1 className="h2 mb-1">My Links</h1>
              <p className="text-muted mb-0">
                Welcome back, {user?.email}!
                {statistics.activeLinks > 0 && (
                  <span className="ms-2">
                    {formatNumber(statistics.activeLinks)} link
                    {statistics.activeLinks !== 1 ? "s" : ""} •{" "}
                    {formatNumber(statistics.totalClicks)} total click
                    {statistics.totalClicks !== 1 ? "s" : ""}
                  </span>
                )}
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              className="flex-shrink-0"
            >
              + Create New Link
            </Button>
          </div>
        </Col>
      </Row>

      {/* Statistics Cards */}
      {statistics.activeLinks > 0 && (
        <Row className="mb-4">
          <Col md={4}>
            <Card className="text-center">
              <Card.Body>
                <h4 className="text-primary mb-1">
                  {formatNumber(statistics.activeLinks)}
                </h4>
                <small className="text-muted">Active Links</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center">
              <Card.Body>
                <h4 className="text-success mb-1">
                  {formatNumber(statistics.totalClicks)}
                </h4>
                <small className="text-muted">Total Clicks</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center">
              <Card.Body>
                <h4 className="text-info mb-1">{statistics.averageClicks}</h4>
                <small className="text-muted">Avg. Clicks per Link</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Alerts */}
      {error && (
        <Alert
          variant="danger"
          dismissible
          onClose={clearError}
          className="mb-4"
        >
          <Alert.Heading className="h6">Error</Alert.Heading>
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          variant="success"
          dismissible
          onClose={clearSuccess}
          className="mb-4"
        >
          {success}
        </Alert>
      )}

      {/* Search and Filter Controls */}
      {statistics.activeLinks > 0 && (
        <Card className="mb-4">
          <Card.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label className="small text-muted">
                  Search Links
                </Form.Label>
                <InputGroup size="sm">
                  <InputGroup.Text>🔍</InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search by URL or short code..."
                    onChange={handleSearchChange}
                  />
                </InputGroup>
              </Col>
              <Col md={3}>
                <Form.Label className="small text-muted">Sort By</Form.Label>
                <Form.Select
                  size="sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="created">Date Created</option>
                  <option value="updated">Last Updated</option>
                  <option value="clicks">Click Count</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Label className="small text-muted">Order</Form.Label>
                <Form.Select
                  size="sm"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </Form.Select>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Links Grid */}
      {filteredLinks.length === 0 && !loading ? (
        <Card>
          <Card.Body className="text-center py-5">
            {searchTerm ? (
              <>
                <h5 className="text-muted mb-3">No links found</h5>
                <p className="text-muted">
                  No links match your search for "<strong>{searchTerm}</strong>
                  ".
                  <br />
                  Try a different search term or create a new link.
                </p>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={clearSearch}
                  className="me-2"
                >
                  Clear Search
                </Button>
              </>
            ) : (
              <>
                <div className="mb-3" style={{ fontSize: "3rem" }}>
                  🔗
                </div>
                <h5 className="text-muted mb-3">No links yet</h5>
                <p className="text-muted mb-4">
                  Create your first short link to get started!
                  <br />
                  Short links are perfect for sharing on social media, emails,
                  and presentations.
                </p>
              </>
            )}
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              Create Your First Link
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {filteredLinks.map((link) => (
            <Col key={link.id} lg={6} xl={4} className="mb-4">
              <LinkCard
                link={link}
                onEdit={() => openEditModal(link)}
                onDelete={() => handleDeleteLink(link.id)}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Search Results Info */}
      {searchTerm && filteredLinks.length > 0 && (
        <div className="text-center mt-4">
          <small className="text-muted">
            Showing {formatNumber(filteredLinks.length)} of{" "}
            {formatNumber(statistics.activeLinks)} links
            {searchTerm && ` matching "${searchTerm}"`}
          </small>
        </div>
      )}

      {/* Modals */}
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
