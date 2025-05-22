;; Institution Verification Contract
;; Validates and tracks financial entities

(define-data-var admin principal tx-sender)

;; Map to store verified institutions
(define-map institutions
  { institution-id: (string-ascii 64) }
  {
    name: (string-ascii 100),
    address: (string-ascii 100),
    license-number: (string-ascii 50),
    verified: bool,
    verification-date: uint
  }
)

;; Public function to register a new institution
(define-public (register-institution
    (institution-id (string-ascii 64))
    (name (string-ascii 100))
    (address (string-ascii 100))
    (license-number (string-ascii 50)))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (asserts! (is-none (map-get? institutions { institution-id: institution-id })) (err u100))

    (map-set institutions
      { institution-id: institution-id }
      {
        name: name,
        address: address,
        license-number: license-number,
        verified: false,
        verification-date: u0
      }
    )
    (ok institution-id)
  )
)

;; Public function to verify an institution
(define-public (verify-institution (institution-id (string-ascii 64)))
  (let ((institution (unwrap! (map-get? institutions { institution-id: institution-id }) (err u404))))
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))

    (map-set institutions
      { institution-id: institution-id }
      (merge institution {
        verified: true,
        verification-date: block-height
      })
    )
    (ok true)
  )
)

;; Read-only function to check if an institution is verified
(define-read-only (is-institution-verified (institution-id (string-ascii 64)))
  (match (map-get? institutions { institution-id: institution-id })
    institution (ok (get verified institution))
    (err u404)
  )
)

;; Read-only function to get institution details
(define-read-only (get-institution (institution-id (string-ascii 64)))
  (map-get? institutions { institution-id: institution-id })
)

;; Function to transfer admin rights
(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (var-set admin new-admin)
    (ok true)
  )
)
