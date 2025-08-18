import { validateFilePath, validateReadPath, validateWritePath } from "../src/utils/path-validator";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

describe("Path Validation", () => {
  let tempDir: string;
  let testFile: string;

 beforeAll(() => {
    // Create a temporary directory for testing
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "xsd-retrieval-test-"));
    testFile = path.join(tempDir, "test.xsd");
    fs.writeFileSync(testFile, "<?xml version=\"1.0\" encoding=\"UTF-8\"?><test>content</test>");
  });

  afterAll(() => {
    // Clean up temporary files
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
    if (fs.existsSync(tempDir)) {
      fs.rmdirSync(tempDir);
    }
  });

  describe("validateFilePath", () => {
    it("should normalize valid paths", () => {
      const normalized = validateFilePath("./test.xsd");
      expect(path.isAbsolute(normalized)).toBe(true);
    });

    it("should reject paths with directory traversal", () => {
      expect(() => validateFilePath("../test.xsd")).toThrow("directory traversal");
      expect(() => validateFilePath("../../test.xsd")).toThrow("directory traversal");
      expect(() => validateFilePath("../../../test.xsd")).toThrow("directory traversal");
      expect(() => validateFilePath("./../test.xsd")).toThrow("directory traversal");
      expect(() => validateFilePath("test/../../../test.xsd")).toThrow("directory traversal");
    });

    it("should reject null or empty paths", () => {
      expect(() => validateFilePath("")).toThrow("null or empty");
      expect(() => validateFilePath(null as any)).toThrow("null or empty");
      expect(() => validateFilePath(undefined as any)).toThrow("null or empty");
    });
  });

  describe("validateReadPath", () => {
    it("should validate existing file paths", () => {
      const validatedPath = validateReadPath(testFile);
      expect(validatedPath).toBe(testFile);
    });

    it("should reject non-existent files", () => {
      expect(() => validateReadPath("/non/existent/file.xsd")).toThrow("File not found");
    });

    it("should reject directory paths", () => {
      expect(() => validateReadPath(tempDir)).toThrow("not a file");
    });
  });

  describe("validateWritePath", () => {
    it("should validate write paths", () => {
      const newFile = path.join(tempDir, "new-file.xsd");
      const validatedPath = validateWritePath(newFile);
      expect(validatedPath).toBe(newFile);
    });

    it("should reject paths with directory traversal", () => {
      expect(() => validateWritePath("../new-file.xsd")).toThrow("directory traversal");
    });
  });
});