import React, { useState } from "react";
import { Card, Button, Badge, Alert } from "react-bootstrap";
import { API_BASE_URL } from "../../utils/constants";
import {
  formatDate,
  truncateText,
  copyToClipboard,
  formatNumber,
  getRelativeTime,
} from "../../utils/helpers";

function LinkCard({ link, onEdit, onDelete }) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyError, setCopyError] = useState(false);

  // Generate the full short URL
  const shortUrl = `${API_BASE_URL}/${link.shortCode}`;

  // Handle copying short URL to clipboard using utility function
  const handleCopyUrl = async () => {
    const success = await copyToClipboard(shortUrl);

    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } else {
      setCopyError(true);
      setTimeout(() => setCopyError(false), 2000);
    }
  };

  // Handle opening the original URL in new tab
  const handleOpenOriginal = () => {
    window.open(link.originalUrl, "_blank", "noopener,noreferrer");
  };

  // Handle visiting the short URL (for testing)
  const handleVisitShort = () => {
    window.open(shortUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="h-100 link-card">
      <Card.Body className="d-flex flex-column">
        {/* Success/Error messages */}
        {copySuccess && (
          <Alert variant="success" className="py-2 mb-2 small">
            ✅ URL copied to clipboard!
          </Alert>
        )}
        {copyError && (
          <Alert variant="danger" className="py-2 mb-2 small">
            ❌ Failed to copy URL
          </Alert>
        )}

        {/* Header with stats */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h6 className="text-primary mb-0 flex-grow-1">
            {truncateText(link.shortCode, 15)}
          </h6>
          <Badge bg="secondary" className="stats-badge ms-2">
            {formatNumber(link.clickCount)} click
            {link.clickCount !== 1 ? "s" : ""}
          </Badge>
        </div>

        {/* Short URL Section */}
        <div className="mb-3">
          <label className="form-label small text-secondary mb-1">
            Short URL
          </label>
          <div className="p-2 bg-dark rounded d-flex align-items-center">
            <code className="text-info flex-grow-1 me-2 small">
              {truncateText(shortUrl, 35)}
            </code>
            <div className="d-flex gap-1">
              <Button
                variant="outline-info"
                size="sm"
                onClick={handleCopyUrl}
                title="Copy to clipboard"
                style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
              >
                📋
              </Button>
              <Button
                variant="outline-success"
                size="sm"
                onClick={handleVisitShort}
                title="Test short URL"
                style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
              >
                🔗
              </Button>
            </div>
          </div>
        </div>

        {/* Original URL Section */}
        <div className="mb-3 flex-grow-1">
          <label className="form-label small text-secondary mb-1">
            Original URL
          </label>
          <div
            className="text-break p-2 bg-light rounded cursor-pointer border"
            onClick={handleOpenOriginal}
            title={`Click to open: ${link.originalUrl}`}
            style={{ cursor: "pointer", minHeight: "2.5rem" }}
          >
            <small className="text-dark">
              {truncateText(link.originalUrl, 80)}
            </small>
            {link.originalUrl.length > 80 && (
              <div className="mt-1">
                <small className="text-muted">Click to view full URL</small>
              </div>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="mb-3">
          <div className="row g-0">
            <div className="col-6">
              <small className="text-muted">
                <div className="mb-1">
                  <strong>Created:</strong>
                </div>
                <div className="text-primary">
                  {getRelativeTime(link.createdAt)}
                </div>
              </small>
            </div>
            <div className="col-6">
              <small className="text-muted">
                <div className="mb-1">
                  <strong>Updated:</strong>
                </div>
                <div className="text-secondary">
                  {link.updatedAt !== link.createdAt
                    ? getRelativeTime(link.updatedAt)
                    : "Never"}
                </div>
              </small>
            </div>
          </div>

          {/* Full dates on hover */}
          <div className="mt-2 pt-2 border-top">
            <small className="text-muted">
              <div title={formatDate(link.createdAt)}>
                <strong>Created:</strong>{" "}
                {formatDate(link.createdAt, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              {link.updatedAt !== link.createdAt && (
                <div title={formatDate(link.updatedAt)} className="mt-1">
                  <strong>Updated:</strong>{" "}
                  {formatDate(link.updatedAt, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </small>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-grid gap-2 mt-auto">
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={onEdit}
              className="flex-grow-1"
            >
              ✏️ Edit
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={onDelete}
              className="flex-grow-1"
            >
              🗑️ Delete
            </Button>
          </div>
          <Button
            variant="outline-success"
            size="sm"
            onClick={handleOpenOriginal}
            title="Open original URL in new tab"
          >
            🌐 Open Original URL
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default LinkCard;
