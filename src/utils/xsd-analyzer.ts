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
    const elements: XSDXmlElement[] = [];
    const complexTypes: string[] = [];
    const simpleTypes: string[] = [];

    // Extract element definitions
    const elementRegex = /<xs:element\s+name="([^"]+)"(?:\s+type="([^"]+)")?(?:\s+minOccurs="([^"]+)")?(?:\s+maxOccurs="([^"]+)")?\s*\/?>/g;
    let match;
    while ((match = elementRegex.exec(xsd_content)) !== null) {
      elements.push({
        name: match[1],
        type: match[2] || 'undefined',
        minOccurs: match[3] || '1',
        maxOccurs: match[4] || '1',
      });
    }

    // Extract complex type definitions
    const complexTypeRegex = /<xs:complexType\s+name="([^"]+)"/g;
    while ((match = complexTypeRegex.exec(xsd_content)) !== null) {
      complexTypes.push(match[1]);
    }

    // Extract simple type definitions
    const simpleTypeRegex = /<xs:simpleType\s+name="([^"]+)"/g;
    while ((match = simpleTypeRegex.exec(xsd_content)) !== null) {
      simpleTypes.push(match[1]);
    }

    return {
      elements,
      complexTypes,
      simpleTypes
    };
  } catch (error) {
    throw new Error(`Failed to analyze XSD: ${error instanceof Error ? error.message : String(error)}`);
  }
}