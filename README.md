# XSD Retrieval MCP Server

A Model Context Protocol (MCP) server for retrieving and analyzing XSD (XML Schema Definition) files.

## Description

This MCP server provides tools to retrieve XSD files from URLs or local paths, validate them, and analyze their elements. It can be integrated with any LLM model.

## Features

The server provides the following MCP tools:

1.  **retrieve_xsd** - Retrieves an XSD file from a URL or file path.
2.  **validate_xsd** - Validates if the retrieved content is a valid XSD.
3.  **list_xsd_elements** - Lists the elements defined in an XSD.

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

The server communicates via stdio and can be integrated with any compatible MCP client.

### `retrieve_xsd` tool

Retrieves an XSD file from a URL or local path.

Parameters:
- `source` (string, required): URL or file path of the XSD file.
- `save_path` (string, optional): Local path to save the retrieved XSD file.

### `validate_xsd` tool

Validates if the provided content is a valid XSD.

Parameters:
- `xsd_content` (string, required): XSD content to validate.

### `list_xsd_elements` tool

Lists the elements defined in an XSD.

Parameters:.
- `xsd_content` (string, required): XSD content to analyze

## Contributing

1.  Fork the repository.
2.  Create a branch for your feature (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## License

Distributed under the MIT License. See `LICENSE` for more information.