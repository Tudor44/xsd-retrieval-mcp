import { validateXSD } from '../src/utils/xsd-validator.ts';
import { analyzeXSDElements } from '../src/utils/xsd-analyzer.ts';

describe('XML/XSD Parsing', () => {
  describe('validateXSD', () => {
    it('should correctly identify XML declaration', () => {
      const xsdContent = `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
</xs:schema>`;
      
      const result = validateXSD(xsdContent);
      expect(result.hasXMLDeclaration).toBe(true);
    });

    it('should correctly identify schema element', () => {
      const xsdContent = `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
</xs:schema>`;
      
      const result = validateXSD(xsdContent);
      expect(result.hasSchemaElement).toBe(true);
    });

    it('should correctly extract namespaces', () => {
      const xsdContent = `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" 
                  xmlns:tns="http://example.com/test">
</xs:schema>`;
      
      const result = validateXSD(xsdContent);
      expect(result.namespaces).toContain('xs="http://www.w3.org/2001/XMLSchema"');
      expect(result.namespaces).toContain('tns="http://example.com/test"');
    });

    it('should handle empty content gracefully', () => {
      const result = validateXSD('');
      expect(result.isValid).toBe(false);
    });

    it('should handle malformed XML gracefully', () => {
      const xsdContent = '<xs:schema><unclosed>';
      const result = validateXSD(xsdContent);
      // Should not throw an error
      expect(result).toBeDefined();
    });
  });

  describe('analyzeXSDElements', () => {
    it('should correctly extract element attributes', () => {
      const xsdContent = `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="testElement" type="xs:string" minOccurs="0" maxOccurs="unbounded"/>
</xs:schema>`;
      
      const result = analyzeXSDElements(xsdContent);
      expect(result.elements.length).toBe(1);
      expect(result.elements[0]).toEqual({
        name: 'testElement',
        type: 'xs:string',
        minOccurs: '0',
        maxOccurs: 'unbounded'
      });
    });

    it('should correctly extract complex and simple types', () => {
      const xsdContent = `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:complexType name="personType">
    <xs:sequence>
      <xs:element name="name" type="xs:string"/>
    </xs:sequence>
  </xs:complexType>
  
  <xs:simpleType name="emailType">
    <xs:restriction base="xs:string">
      <xs:pattern value="[^@]+@[^@]+\.[^@]+"/>
    </xs:restriction>
  </xs:simpleType>
</xs:schema>`;
      
      const result = analyzeXSDElements(xsdContent);
      expect(result.complexTypes).toContain('personType');
      expect(result.simpleTypes).toContain('emailType');
    });

    it('should handle empty content gracefully', () => {
      const result = analyzeXSDElements('');
      expect(result.elements.length).toBe(0);
      expect(result.complexTypes.length).toBe(0);
      expect(result.simpleTypes.length).toBe(0);
    });

    it('should deduplicate elements by name', () => {
      const xsdContent = `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="duplicate" type="xs:string"/>
  <xs:element name="duplicate" type="xs:int"/>
  <xs:element name="unique" type="xs:string"/>
</xs:schema>`;
      
      const result = analyzeXSDElements(xsdContent);
      expect(result.elements.length).toBe(2);
      expect(result.elements.map(e => e.name)).toContain('duplicate');
      expect(result.elements.map(e => e.name)).toContain('unique');
    });
  });
});