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
    "requirement-tracking": {
      functions: {
        "add-requirement": vi.fn(),
        "assign-requirement": vi.fn(),
        "update-due-date": vi.fn(),
        "get-requirement": vi.fn(),
        "get-institution-requirement": vi.fn(),
        "transfer-admin": vi.fn(),
      },
    },
  },
}

// Mock the global clarity object
global.clarity = mockClarity

describe("Requirement Tracking Contract", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks()
  })
  
  it("should add a new reporting requirement", async () => {
    // Setup
    const requirementId = "req-001"
    const title = "Quarterly Report"
    const description = "Financial statement for Q1"
    const frequency = "quarterly"
    const deadlineDays = 30
    
    mockClarity.contracts["requirement-tracking"].functions["add-requirement"].mockResolvedValue({
      result: { value: requirementId },
      type: "ok",
    })
    
    // Execute
    const result = await mockClarity.contracts["requirement-tracking"].functions["add-requirement"](
        requirementId,
        title,
        description,
        frequency,
        deadlineDays,
    )
    
    // Verify
    expect(result.type).toBe("ok")
    expect(result.result.value).toBe(requirementId)
    expect(mockClarity.contracts["requirement-tracking"].functions["add-requirement"]).toHaveBeenCalledWith(
        requirementId,
        title,
        description,
        frequency,
        deadlineDays,
    )
  })
  
  it("should assign a requirement to an institution", async () => {
    // Setup
    const institutionId = "inst-001"
    const requirementId = "req-001"
    const nextDueDate = 150
    
    mockClarity.contracts["requirement-tracking"].functions["assign-requirement"].mockResolvedValue({
      result: { value: true },
      type: "ok",
    })
    
    // Execute
    const result = await mockClarity.contracts["requirement-tracking"].functions["assign-requirement"](
        institutionId,
        requirementId,
        nextDueDate,
    )
    
    // Verify
    expect(result.type).toBe("ok")
    expect(result.result.value).toBe(true)
    expect(mockClarity.contracts["requirement-tracking"].functions["assign-requirement"]).toHaveBeenCalledWith(
        institutionId,
        requirementId,
        nextDueDate,
    )
  })
  
  it("should update a requirement due date", async () => {
    // Setup
    const institutionId = "inst-001"
    const requirementId = "req-001"
    const newDueDate = 180
    
    mockClarity.contracts["requirement-tracking"].functions["update-due-date"].mockResolvedValue({
      result: { value: true },
      type: "ok",
    })
    
    // Execute
    const result = await mockClarity.contracts["requirement-tracking"].functions["update-due-date"](
        institutionId,
        requirementId,
        newDueDate,
    )
    
    // Verify
    expect(result.type).toBe("ok")
    expect(result.result.value).toBe(true)
    expect(mockClarity.contracts["requirement-tracking"].functions["update-due-date"]).toHaveBeenCalledWith(
        institutionId,
        requirementId,
        newDueDate,
    )
  })
  
  it("should get requirement details", async () => {
    // Setup
    const requirementId = "req-001"
    const requirementData = {
      title: "Quarterly Report",
      description: "Financial statement for Q1",
      frequency: "quarterly",
      "deadline-days": 30,
      active: true,
    }
    
    mockClarity.contracts["requirement-tracking"].functions["get-requirement"].mockResolvedValue({
      result: { value: requirementData },
      type: "some",
    })
    
    // Execute
    const result = await mockClarity.contracts["requirement-tracking"].functions["get-requirement"](requirementId)
    
    // Verify
    expect(result.type).toBe("some")
    expect(result.result.value).toEqual(requirementData)
    expect(mockClarity.contracts["requirement-tracking"].functions["get-requirement"]).toHaveBeenCalledWith(
        requirementId,
    )
  })
  
  it("should get institution requirement details", async () => {
    // Setup
    const institutionId = "inst-001"
    const requirementId = "req-001"
    const requirementData = {
      "assigned-date": 90,
      "next-due-date": 150,
      active: true,
    }
    
    mockClarity.contracts["requirement-tracking"].functions["get-institution-requirement"].mockResolvedValue({
      result: { value: requirementData },
      type: "some",
    })
    
    // Execute
    const result = await mockClarity.contracts["requirement-tracking"].functions["get-institution-requirement"](
        institutionId,
        requirementId,
    )
    
    // Verify
    expect(result.type).toBe("some")
    expect(result.result.value).toEqual(requirementData)
    expect(mockClarity.contracts["requirement-tracking"].functions["get-institution-requirement"]).toHaveBeenCalledWith(
        institutionId,
        requirementId,
    )
  })
})
