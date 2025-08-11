import axios from 'axios';
import * as fs from 'fs';
import { retrieveXSD } from '../src/utils/xsd-retriever';

// Mock axios and fs
jest.mock('axios');
jest.mock('fs');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('retrieveXSD', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve XSD from a URL', async () => {
    const xsdContent = '<?xml version="1.0" encoding="UTF-8"?><xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"></xs:schema>';
    mockedAxios.get.mockResolvedValue({ data: xsdContent });

    const result = await retrieveXSD({ source: 'http://example.com/schema.xsd' });

    expect(result.content).toBe(xsdContent);
    expect(result.savedToFile).toBe(false);
    expect(mockedAxios.get).toHaveBeenCalledWith('http://example.com/schema.xsd', expect.any(Object));
  });

  it('should retrieve XSD from a local file path', async () => {
    const xsdContent = '<?xml version="1.0" encoding="UTF-8"?><xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"></xs:schema>';
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue(xsdContent);

    const result = await retrieveXSD({ source: '/path/to/schema.xsd' });

    expect(result.content).toBe(xsdContent);
    expect(result.savedToFile).toBe(false);
    expect(mockedFs.readFileSync).toHaveBeenCalledWith('/path/to/schema.xsd', 'utf8');
  });

  it('should save the retrieved XSD to a file if save_path is provided', async () => {
    const xsdContent = '<?xml version="1.0" encoding="UTF-8"?><xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"></xs:schema>';
    mockedAxios.get.mockResolvedValue({ data: xsdContent });

    const result = await retrieveXSD({
      source: 'http://example.com/schema.xsd',
      save_path: '/path/to/save/schema.xsd',
    });

    expect(result.savedToFile).toBe(true);
    expect(mockedFs.writeFileSync).toHaveBeenCalledWith('/path/to/save/schema.xsd', xsdContent, 'utf8');
  });

  it('should throw an error for an invalid source', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network error'));
    await expect(retrieveXSD({ source: 'http://example.com/invalid.xsd' })).rejects.toThrow('Failed to retrieve XSD: Network error');
  });
});
