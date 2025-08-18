import * as path from "path";
import * as fs from "fs";

/**
 * Validates a file path to prevent directory traversal attacks
 * @param filePath The file path to validate
 * @param baseDir Optional base directory to restrict paths to
 * @returns The normalized absolute path if valid, throws an error otherwise
 */
export function validateFilePath(filePath: string, baseDir?: string): string {
  // Check for null or empty paths
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('Invalid file path: Path is null or empty');
  }

  // Normalize the path to resolve any ".." or "." sequences
  let normalizedPath = path.normalize(filePath);
  
  // Remove trailing slashes
  normalizedPath = normalizedPath.replace(/[\/\\]+$/, '');
  
  // Check for directory traversal patterns
  if (normalizedPath.includes("..")) {
    throw new Error('Invalid file path: Path contains directory traversal sequences');
  }
  
  // Check for absolute paths when a base directory is specified
  if (baseDir && path.isAbsolute(normalizedPath)) {
    throw new Error('Invalid file path: Absolute paths are not allowed');
  }
  
  // Resolve the path against the base directory if provided
  if (baseDir) {
    normalizedPath = path.resolve(baseDir, normalizedPath);
  } else {
    // If no base directory is specified, resolve against current working directory
    normalizedPath = path.resolve(normalizedPath);
  }
  
  // Additional security check: ensure the path is within the base directory
  if (baseDir) {
    const resolvedBaseDir = path.resolve(baseDir);
    if (!normalizedPath.startsWith(resolvedBaseDir)) {
      throw new Error('Invalid file path: Path is outside the allowed directory');
    }
 }
  
  return normalizedPath;
}

/**
 * Validates a file path for reading operations
 * @param filePath The file path to validate
 * @returns The normalized absolute path if valid
 */
export function validateReadPath(filePath: string): string {
  const normalizedPath = validateFilePath(filePath);
  
  // Check if file exists
  if (!fs.existsSync(normalizedPath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  
  // Check if it's actually a file (not a directory)
  const stat = fs.statSync(normalizedPath);
  if (!stat.isFile()) {
    throw new Error(`Path is not a file: ${filePath}`);
  }
  
  return normalizedPath;
}

/**
 * Validates a file path for writing operations
 * @param filePath The file path to validate
 * @param baseDir Optional base directory to restrict paths to
 * @returns The normalized absolute path if valid
 */
export function validateWritePath(filePath: string, baseDir?: string): string {
  const normalizedPath = validateFilePath(filePath, baseDir);
  
  // Ensure parent directory exists
  const dir = path.dirname(normalizedPath);
  if (!fs.existsSync(dir)) {
    throw new Error(`Parent directory does not exist: ${path.dirname(filePath)}`);
  }
  
 // Check if parent is actually a directory
  const stat = fs.statSync(dir);
  if (!stat.isDirectory()) {
    throw new Error(`Parent path is not a directory: ${path.dirname(filePath)}`);
  }
  
  return normalizedPath;
}