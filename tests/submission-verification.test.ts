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
    "submission-verification": {
      functions: {
        "verify-submission": vi.fn(),
        "get-verification": vi.fn(),
        "is-submission-timely": vi.fn(),
        "transfer-admin": vi.fn(),
      },
    },
  },
}

// Mock the global clarity object
global.clarity = mockClarity

describe("Submission Verification Contract", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks()
  })
  
  it("should verify a submission", async () => {
    // Setup
    const verificationId = "ver-001"
    const institutionId = "inst-001"
    const requirementId = "req-001"
    const reportId = "rep-001"
    const submissionDate = 95
    const dueDate = 100
    
    mockClarity.contracts["submission-verification"].functions["verify-submission"].mockResolvedValue({
      result: { value: verificationId },
      type: "ok",
    })
    
    // Execute
    const result = await mockClarity.contracts["submission-verification"].functions["verify-submission"](
        verificationId,
        institutionId,
        requirementId,
        reportId,
        submissionDate,
        dueDate,
    )
    
    // Verify
    expect(result.type).toBe("ok")
    expect(result.result.value).toBe(verificationId)
    expect(mockClarity.contracts["submission-verification"].functions["verify-submission"]).toHaveBeenCalledWith(
        verificationId,
        institutionId,
        requirementId,
        reportId,
        submissionDate,
        dueDate,
    )
  })
  
  it("should get verification details", async () => {
    // Setup
    const verificationId = "ver-001"
    const verificationData = {
      "institution-id": "inst-001",
      "requirement-id": "req-001",
      "report-id": "rep-001",
      "submission-date": 95,
      "due-date": 100,
      "is-timely": true,
      "verification-date": 100,
    }
    
    mockClarity.contracts["submission-verification"].functions["get-verification"].mockResolvedValue({
      result: { value: verificationData },
      type: "some",
    })
    
    // Execute
    const result = await mockClarity.contracts["submission-verification"].functions["get-verification"](verificationId)
    
    // Verify
    expect(result.type).toBe("some")
    expect(result.result.value).toEqual(verificationData)
    expect(mockClarity.contracts["submission-verification"].functions["get-verification"]).toHaveBeenCalledWith(
        verificationId,
    )
  })
  
  it("should check if a submission was timely", async () => {
    // Setup
    const verificationId = "ver-001"
    
    mockClarity.contracts["submission-verification"].functions["is-submission-timely"].mockResolvedValue({
      result: { value: true },
      type: "ok",
    })
    
    // Execute
    const result =
        await mockClarity.contracts["submission-verification"].functions["is-submission-timely"](verificationId)
    
    // Verify
    expect(result.type).toBe("ok")
    expect(result.result.value).toBe(true)
    expect(mockClarity.contracts["submission-verification"].functions["is-submission-timely"]).toHaveBeenCalledWith(
        verificationId,
    )
  })
  
  it("should transfer admin rights", async () => {
    // Setup
    const newAdmin = "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG"
    
    mockClarity.contracts["submission-verification"].functions["transfer-admin"].mockResolvedValue({
      result: { value: true },
      type: "ok",
    })
    
    // Execute
    const result = await mockClarity.contracts["submission-verification"].functions["transfer-admin"](newAdmin)
    
    // Verify
    expect(result.type).toBe("ok")
    expect(result.result.value).toBe(true)
    expect(mockClarity.contracts["submission-verification"].functions["transfer-admin"]).toHaveBeenCalledWith(newAdmin)
  })
})
