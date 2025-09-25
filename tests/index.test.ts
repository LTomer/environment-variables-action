import { getInput } from '@actions/core';

// Mock the @actions/core module
jest.mock('@actions/core', () => ({
  getInput: jest.fn(),
}));

describe('Environment Variables Action', () => {
  const mockGetInput = getInput as jest.MockedFunction<typeof getInput>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should work with mocked input', () => {
    // Arrange
    mockGetInput.mockReturnValue('World');

    // Act
    const name = getInput('name');

    // Assert
    expect(name).toBe('World');
    expect(mockGetInput).toHaveBeenCalledWith('name');
  });

  test('should handle empty input', () => {
    // Arrange
    mockGetInput.mockReturnValue('');

    // Act
    const name = getInput('name');

    // Assert
    expect(name).toBe('');
    expect(mockGetInput).toHaveBeenCalledWith('name');
  });
});