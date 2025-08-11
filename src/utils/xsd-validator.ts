import { XMLParser, XMLValidator } from "fast-xml-parser";

export interface ValidationResult {
  isValid: boolean;
  hasXMLDeclaration: boolean;
  hasSchemaElement: boolean;
  namespaces: string[];
  elements: string[];
}

export function validateXSD(xsd_content: string): ValidationResult {
  try {
    const trimmedContent = xsd_content.trim();
    // 1. Validate XML structure
    const validationOutput = XMLValidator.validate(trimmedContent);
    if (validationOutput !== true) {
      throw new Error(`Invalid XML: ${validationOutput.err.msg}`);
    }

    // 2. Parse the XML content
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });
    const parsedXSD = parser.parse(trimmedContent);

    // 3. Perform XSD-specific checks
    const hasXMLDeclaration = trimmedContent.startsWith("<?xml");
    const schemaElement = parsedXSD["xs:schema"] || parsedXSD["schema"];
    const hasSchemaElement = !!schemaElement;

    let namespaces: string[] = [];
    if (schemaElement) {
      const attrs = schemaElement["@_"];
      console.log('attrs', attrs);
      if (attrs) {
        namespaces = Object.keys(attrs)
          .filter((attr) => attr.startsWith("@_xmlns"))
          .map((attr) => `${attr.substring(2)}="${attrs[attr]}"`);
      }
    }

    let elements: string[] = [];
    if (schemaElement && schemaElement["xs:element"]) {
      const elementNodes = Array.isArray(schemaElement["xs:element"])
        ? schemaElement["xs:element"]
        : [schemaElement["xs:element"]];
      elements = elementNodes.map((el) => el["@_name"]).filter(Boolean);
    }

    return {
      isValid: hasSchemaElement,
      hasXMLDeclaration,
      hasSchemaElement,
      namespaces,
      elements,
    };
  } catch (error) {
    throw new Error(
      `Failed to validate XSD: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}