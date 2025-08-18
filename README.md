# XSD Retrieval MCP Server

A Model Context Protocol (MCP) server for retrieving and analyzing XSD (XML Schema Definition) files.

## Description

This MCP server provides tools for retrieving XSD files from URLs or local paths, validating them, and analyzing their elements. Integrates with any LLM model.

## Features

The server provides the following MCP tools:

1. **retrieve_xsd** - Retrieve an XSD file from a URL or file path
2. **validate_xsd** - Validate if the retrieved content is a valid XSD
3. **list_xsd_elements** - List elements defined in an XSD
4. **get_mcp_server_info** - Get MCP server information including name and version (v1.2.0+)

## Installation

```bash
npm install
npm run build
```

## Usage

To run the server:

```bash
npm start
```

The server communicates via stdio and can be integrated with any MCP-compatible client.

### Tool: retrieve_xsd

Retrieves an XSD file from a URL or local path.

Parameters:
- `source` (string, required): URL or file path to the XSD file
- `save_path` (string, optional): Local path where to save the retrieved XSD file

### Tool: validate_xsd

Validates if the provided content is a valid XSD.

Parameters:
- `xsd_content` (string, required): XSD content to validate

### Tool: list_xsd_elements

Lists elements defined in an XSD.

Parameters:
- `xsd_content` (string, required): XSD content to analyze

### Tool: get_mcp_server_info

Get MCP server information including name and version.

Parameters:
- None

## Recent Improvements (v1.2.0)

- Enhanced XML/XSD parsing with improved regex patterns for better accuracy
- Better error handling with graceful degradation for malformed content
- New `get_mcp_server_info` tool to retrieve server name and version
- Improved namespace extraction with proper prefix and URI handling
- Enhanced element attribute extraction for both self-closing and container elements
- Better deduplication logic for elements with the same name
- Added comprehensive test suite with 9 new tests for XML parsing

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.