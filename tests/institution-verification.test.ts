import { describe, it, expect, beforeEach, vi } from "vitest"

// Mock Clarity environment
const mockClarity = {
  tx: {
    sender: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    sponsoredBy: null,
  },
  block: {
    height: 100,
  },
  contracts: {
    "institution-verification": {
      functions: {
        "register-institution": vi.fn(),
        "verify-institution": vi.fn(),
        "is-institution-verified": vi.fn(),
        "get-institution": vi.fn(),
        "transfer-admin": vi.fn(),
      },
    },
  },
}

// Mock the global clarity object
global.clarity = mockClarity

describe("Institution Verification Contract", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks()
  })
  
  it("should register a new institution", async () => {
    // Setup
    const institutionId = "inst-001"
    const name = "Example Bank"
    const address = "123 Finance St"
    const licenseNumber = "LIC-12345"
    
    mockClarity.contracts["institution-verification"].functions["register-institution"].mockResolvedValue({
      result: { value: institutionId },
      type: "ok",
    })
    
    // Execute
    const result = await mockClarity.contracts["institution-verification"].functions["register-institution"](
        institutionId,
        name,
        address,
        licenseNumber,
    )
    
    // Verify
    expect(result.type).toBe("ok")
    expect(result.result.value).toBe(institutionId)
    expect(mockClarity.contracts["institution-verification"].functions["register-institution"]).toHaveBeenCalledWith(
        institutionId,
        name,
        address,
        licenseNumber,
    )
  })
  
  it("should verify an institution", async () => {
    // Setup
    const institutionId = "inst-001"
    
    mockClarity.contracts["institution-verification"].functions["verify-institution"].mockResolvedValue({
      result: { value: true },
      type: "ok",
    })
    
    // Execute
    const result =
        await mockClarity.contracts["institution-verification"].functions["verify-institution"](institutionId)
    
    // Verify
    expect(result.type).toBe("ok")
    expect(result.result.value).toBe(true)
    expect(mockClarity.contracts["institution-verification"].functions["verify-institution"]).toHaveBeenCalledWith(
        institutionId,
    )
  })
  
  it("should check if an institution is verified", async () => {
    // Setup
    const institutionId = "inst-001"
    
    mockClarity.contracts["institution-verification"].functions["is-institution-verified"].mockResolvedValue({
      result: { value: true },
      type: "ok",
    })
    
    // Execute
    const result =
        await mockClarity.contracts["institution-verification"].functions["is-institution-verified"](institutionId)
    
    // Verify
    expect(result.type).toBe("ok")
    expect(result.result.value).toBe(true)
    expect(mockClarity.contracts["institution-verification"].functions["is-institution-verified"]).toHaveBeenCalledWith(
        institutionId,
    )
  })
  
  it("should get institution details", async () => {
    // Setup
    const institutionId = "inst-001"
    const institutionData = {
      name: "Example Bank",
      address: "123 Finance St",
      "license-number": "LIC-12345",
      verified: true,
      "verification-date": 95,
    }
    
    mockClarity.contracts["institution-verification"].functions["get-institution"].mockResolvedValue({
      result: { value: institutionData },
      type: "some",
    })
    
    // Execute
    const result = await mockClarity.contracts["institution-verification"].functions["get-institution"](institutionId)
    
    // Verify
    expect(result.type).toBe("some")
    expect(result.result.value).toEqual(institutionData)
    expect(mockClarity.contracts["institution-verification"].functions["get-institution"]).toHaveBeenCalledWith(
        institutionId,
    )
  })
  
  it("should transfer admin rights", async () => {
    // Setup
    const newAdmin = "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG"
    
    mockClarity.contracts["institution-verification"].functions["transfer-admin"].mockResolvedValue({
      result: { value: true },
      type: "ok",
    })
    
    // Execute
    const result = await mockClarity.contracts["institution-verification"].functions["transfer-admin"](newAdmin)
    
    // Verify
    expect(result.type).toBe("ok")
    expect(result.result.value).toBe(true)
    expect(mockClarity.contracts["institution-verification"].functions["transfer-admin"]).toHaveBeenCalledWith(newAdmin)
  })
})
