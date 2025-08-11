// Definizioni dei tipi per il progetto XSD Retrieval MCP Server

export interface RetrieveXSDArgs {
  source: string;
  save_path?: string;
}

export interface RetrieveXSDResult {
  content: string;
  savedToFile: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  hasXMLDeclaration: boolean;
  hasSchemaElement: boolean;
  namespaces: string[];
  elements: string[];
}

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