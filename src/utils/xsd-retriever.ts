import axios from "axios";
import * as fs from "fs";
import * as path from "path";

export interface RetrieveXSDArgs {
  source: string;
  save_path?: string;
}

export interface RetrieveXSDResult {
  content: string;
  savedToFile: boolean;
}

export async function retrieveXSD(args: RetrieveXSDArgs): Promise<RetrieveXSDResult> {
  try {
    const { source, save_path } = args;
    let xsdContent: string;

    // Check if source is a URL or file path
    if (source.startsWith('http://') || source.startsWith('https://')) {
      // Retrieve from URL
      const response = await axios.get(source, {
        headers: {
          'Accept': 'application/xml, text/xml, */*',
        },
        timeout: 30000,
      });
      xsdContent = response.data;
    } else {
      // Read from file system
      if (!fs.existsSync(source)) {
        throw new Error(`File not found: ${source}`);
      }
      xsdContent = fs.readFileSync(source, 'utf8');
    }

    // Validate that it's XML content
    if (!xsdContent.trim().startsWith('<?xml') && !xsdContent.includes('<xs:schema') && !xsdContent.includes('<schema')) {
      throw new Error('Retrieved content does not appear to be valid XML/XSD');
    }

    // Save to file if save_path is provided
    let savedToFile = false;
    if (save_path) {
      const dir = path.dirname(save_path);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(save_path, xsdContent, 'utf8');
      savedToFile = true;
    }

    return {
      content: xsdContent,
      savedToFile: savedToFile
    };
  } catch (error) {
    throw new Error(`Failed to retrieve XSD: ${error instanceof Error ? error.message : String(error)}`);
  }
}