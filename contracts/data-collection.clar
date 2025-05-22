;; Data Collection Contract
;; Gathers required information from financial institutions

(define-data-var admin principal tx-sender)

;; Map to store data submissions
(define-map data-submissions
  {
    submission-id: (string-ascii 64)
  }
  {
    institution-id: (string-ascii 64),
    requirement-id: (string-ascii 64),
    data-hash: (buff 32),
    submission-date: uint,
    status: (string-ascii 20)
  }
)

;; Map to track submission metadata
(define-map submission-metadata
  { submission-id: (string-ascii 64) }
  {
    data-location: (string-ascii 255),
    data-format: (string-ascii 20),
    submitter: principal,
    notes: (string-ascii 255)
  }
)

;; Public function for institutions to submit data
(define-public (submit-data
    (submission-id (string-ascii 64))
    (institution-id (string-ascii 64))
    (requirement-id (string-ascii 64))
    (data-hash (buff 32))
    (data-location (string-ascii 255))
    (data-format (string-ascii 20))
    (notes (string-ascii 255)))
  (begin
    (asserts! (is-none (map-get? data-submissions { submission-id: submission-id })) (err u100))

    (map-set data-submissions
      { submission-id: submission-id }
      {
        institution-id: institution-id,
        requirement-id: requirement-id,
        data-hash: data-hash,
        submission-date: block-height,
        status: "pending"
      }
    )

    (map-set submission-metadata
      { submission-id: submission-id }
      {
        data-location: data-location,
        data-format: data-format,
        submitter: tx-sender,
        notes: notes
      }
    )
    (ok submission-id)
  )
)

;; Public function for admin to validate submitted data
(define-public (validate-submission
    (submission-id (string-ascii 64))
    (status (string-ascii 20)))
  (let ((submission (unwrap! (map-get? data-submissions { submission-id: submission-id }) (err u404))))
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (asserts! (or (is-eq status "approved") (is-eq status "rejected")) (err u400))

    (map-set data-submissions
      { submission-id: submission-id }
      (merge submission {
        status: status
      })
    )
    (ok true)
  )
)

;; Read-only function to get submission details
(define-read-only (get-submission (submission-id (string-ascii 64)))
  (map-get? data-submissions { submission-id: submission-id })
)

;; Read-only function to get submission metadata
(define-read-only (get-submission-metadata (submission-id (string-ascii 64)))
  (map-get? submission-metadata { submission-id: submission-id })
)

;; Function to transfer admin rights
(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (var-set admin new-admin)
    (ok true)
  )
)
