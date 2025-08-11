import { analyzeXSDElements } from '../src/utils/xsd-analyzer';

describe('analyzeXSDElements', () => {
  const xsdContent = `
    <?xml version="1.0" encoding="UTF-8"?>
    <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">

      <xs:element name="shiporder" type="OrderType"/>

      <xs:complexType name="OrderType">
        <xs:sequence>
          <xs:element name="shipto" type="AddressType"/>
        </xs:sequence>
        <xs:attribute name="orderid" type="xs:string" use="required"/>
      </xs:complexType>

      <xs:complexType name="AddressType">
        <xs:sequence>
          <xs:element name="name" type="xs:string"/>
          <xs:element name="address" type="xs:string"/>
        </xs:sequence>
      </xs:complexType>

      <xs:simpleType name="stringtype">
        <xs:restriction base="xs:string"/>
      </xs:simpleType>

    </xs:schema>
  `;

  it('should extract all elements from the XSD', () => {
    const result = analyzeXSDElements(xsdContent);
    expect(result.elements.length).toBe(1);
    expect(result.elements[0].name).toBe('shiporder');
    expect(result.elements[0].type).toBe('OrderType');
  });

  it('should extract all complex types from the XSD', () => {
    const result = analyzeXSDElements(xsdContent);
    expect(result.complexTypes.length).toBe(2);
    expect(result.complexTypes).toContain('OrderType');
    expect(result.complexTypes).toContain('AddressType');
  });

  it('should extract all simple types from the XSD', () => {
    const result = analyzeXSDElements(xsdContent);
    expect(result.simpleTypes.length).toBe(1);
    expect(result.simpleTypes).toContain('stringtype');
  });

  it('should throw an error if no schema element is found', () => {
    const invalidXsd = '<root></root>';
    expect(() => analyzeXSDElements(invalidXsd)).toThrow('No <xs:schema> element found in the provided XSD.');
  });
});
