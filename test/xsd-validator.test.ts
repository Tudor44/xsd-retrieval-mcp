import { validateXSD } from '../src/utils/xsd-validator';

describe('validateXSD', () => {
  it('should return valid for a correct XSD', () => {
    const xsdContent = `
      <?xml version="1.0" encoding="UTF-8"?>
      <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
        <xs:element name="note" type="xs:string"/>
      </xs:schema>
    `;
    const result = validateXSD(xsdContent);
    expect(result.isValid).toBe(true);
    expect(result.hasXMLDeclaration).toBe(true);
    expect(result.hasSchemaElement).toBe(true);
    expect(result.elements).toEqual(['note']);
  });

  it('should return invalid for an incorrect XSD', () => {
    const xsdContent = '<root><item>test</item></root>';
    const result = validateXSD(xsdContent);
    expect(result.isValid).toBe(false);
  });

  it('should handle XSD without XML declaration', () => {
    const xsdContent = `
      <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
        <xs:element name="note" type="xs:string"/>
      </xs:schema>
    `;
    const result = validateXSD(xsdContent);
    expect(result.isValid).toBe(true);
    expect(result.hasXMLDeclaration).toBe(false);
  });

  it('should extract namespaces', () => {
    const xsdContent = `
      <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:myns="http://example.com/myns">
      </xs:schema>
    `;
    const result = validateXSD(xsdContent);
    expect(result.namespaces).toContain('xmlns:xs="http://www.w3.org/2001/XMLSchema"');
    expect(result.namespaces).toContain('xmlns:myns="http://example.com/myns"');
  });
});
