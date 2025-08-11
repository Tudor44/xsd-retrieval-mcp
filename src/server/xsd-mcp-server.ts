#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";

import { retrieveXSD, RetrieveXSDArgs } from "../utils/xsd-retriever.js";
import { validateXSD } from "../utils/xsd-validator.js";
import { analyzeXSDElements } from "../utils/xsd-analyzer.js";

// Define argument types for clarity and type safety
interface ValidateXSDArgs {
  xsd_content: string;
}

interface ListXSDElementsArgs {
  xsd_content: string;
}

class XSDRetrievalServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "xsd-retrieval-server",
        version: "0.1.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "retrieve_xsd",
            description: "Retrieve an XSD file from a URL or file path",
            inputSchema: {
              type: "object",
              properties: {
                source: {
                  type: "string",
                  description: "URL or file path to the XSD file",
                },
                save_path: {
                  type: "string",
                  description: "Optional local path to save the retrieved XSD",
                },
              },
              required: ["source"],
            },
          },
          {
            name: "validate_xsd",
            description: "Validate if the retrieved content is a valid XSD",
            inputSchema: {
              type: "object",
              properties: {
                xsd_content: {
                  type: "string",
                  description: "XSD content to validate",
                },
              },
              required: ["xsd_content"],
            },
          },
          {
            name: "list_xsd_elements",
            description: "Extract and list elements defined in an XSD",
            inputSchema: {
              type: "object",
              properties: {
                xsd_content: {
                  type: "string",
                  description: "XSD content to analyze",
                },
              },
              required: ["xsd_content"],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (!request.params.arguments) {
        throw new McpError(
          ErrorCode.InvalidParams,
          "Tool arguments are required."
        );
      }
      switch (request.params.name) {
        case "retrieve_xsd":
          return await this.retrieveXSD(request.params.arguments as unknown as RetrieveXSDArgs);
        
        case "validate_xsd":
          return await this.validateXSD(request.params.arguments as unknown as ValidateXSDArgs);
        
        case "list_xsd_elements":
          return await this.listXSDElements(request.params.arguments as unknown as ListXSDElementsArgs);
        
        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${request.params.name}`
          );
      }
    });
  }

  private async retrieveXSD(args: RetrieveXSDArgs) {
    try {
      const result = await retrieveXSD(args);
      const { source, save_path } = args;

      return {
        content: [
          {
            type: "text",
            text: `Successfully retrieved XSD from: ${source}\n\n` +
                  `Content length: ${result.content.length} characters\n` +
                  (save_path && result.savedToFile ? `Saved to: ${save_path}\n` : '') +
                  `\nXSD Content:\n${result.content}`,
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to retrieve XSD from '${args.source}'. Reason: ${errorMessage}`
      );
    }
  }

  private async validateXSD(args: ValidateXSDArgs) {
    try {
      const validationResult = validateXSD(args.xsd_content);
      
      return {
        content: [
          {
            type: "text",
            text: `XSD Validation Result:\n\n` +
                  `Valid XSD: ${validationResult.isValid}\n` +
                  `Has XML Declaration: ${validationResult.hasXMLDeclaration}\n` +
                  `Has Schema Element: ${validationResult.hasSchemaElement}\n` +
                  `Namespaces Found: ${validationResult.namespaces.length}\n` +
                  `Elements Defined: ${validationResult.elements.length}\n\n` +
                  `Namespaces:\n${validationResult.namespaces.map(ns => `  - ${ns}`).join('\n')}\n\n` +
                  `Elements:\n${validationResult.elements.map(el => `  - ${el}`).join('\n')}`,
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to validate XSD. Reason: ${errorMessage}`
      );
    }
  }

  private async listXSDElements(args: ListXSDElementsArgs) {
    try {
      const analysisResult = analyzeXSDElements(args.xsd_content);
      
      return {
        content: [
          {
            type: "text",
            text: `XSD Analysis Results:\n\n` +
                  `Elements (${analysisResult.elements.length}):\n` +
                  analysisResult.elements.map(el =>
                    `  - ${el.name} (type: ${el.type}, min: ${el.minOccurs}, max: ${el.maxOccurs})`
                  ).join('\n') + '\n\n' +
                  `Complex Types (${analysisResult.complexTypes.length}):\n` +
                  analysisResult.complexTypes.map(ct => `  - ${ct}`).join('\n') + '\n\n' +
                  `Simple Types (${analysisResult.simpleTypes.length}):\n` +
                  analysisResult.simpleTypes.map(st => `  - ${st}`).join('\n'),
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to analyze XSD. Reason: ${errorMessage}`
      );
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("XSD Retrieval MCP server running on stdio");
  }
}

const server = new XSDRetrievalServer();
server.run().catch(console.error);