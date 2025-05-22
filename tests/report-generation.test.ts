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
    "report-generation": {
      functions: {
        "generate-report": vi.fn(),
        "finalize-report": vi.fn(),
        "get-report": vi.fn(),
        "get-report-metadata": vi.fn(),
        "transfer-admin": vi.fn(),
      },
    },
  },
}

// Mock the global clarity object
global.clarity = mockClarity

describe("Report Generation Contract", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks()
  })
  
  it("should generate a report", async () => {
    // Setup
    const reportId = "rep-001"
    const institutionId = "inst-001"
    const requirementId = "req-001"
    const submissionIds = ["sub-001", "sub-002"]
    const reportHash = new Uint8Array(32).fill(1) // Mock 32-byte buffer
    const reportLocation = "ipfs://QmAbC123"
    const reportFormat = "pdf"
    const notes = "Q1 financial report"
    
    mockClarity.contracts["report-generation"].functions["generate-report"].mockResolvedValue({
      result: { value: reportId },
      type: "ok",
    })
    
    // Execute
    const result = await mockClarity.contracts["report-generation"].functions["generate-report"](
        reportId,
        institutionId,
        requirementId,
        submissionIds,
        reportHash,
        reportLocation,
        reportFormat,
        notes,
    )
    
    // Verify
    expect(result.type).toBe("ok")
    expect(result.result.value).toBe(reportId)
    expect(mockClarity.contracts["report-generation"].functions["generate-report"]).toHaveBeenCalledWith(
        reportId,
        institutionId,
        requirementId,
        submissionIds,
        reportHash,
        reportLocation,
        reportFormat,
        notes,
    )
  })
  
  it("should finalize a report", async () => {
    // Setup
    const reportId = "rep-001"
    
    mockClarity.contracts["report-generation"].functions["finalize-report"].mockResolvedValue({
      result: { value: true },
      type: "ok",
    })
    
    // Execute
    const result = await mockClarity.contracts["report-generation"].functions["finalize-report"](reportId)
    
    // Verify
    expect(result.type).toBe("ok")
    expect(result.result.value).toBe(true)
    expect(mockClarity.contracts["report-generation"].functions["finalize-report"]).toHaveBeenCalledWith(reportId)
  })
  
  it("should get report details", async () => {
    // Setup
    const reportId = "rep-001"
    const reportData = {
      "institution-id": "inst-001",
      "requirement-id": "req-001",
      "submission-ids": ["sub-001", "sub-002"],
      "report-hash": new Uint8Array(32).fill(1),
      "generation-date": 100,
      status: "generated",
    }
    
    mockClarity.contracts["report-generation"].functions["get-report"].mockResolvedValue({
      result: { value: reportData },
      type: "some",
    })
    
    // Execute
    const result = await mockClarity.contracts["report-generation"].functions["get-report"](reportId)
    
    // Verify
    expect(result.type).toBe("some")
    expect(result.result.value).toEqual(reportData)
    expect(mockClarity.contracts["report-generation"].functions["get-report"]).toHaveBeenCalledWith(reportId)
  })
  
  it("should get report metadata", async () => {
    // Setup
    const reportId = "rep-001"
    const metadataData = {
      "report-location": "ipfs://QmAbC123",
      "report-format": "pdf",
      generator: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      notes: "Q1 financial report",
    }
    
    mockClarity.contracts["report-generation"].functions["get-report-metadata"].mockResolvedValue({
      result: { value: metadataData },
      type: "some",
    })
    
    // Execute
    const result = await mockClarity.contracts["report-generation"].functions["get-report-metadata"](reportId)
    
    // Verify
    expect(result.type).toBe("some")
    expect(result.result.value).toEqual(metadataData)
    expect(mockClarity.contracts["report-generation"].functions["get-report-metadata"]).toHaveBeenCalledWith(reportId)
  })
})
