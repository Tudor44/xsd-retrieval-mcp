import { analyzeXSDElements } from '../src/utils/xsd-analyzer.ts';

describe('list_xsd_elements tool', () => {
  it('should extract elements from XSD', () => {
    const xsdContent = `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="note">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="to" type="xs:string" minOccurs="1" maxOccurs="1"/>
        <xs:element name="from" type="xs:string" minOccurs="0" maxOccurs="unbounded"/>
        <xs:element name="heading" type="xs:string"/>
        <xs:element name="body" type="xs:string"/>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
  
  <xs:complexType name="personType">
    <xs:sequence>
      <xs:element name="name" type="xs:string"/>
      <xs:element name="age" type="xs:int"/>
    </xs:sequence>
  </xs:complexType>
  
  <xs:simpleType name="emailType">
    <xs:restriction base="xs:string">
      <xs:pattern value="[^@]+@[^@]+\.[^@]+"/>
    </xs:restriction>
  </xs:simpleType>
</xs:schema>`;

    const result = analyzeXSDElements(xsdContent);
    
    // Verifica elementi
    expect(result.elements.length).toBe(7);
    expect(result.elements).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'to', type: 'xs:string', minOccurs: '1', maxOccurs: '1' }),
        expect.objectContaining({ name: 'from', type: 'xs:string', minOccurs: '0', maxOccurs: 'unbounded' }),
        expect.objectContaining({ name: 'heading', type: 'xs:string', minOccurs: '1', maxOccurs: '1' }),
        expect.objectContaining({ name: 'body', type: 'xs:string', minOccurs: '1', maxOccurs: '1' }),
        expect.objectContaining({ name: 'note', type: 'undefined', minOccurs: '1', maxOccurs: '1' }),
        // Elementi aggiuntivi definiti nel complexType 'personType'
        expect.objectContaining({ name: 'name', type: 'xs:string', minOccurs: '1', maxOccurs: '1' }),
        expect.objectContaining({ name: 'age', type: 'xs:int', minOccurs: '1', maxOccurs: '1' })
      ])
    );
    
    // Verifica complex types
    expect(result.complexTypes.length).toBe(1);
    expect(result.complexTypes).toContain('personType');
    
    // Verifica simple types
    expect(result.simpleTypes.length).toBe(1);
    expect(result.simpleTypes).toContain('emailType');
  });

  it('should handle XSD with no elements', () => {
    const xsdContent = `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
</xs:schema>`;

    const result = analyzeXSDElements(xsdContent);
    
    expect(result.elements.length).toBe(0);
    expect(result.complexTypes.length).toBe(0);
    expect(result.simpleTypes.length).toBe(0);
  });

  it('should handle malformed XSD gracefully', () => {
    const xsdContent = '<invalid>not xsd content</invalid>';

    const result = analyzeXSDElements(xsdContent);
    
    expect(result.elements.length).toBe(0);
    expect(result.complexTypes.length).toBe(0);
    expect(result.simpleTypes.length).toBe(0);
  });
});