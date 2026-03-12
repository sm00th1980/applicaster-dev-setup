import { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  platformTemplates,
  generateCommands,
  type PlatformTemplate,
  type QuickBrickVersion,
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

  const [selectedPlatform, setSelectedPlatform] = useState<string>(
    PLATFORM_ORDER[0],
  );

  const [selectedVersion, setSelectedVersion] =
    useState<QuickBrickVersion>("v15");
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

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, []);

  const handleCopyLine = useCallback(
    async (
      platformId: string,
      command: string,
      lineIndex: number,
      groupIndex: number,
    ) => {
      await copyToClipboard(command);
      setCopiedState({ type: "line", platformId, lineIndex, groupIndex });
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

    if (type === "line") {
      return (
        copiedState.groupIndex === groupIndex &&
        copiedState.lineIndex === lineIndex
      );
    }

    return false;
  };

  const chosenTemplate = generatedTemplates.filter(
    (t) => selectedPlatform === t.id,
  )[0];

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center">Applicaster Dev Setup</h1>
          <p className="text-center text-muted">
            Generate terminal commands for setup QuickBrick projects
          </p>
        </Col>
      </Row>

      {/* Input Section */}
      <Row className="mb-4">
        <Col md={4}>
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
        <Col md={4}>
          <Form.Group>
            <Form.Label>Platform</Form.Label>
            <Form.Select
              value={selectedPlatform}
              onChange={(e) => {
                setSelectedPlatform(e.target.value);
              }}
            >
              {PLATFORM_ORDER.map((platformId) => (
                <option value={platformId} key={platformId}>
                  {platformId}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>QuickBrick Version</Form.Label>
            <Form.Select
              value={selectedVersion}
              onChange={(e) =>
                setSelectedVersion(e.target.value as QuickBrickVersion)
              }
            >
              <option value="v15" key="v15">
                v15
              </option>
              <option value="v14" key="v14">
                v14
              </option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* Generated Commands */}
      {chosenTemplate &&
        !appIdError &&
        chosenTemplate.groups.map((group, groupIndex) => (
          <Row key={groupIndex}>
            <Col>
              <Card key={groupIndex} className="mb-4">
                <Card.Header>
                  <Row>
                    <Col md={12} className="d-flex justify-content-between">
                      <div className="d-flex align-items-center">
                        <h6 className="mb-0">{group.name}</h6>
                      </div>

                      {isCopied("group", chosenTemplate.id, groupIndex) ? (
                        <Button variant="outline-secondary" size="sm">
                          Copied as group!
                        </Button>
                      ) : (
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() =>
                            handleCopyGroup(
                              chosenTemplate.id,
                              group.commands,
                              groupIndex,
                            )
                          }
                        >
                          Copy as group
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Card.Header>

                <Card.Body>
                  <div key={groupIndex} className="mb-4">
                    {group.commands.map((command, lineIndex) => (
                      <InputGroup className="mb-3" key={lineIndex}>
                        <Form.Control readOnly value={command} />
                        {isCopied(
                          "line",
                          chosenTemplate.id,
                          groupIndex,
                          lineIndex,
                        ) ? (
                          <Button variant="outline-success" size="sm">
                            Copied!
                          </Button>
                        ) : (
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() =>
                              handleCopyLine(
                                chosenTemplate.id,
                                command,
                                lineIndex,
                                groupIndex,
                              )
                            }
                          >
                            Copy
                          </Button>
                        )}
                      </InputGroup>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ))}

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
