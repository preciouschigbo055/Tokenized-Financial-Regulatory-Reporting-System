;; Report Generation Contract
;; Creates standardized documents from collected data

(define-data-var admin principal tx-sender)

;; Map to store generated reports
(define-map reports
  { report-id: (string-ascii 64) }
  {
    institution-id: (string-ascii 64),
    requirement-id: (string-ascii 64),
    submission-ids: (list 10 (string-ascii 64)),
    report-hash: (buff 32),
    generation-date: uint,
    status: (string-ascii 20)
  }
)

;; Map to store report metadata
(define-map report-metadata
  { report-id: (string-ascii 64) }
  {
    report-location: (string-ascii 255),
    report-format: (string-ascii 20),
    generator: principal,
    notes: (string-ascii 255)
  }
)

;; Public function to generate a report
(define-public (generate-report
    (report-id (string-ascii 64))
    (institution-id (string-ascii 64))
    (requirement-id (string-ascii 64))
    (submission-ids (list 10 (string-ascii 64)))
    (report-hash (buff 32))
    (report-location (string-ascii 255))
    (report-format (string-ascii 20))
    (notes (string-ascii 255)))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (asserts! (is-none (map-get? reports { report-id: report-id })) (err u100))

    (map-set reports
      { report-id: report-id }
      {
        institution-id: institution-id,
        requirement-id: requirement-id,
        submission-ids: submission-ids,
        report-hash: report-hash,
        generation-date: block-height,
        status: "generated"
      }
    )

    (map-set report-metadata
      { report-id: report-id }
      {
        report-location: report-location,
        report-format: report-format,
        generator: tx-sender,
        notes: notes
      }
    )
    (ok report-id)
  )
)

;; Public function to finalize a report
(define-public (finalize-report (report-id (string-ascii 64)))
  (let ((report (unwrap! (map-get? reports { report-id: report-id }) (err u404))))
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))

    (map-set reports
      { report-id: report-id }
      (merge report {
        status: "finalized"
      })
    )
    (ok true)
  )
)

;; Read-only function to get report details
(define-read-only (get-report (report-id (string-ascii 64)))
  (map-get? reports { report-id: report-id })
)

;; Read-only function to get report metadata
(define-read-only (get-report-metadata (report-id (string-ascii 64)))
  (map-get? report-metadata { report-id: report-id })
)

;; Function to transfer admin rights
(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (var-set admin new-admin)
    (ok true)
  )
)
