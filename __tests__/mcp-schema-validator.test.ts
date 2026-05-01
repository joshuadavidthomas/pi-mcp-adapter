import { describe, expect, it, vi } from "vitest";
import { createMcpOutputSchemaValidator } from "../mcp-schema-validator.js";

describe("createMcpOutputSchemaValidator", () => {
  it("treats custom formats as annotations without logging AJV warnings", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const validator = createMcpOutputSchemaValidator().getValidator({
      type: "object",
      properties: {
        path: { type: "string", format: "path" },
      },
      required: ["path"],
    });

    expect(validator({ path: "/tmp/project" })).toMatchObject({ valid: true });
    expect(warn).not.toHaveBeenCalled();

    warn.mockRestore();
  });

  it("still validates ordinary JSON Schema constraints", () => {
    const validator = createMcpOutputSchemaValidator().getValidator({
      type: "object",
      properties: {
        path: { type: "string", format: "path" },
      },
      required: ["path"],
    });

    expect(validator({ path: 123 })).toMatchObject({ valid: false });
  });
});
