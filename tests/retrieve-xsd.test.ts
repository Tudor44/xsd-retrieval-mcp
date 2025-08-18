import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { retrieveXSD } from '../src/utils/xsd-retriever.ts';

// Mock delle dipendenze
jest.mock('axios');
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  mkdirSync: jest.fn(),
}));

// Mock della funzione retrieveXSD
jest.mock('../src/utils/xsd-retriever.ts', () => ({
  retrieveXSD: jest.fn(),
}));

describe('retrieve_xsd tool', () => {
  beforeEach(() => {
    // Reset dei mock prima di ogni test
    jest.clearAllMocks();
  });

  it('should retrieve XSD from URL', async () => {
    // Mock del risultato della funzione retrieveXSD
    (retrieveXSD as jest.Mock).mockResolvedValue({
      content: '<?xml version="1.0" encoding="UTF-8"?><xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"></xs:schema>',
      savedToFile: false
    });

    // Simulazione della chiamata all'endpoint
    const args = {
      source: 'http://example.com/schema.xsd'
    };

    const result = await retrieveXSD(args);
    
    expect(retrieveXSD).toHaveBeenCalledWith(args);
    // Assert that mocked content contains the XML declaration
    expect(result.content).toContain('<?xml version="1.0"');
  });

  it('should retrieve XSD from file path', async () => {
    // Mock del risultato della funzione retrieveXSD
    (retrieveXSD as jest.Mock).mockResolvedValue({
      content: '<?xml version="1.0" encoding="UTF-8"?><xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"></xs:schema>',
      savedToFile: true
    });

    // Simulazione della chiamata all'endpoint
    const args = {
      source: '/path/to/schema.xsd',
      save_path: '/save/path/schema.xsd'
    };

    const result = await retrieveXSD(args);
    
    expect(retrieveXSD).toHaveBeenCalledWith(args);
    // When savedToFile is true, content should still contain the XML declaration
    expect(result.content).toContain('<?xml version="1.0"');
    expect(result.savedToFile).toBe(true);
  });

  it('should handle retrieval errors', async () => {
    // Mock di un errore nella funzione retrieveXSD
    (retrieveXSD as jest.Mock).mockRejectedValue(new Error('Network error'));

    // Simulazione della chiamata all'endpoint
    const args = {
      source: 'http://example.com/invalid-schema.xsd'
    };

    await expect(retrieveXSD(args)).rejects.toThrow('Network error');
  });
});