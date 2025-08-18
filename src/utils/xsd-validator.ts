export interface ValidationResult {
  isValid: boolean;
  hasXMLDeclaration: boolean;
  hasSchemaElement: boolean;
  namespaces: string[];
  elements: string[];
}

export function validateXSD(xsd_content: string): ValidationResult {
  try {
    // Check if content is empty
    if (!xsd_content || xsd_content.trim().length === 0) {
      return {
        isValid: false,
        hasXMLDeclaration: false,
        hasSchemaElement: false,
        namespaces: [],
        elements: []
      };
    }

    // Trim whitespace
    const content = xsd_content.trim();

    // Check for XML declaration
    const hasXMLDeclaration = content.startsWith('<?xml');
    
    // Check for schema element (more precise regex)
    const schemaRegex = /<(?:xs:)?schema\b/i;
    const hasSchemaElement = schemaRegex.test(content);
    
    // Basic XML well-formedness check
    const isValidXML = hasXMLDeclaration || content.startsWith('<');
    
    // More robust schema validation
    const isSchemaValid = hasSchemaElement && isValidXML;
    
    let validationResult: ValidationResult = {
      isValid: isSchemaValid,
      hasXMLDeclaration: hasXMLDeclaration,
      hasSchemaElement: hasSchemaElement,
      namespaces: [],
      elements: [],
    };

    // Extract namespaces (improved regex)
    const namespaceRegex = /xmlns(?::([a-zA-Z_][a-zA-Z0-9_-]*))?="([^"]*)"/g;
    let match;
    while ((match = namespaceRegex.exec(content)) !== null) {
      const prefix = match[1] || 'default';
      const uri = match[2];
      validationResult.namespaces.push(`${prefix}="${uri}"`);
    }

    // Extract element definitions (improved regex)
    const elementRegex = /<xs:element\s+name="([^"]+)"/gi;
    while ((match = elementRegex.exec(content)) !== null) {
      validationResult.elements.push(match[1]);
    }

    return validationResult;
  } catch (error) {
    // Return a safe validation result even if parsing fails
    return {
      isValid: false,
      hasXMLDeclaration: false,
      hasSchemaElement: false,
      namespaces: [],
      elements: []
    };
  }
}