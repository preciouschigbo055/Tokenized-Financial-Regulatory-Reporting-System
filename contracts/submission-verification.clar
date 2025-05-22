;; Submission Verification Contract
;; Records timely filing of reports

(define-data-var admin principal tx-sender)

;; Map to store submission verifications
(define-map verifications
  { verification-id: (string-ascii 64) }
  {
    institution-id: (string-ascii 64),
    requirement-id: (string-ascii 64),
    report-id: (string-ascii 64),
    submission-date: uint,
    due-date: uint,
    is-timely: bool,
    verification-date: uint
  }
)

;; Public function to verify a submission
(define-public (verify-submission
    (verification-id (string-ascii 64))
    (institution-id (string-ascii 64))
    (requirement-id (string-ascii 64))
    (report-id (string-ascii 64))
    (submission-date uint)
    (due-date uint))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (asserts! (is-none (map-get? verifications { verification-id: verification-id })) (err u100))

    (map-set verifications
      { verification-id: verification-id }
      {
        institution-id: institution-id,
        requirement-id: requirement-id,
        report-id: report-id,
        submission-date: submission-date,
        due-date: due-date,
        is-timely: (<= submission-date due-date),
        verification-date: block-height
      }
    )
    (ok verification-id)
  )
)

;; Read-only function to get verification details
(define-read-only (get-verification (verification-id (string-ascii 64)))
  (map-get? verifications { verification-id: verification-id })
)

;; Read-only function to check if a submission was timely
(define-read-only (is-submission-timely (verification-id (string-ascii 64)))
  (match (map-get? verifications { verification-id: verification-id })
    verification (ok (get is-timely verification))
    (err u404)
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
