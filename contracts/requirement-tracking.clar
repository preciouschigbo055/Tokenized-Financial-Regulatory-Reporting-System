;; Requirement Tracking Contract
;; Records reporting obligations for financial institutions

(define-data-var admin principal tx-sender)

;; Map to store reporting requirements
(define-map reporting-requirements
  { requirement-id: (string-ascii 64) }
  {
    title: (string-ascii 100),
    description: (string-ascii 255),
    frequency: (string-ascii 20),
    deadline-days: uint,
    active: bool
  }
)

;; Map to track institution-specific requirements
(define-map institution-requirements
  {
    institution-id: (string-ascii 64),
    requirement-id: (string-ascii 64)
  }
  {
    assigned-date: uint,
    next-due-date: uint,
    active: bool
  }
)

;; Public function to add a new reporting requirement
(define-public (add-requirement
    (requirement-id (string-ascii 64))
    (title (string-ascii 100))
    (description (string-ascii 255))
    (frequency (string-ascii 20))
    (deadline-days uint))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (asserts! (is-none (map-get? reporting-requirements { requirement-id: requirement-id })) (err u100))

    (map-set reporting-requirements
      { requirement-id: requirement-id }
      {
        title: title,
        description: description,
        frequency: frequency,
        deadline-days: deadline-days,
        active: true
      }
    )
    (ok requirement-id)
  )
)

;; Public function to assign a requirement to an institution
(define-public (assign-requirement
    (institution-id (string-ascii 64))
    (requirement-id (string-ascii 64))
    (next-due-date uint))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (asserts! (is-some (map-get? reporting-requirements { requirement-id: requirement-id })) (err u404))

    (map-set institution-requirements
      {
        institution-id: institution-id,
        requirement-id: requirement-id
      }
      {
        assigned-date: block-height,
        next-due-date: next-due-date,
        active: true
      }
    )
    (ok true)
  )
)

;; Public function to update a requirement's due date
(define-public (update-due-date
    (institution-id (string-ascii 64))
    (requirement-id (string-ascii 64))
    (new-due-date uint))
  (let ((requirement (unwrap! (map-get? institution-requirements
                              { institution-id: institution-id, requirement-id: requirement-id })
                              (err u404))))
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))

    (map-set institution-requirements
      {
        institution-id: institution-id,
        requirement-id: requirement-id
      }
      (merge requirement {
        next-due-date: new-due-date
      })
    )
    (ok true)
  )
)

;; Read-only function to get a requirement
(define-read-only (get-requirement (requirement-id (string-ascii 64)))
  (map-get? reporting-requirements { requirement-id: requirement-id })
)

;; Read-only function to get institution's requirements
(define-read-only (get-institution-requirement
    (institution-id (string-ascii 64))
    (requirement-id (string-ascii 64)))
  (map-get? institution-requirements
    {
      institution-id: institution-id,
      requirement-id: requirement-id
    }
  )
)

;; Function to transfer admin rights
(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (var-set admin new-admin)
    (ok true)
  )
)
