import { validateXSD } from '../src/utils/xsd-validator.ts';

describe('validate_xsd tool', () => {
  it('should validate a valid XSD', () => {
    const xsdContent = `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="note">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="to" type="xs:string"/>
        <xs:element name="from" type="xs:string"/>
        <xs:element name="heading" type="xs:string"/>
        <xs:element name="body" type="xs:string"/>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
</xs:schema>`;

    const result = validateXSD(xsdContent);
    
    expect(result.isValid).toBe(true);
    expect(result.hasXMLDeclaration).toBe(true);
    expect(result.hasSchemaElement).toBe(true);
    expect(result.namespaces.length).toBeGreaterThan(0);
    expect(result.elements).toContain('note');
  });

  it('should identify invalid XSD', () => {
    const xsdContent = '<invalid>not xsd content</invalid>';

    const result = validateXSD(xsdContent);
    
    expect(result.isValid).toBe(false);
  });

  it('should handle XSD without XML declaration', () => {
    const xsdContent = `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="test" type="xs:string"/>
</xs:schema>`;

    const result = validateXSD(xsdContent);
    
    expect(result.isValid).toBe(true);
    expect(result.hasXMLDeclaration).toBe(false);
    expect(result.hasSchemaElement).toBe(true);
    expect(result.elements).toContain('test');
  });
});