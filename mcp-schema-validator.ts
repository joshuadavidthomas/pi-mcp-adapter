import Ajv from "ajv";
import { AjvJsonSchemaValidator } from "@modelcontextprotocol/sdk/validation/ajv";

/**
 * MCP servers may publish JSON Schema with custom `format` annotations.
 * FastMCP/Pydantic commonly emits `format: "path"`, and other servers may
 * emit their own domain-specific formats.
 *
 * The MCP SDK compiles every tool outputSchema during `listTools()`. Its
 * default AJV instance validates formats, which logs unknown-format warnings
 * while compiling schemas. Those stderr writes can corrupt Pi's TUI.
 *
 * Treat `format` as annotation-only for MCP tool output validation. We still
 * validate ordinary JSON Schema constraints such as type, required, enum,
 * properties, items, and additionalProperties.
 */
export function createMcpOutputSchemaValidator(): AjvJsonSchemaValidator {
  const ajv = new Ajv({
    strict: false,
    validateFormats: false,
    validateSchema: false,
    allErrors: true,
  });

  return new AjvJsonSchemaValidator(ajv);
}
