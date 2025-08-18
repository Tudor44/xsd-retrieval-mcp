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
    // Check if content is empty
    if (!xsd_content || xsd_content.trim().length === 0) {
      return {
        elements: [],
        complexTypes: [],
        simpleTypes: []
      };
    }

    const content = xsd_content.trim();
    const elements: XSDXmlElement[] = [];
    const complexTypes: string[] = [];
    const simpleTypes: string[] = [];

    // Extract element definitions (improved regex with better attribute matching)
    // Match both self-closing and container elements
    const elementRegex = /<xs:element\s+([^>\/]+?)\s*(?:\/>|>)/gi;
    let match;
    while ((match = elementRegex.exec(content)) !== null) {
      const attributes = match[1];
      
      // Extract name attribute
      const nameMatch = attributes.match(/name="([^"]+)"/i);
      if (!nameMatch) continue;
      
      // Extract type attribute
      const typeMatch = attributes.match(/type="([^"]+)"/i);
      
      // Extract minOccurs attribute
      const minOccursMatch = attributes.match(/minOccurs="([^"]+)"/i);
      
      // Extract maxOccurs attribute
      const maxOccursMatch = attributes.match(/maxOccurs="([^"]+)"/i);
      
      elements.push({
        name: nameMatch[1],
        type: typeMatch ? typeMatch[1] : 'undefined',
        minOccurs: minOccursMatch ? minOccursMatch[1] : '1',
        maxOccurs: maxOccursMatch ? maxOccursMatch[1] : '1',
      });
    }

    // Deduplicate elements by name to avoid counting duplicates from nested or repeated matches
    const uniqueElementsMap = new Map<string, XSDXmlElement>();
    for (const el of elements) {
      if (!uniqueElementsMap.has(el.name)) {
        uniqueElementsMap.set(el.name, el);
      }
    }
    const uniqueElements = Array.from(uniqueElementsMap.values());

    // Extract complex type definitions (improved regex)
    const complexTypeRegex = /<xs:complexType\s+name="([^"]+)"/gi;
    while ((match = complexTypeRegex.exec(content)) !== null) {
      complexTypes.push(match[1]);
    }

    // Extract simple type definitions (improved regex)
    const simpleTypeRegex = /<xs:simpleType\s+name="([^"]+)"/gi;
    while ((match = simpleTypeRegex.exec(content)) !== null) {
      simpleTypes.push(match[1]);
    }

    return {
      elements: uniqueElements,
      complexTypes,
      simpleTypes
    };
  } catch (error) {
    // Return safe default values in case of parsing errors
    return {
      elements: [],
      complexTypes: [],
      simpleTypes: []
    };
  }
}