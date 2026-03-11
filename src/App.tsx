import { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  platformTemplates,
  generateCommands,
  type PlatformTemplate,
  type FrameworkVersion,
} from "./templates";

const uuidSchema = z.string().uuid();

const PLATFORM_ORDER = [
  "ios",
  "android",
  "tvos",
  "androidtv",
  "firetv",
  "samsung",
  "lg",
];

function App() {
  const [appId, setAppId] = useState<string>("");
  const [appIdError, setAppIdError] = useState<string>("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(
    new Set(PLATFORM_ORDER),
  );
  const [selectedVersion, setSelectedVersion] =
    useState<FrameworkVersion>("v15");
  const [generatedTemplates, setGeneratedTemplates] = useState<
    PlatformTemplate[]
  >([]);
  const [copiedState, setCopiedState] = useState<{
    type: "line" | "group";
    platformId: string;
    groupIndex?: number;
    lineIndex?: number;
  } | null>(null);

  // Parse URL for id parameter on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlId = params.get("id");
    if (urlId) {
      setAppId(urlId);
      const result = uuidSchema.safeParse(urlId);
      if (result.success) {
        setAppIdError("");
      } else {
        setAppIdError("Invalid UUID format");
      }
    }
  }, []);

  // Generate commands when appId or version changes
  useEffect(() => {
    if (appId && !appIdError) {
      const templates = platformTemplates[selectedVersion];
      const generated = templates.map((template) =>
        generateCommands(template, appId),
      );
      setGeneratedTemplates(generated);
    } else {
      setGeneratedTemplates([]);
    }
  }, [appId, appIdError, selectedVersion]);

  const validateAppId = useCallback((value: string) => {
    const result = uuidSchema.safeParse(value);
    if (!value) {
      setAppIdError("");
      return;
    }
    if (!result.success) {
      setAppIdError("Invalid UUID format");
    } else {
      setAppIdError("");
    }
  }, []);

  const handleAppIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAppId(value);
    validateAppId(value);
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(platformId)) {
        next.delete(platformId);
      } else {
        next.add(platformId);
      }
      return next;
    });
  };

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, []);

  const handleCopyLine = useCallback(
    async (platformId: string, command: string, lineIndex: number) => {
      await copyToClipboard(command);
      setCopiedState({ type: "line", platformId, lineIndex });
      setTimeout(() => setCopiedState(null), 2000);
    },
    [copyToClipboard],
  );

  const handleCopyGroup = useCallback(
    async (platformId: string, commands: string[], groupIndex: number) => {
      const combined = commands.join(" && ");
      await copyToClipboard(combined);
      setCopiedState({ type: "group", platformId, groupIndex });
      setTimeout(() => setCopiedState(null), 2000);
    },
    [copyToClipboard],
  );

  const isCopied = (
    type: "line" | "group",
    platformId: string,
    groupIndex?: number,
    lineIndex?: number,
  ) => {
    if (
      !copiedState ||
      copiedState.type !== type ||
      copiedState.platformId !== platformId
    ) {
      return false;
    }
    if (type === "group") {
      return copiedState.groupIndex === groupIndex;
    }
    return copiedState.lineIndex === lineIndex;
  };

  const filteredTemplates = generatedTemplates.filter((t) =>
    selectedPlatforms.has(t.id),
  );

  // Sort templates according to PLATFORM_ORDER
  filteredTemplates.sort(
    (a, b) => PLATFORM_ORDER.indexOf(a.id) - PLATFORM_ORDER.indexOf(b.id),
  );

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center">Applicaster Preparation Generator</h1>
          <p className="text-center text-muted">
            Generate terminal commands for personal macOS workflows
          </p>
        </Col>
      </Row>

      {/* Input Section */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>APP_ID (UUID)</Form.Label>
            <Form.Control
              type="text"
              placeholder="dae0baf4-262d-41b0-9044-37de74982a6f"
              value={appId}
              onChange={handleAppIdChange}
              isInvalid={!!appIdError}
            />
            <Form.Control.Feedback type="invalid">
              {appIdError}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Framework Version</Form.Label>
            <Form.Select
              value={selectedVersion}
              onChange={(e) =>
                setSelectedVersion(e.target.value as FrameworkVersion)
              }
            >
              <option value="v15">v15</option>
              <option value="v14">v14</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* Platform Selection */}
      <Row className="mb-4">
        <Col>
          <Form.Label>Select Platforms</Form.Label>
          <div className="d-flex flex-wrap gap-2">
            {PLATFORM_ORDER.map((platformId) => {
              const template = platformTemplates[selectedVersion].find(
                (t) => t.id === platformId,
              );
              return (
                <Button
                  key={platformId}
                  variant={
                    selectedPlatforms.has(platformId)
                      ? "primary"
                      : "outline-primary"
                  }
                  size="sm"
                  onClick={() => togglePlatform(platformId)}
                >
                  {template?.name || platformId}
                </Button>
              );
            })}
          </div>
        </Col>
      </Row>

      {/* Generated Commands */}
      {filteredTemplates.length > 0 && !appIdError && (
        <Row>
          <Col>
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="mb-4">
                <Card.Header>
                  <h4 className="mb-0">{template.name}</h4>
                </Card.Header>
                <Card.Body>
                  {template.groups.map((group, groupIndex) => (
                    <div key={group.name} className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="mb-0">{group.name}</h5>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() =>
                            handleCopyGroup(
                              template.id,
                              group.commands,
                              groupIndex,
                            )
                          }
                        >
                          {isCopied("group", template.id, groupIndex) ? (
                            <>
                              <span className="text-success">✓ Copied!</span>
                            </>
                          ) : (
                            "Copy All"
                          )}
                        </Button>
                      </div>
                      <div className="bg-light p-3 rounded">
                        {group.commands.map((command, lineIndex) => (
                          <div
                            key={lineIndex}
                            className="d-flex justify-content-between align-items-start py-1 border-bottom border-light"
                          >
                            <code className="text-dark">{command}</code>
                            <Button
                              variant="link"
                              size="sm"
                              className="text-decoration-none"
                              onClick={() =>
                                handleCopyLine(template.id, command, lineIndex)
                              }
                            >
                              {isCopied(
                                "line",
                                template.id,
                                groupIndex,
                                lineIndex,
                              ) ? (
                                <Badge bg="success">Copied!</Badge>
                              ) : (
                                <Badge bg="secondary">Copy</Badge>
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
      )}

      {/* Empty state when no APP_ID or invalid */}
      {(!appId || appIdError) && (
        <Row>
          <Col>
            <Card className="text-center py-5">
              <Card.Body>
                <h5 className="text-muted">
                  {appIdError
                    ? "Please enter a valid UUID"
                    : "Enter an APP_ID to generate commands"}
                </h5>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default App;
