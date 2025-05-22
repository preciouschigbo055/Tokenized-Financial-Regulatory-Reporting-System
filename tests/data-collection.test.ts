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
    "data-collection": {
      functions: {
        "submit-data": vi.fn(),
        "validate-submission": vi.fn(),
        "get-submission": vi.fn(),
        "get-submission-metadata": vi.fn(),
        "transfer-admin": vi.fn(),
      },
    },
  },
}

// Mock the global clarity object
global.clarity = mockClarity

describe("Data Collection Contract", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks()
  })
  
  it("should submit data", async () => {
    // Setup
    const submissionId = "sub-001"
    const institutionId = "inst-001"
    const requirementId = "req-001"
    const dataHash = new Uint8Array(32).fill(1) // Mock 32-byte buffer
    const dataLocation = "ipfs://QmXyZ123"
    const dataFormat = "json"
    const notes = "Q1 financial data"
    
    mockClarity.contracts["data-collection"].functions["submit-data"].mockResolvedValue({
      result: { value: submissionId },
      type: "ok",
    })
    
    // Execute
    const result = await mockClarity.contracts["data-collection"].functions["submit-data"](
        submissionId,
        institutionId,
        requirementId,
        dataHash,
        dataLocation,
        dataFormat,
        notes,
    )
    
    // Verify
    expect(result.type).toBe("ok")
    expect(result.result.value).toBe(submissionId)
    expect(mockClarity.contracts["data-collection"].functions["submit-data"]).toHaveBeenCalledWith(
        submissionId,
        institutionId,
        requirementId,
        dataHash,
        dataLocation,
        dataFormat,
        notes,
    )
  })
  
  it("should validate a submission", async () => {
    // Setup
    const submissionId = "sub-001"
    const status = "approved"
    
    mockClarity.contracts["data-collection"].functions["validate-submission"].mockResolvedValue({
      result: { value: true },
      type: "ok",
    })
    
    // Execute
    const result = await mockClarity.contracts["data-collection"].functions["validate-submission"](submissionId, status)
    
    // Verify
    expect(result.type).toBe("ok")
    expect(result.result.value).toBe(true)
    expect(mockClarity.contracts["data-collection"].functions["validate-submission"]).toHaveBeenCalledWith(
        submissionId,
        status,
    )
  })
  
  it("should get submission details", async () => {
    // Setup
    const submissionId = "sub-001"
    const submissionData = {
      "institution-id": "inst-001",
      "requirement-id": "req-001",
      "data-hash": new Uint8Array(32).fill(1),
      "submission-date": 100,
      status: "pending",
    }
    
    mockClarity.contracts["data-collection"].functions["get-submission"].mockResolvedValue({
      result: { value: submissionData },
      type: "some",
    })
    
    // Execute
    const result = await mockClarity.contracts["data-collection"].functions["get-submission"](submissionId)
    
    // Verify
    expect(result.type).toBe("some")
    expect(result.result.value).toEqual(submissionData)
    expect(mockClarity.contracts["data-collection"].functions["get-submission"]).toHaveBeenCalledWith(submissionId)
  })
  
  it("should get submission metadata", async () => {
    // Setup
    const submissionId = "sub-001"
    const metadataData = {
      "data-location": "ipfs://QmXyZ123",
      "data-format": "json",
      submitter: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      notes: "Q1 financial data",
    }
    
    mockClarity.contracts["data-collection"].functions["get-submission-metadata"].mockResolvedValue({
      result: { value: metadataData },
      type: "some",
    })
    
    // Execute
    const result = await mockClarity.contracts["data-collection"].functions["get-submission-metadata"](submissionId)
    
    // Verify
    expect(result.type).toBe("some")
    expect(result.result.value).toEqual(metadataData)
    expect(mockClarity.contracts["data-collection"].functions["get-submission-metadata"]).toHaveBeenCalledWith(
        submissionId,
    )
  })
})
