import { XMLParser } from "fast-xml-parser";

export interface XSDXmlElement {
  name: string;
  type: string;
  minOccurs: string;
  maxOccurs: string;
}

export interface XSDAnalysisResult {
  elements: XSDXmlElement[];
  complexTypes: string[];
  simpleTypes: string[];
}

export function analyzeXSDElements(xsd_content: string): XSDAnalysisResult {
  try {
    const trimmedContent = xsd_content.trim();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });
    const parsedXSD = parser.parse(trimmedContent);

    const schemaElement = parsedXSD["xs:schema"] || parsedXSD["schema"];
    if (!schemaElement) {
      throw new Error("No <xs:schema> element found in the provided XSD.");
    }

    const elements: XSDXmlElement[] = [];
    if (schemaElement["xs:element"]) {
      const elementNodes = Array.isArray(schemaElement["xs:element"])
        ? schemaElement["xs:element"]
        : [schemaElement["xs:element"]];

      for (const el of elementNodes) {
        elements.push({
          name: el["@_name"] || "undefined",
          type: el["@_type"] || "undefined",
          minOccurs: el["@_minOccurs"] || "1",
          maxOccurs: el["@_maxOccurs"] || "1",
        });
      }
    }

    const complexTypes: string[] = [];
    if (schemaElement["xs:complexType"]) {
      const complexTypeNodes = Array.isArray(schemaElement["xs:complexType"])
        ? schemaElement["xs:complexType"]
        : [schemaElement["xs:complexType"]];
      complexTypes.push(
        ...complexTypeNodes
          .map((ct) => ct["@_name"])
          .filter(Boolean)
      );
    }

    const simpleTypes: string[] = [];
    if (schemaElement["xs:simpleType"]) {
      const simpleTypeNodes = Array.isArray(schemaElement["xs:simpleType"])
        ? schemaElement["xs:simpleType"]
        : [schemaElement["xs:simpleType"]];
      simpleTypes.push(
        ...simpleTypeNodes
          .map((st) => st["@_name"])
          .filter(Boolean)
      );
    }

    return {
      elements,
      complexTypes,
      simpleTypes,
    };
  } catch (error) {
    throw new Error(
      `Failed to analyze XSD: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}