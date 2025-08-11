export interface ValidationResult {
  isValid: boolean;
  hasXMLDeclaration: boolean;
  hasSchemaElement: boolean;
  namespaces: string[];
  elements: string[];
}

export function validateXSD(xsd_content: string): ValidationResult {
  try {
    // Basic XSD validation checks
    const isValidXML = xsd_content.trim().startsWith('<?xml') || xsd_content.includes('<');
    const hasSchemaElement = xsd_content.includes('<xs:schema') || 
                            xsd_content.includes('<schema') || 
                            xsd_content.includes('xmlns:xs="http://www.w3.org/2001/XMLSchema"') ||
                            xsd_content.includes('xmlns="http://www.w3.org/2001/XMLSchema"');
    
    let validationResult: ValidationResult = {
      isValid: isValidXML && hasSchemaElement,
      hasXMLDeclaration: xsd_content.trim().startsWith('<?xml'),
      hasSchemaElement: hasSchemaElement,
      namespaces: [],
      elements: [],
    };

    // Extract namespaces
    const namespaceRegex = /xmlns(?::(\w+))?="([^"]+)"/g;
    let match;
    while ((match = namespaceRegex.exec(xsd_content)) !== null) {
      validationResult.namespaces.push(match[0]);
    }

    // Extract element definitions
    const elementRegex = /<xs:element\s+name="([^"]+)"/g;
    while ((match = elementRegex.exec(xsd_content)) !== null) {
      validationResult.elements.push(match[1]);
    }

    return validationResult;
  } catch (error) {
    throw new Error(`Failed to validate XSD: ${error instanceof Error ? error.message : String(error)}`);
  }
}