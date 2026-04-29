# Tours Workflow (Route + State + UI Flow)

This document maps the end-to-end Tours journey and how pages connect in the current app.

## Route Map

- `/tours` -> `ToursDashboard`
- `/tours/available` -> `ToursHomeEntryScreen`
- `/tours/new` -> `ToursNew` (custom tour / quote request)
- `/tours/:tourId` -> `TourDetail`
- `/tours/:tourId/dates` -> `TourDates`
- `/tours/:tourId/summary` -> `TourSummary`
- `/tours/payment/wallet` -> `TourPaymentWallet`
- `/tours/payment/card` -> `TourPaymentCard`
- `/tours/payment/mobile-money` -> `TourPaymentMobileMoney`
- `/tours/payment/processing` -> `TourPaymentProcessing`
- `/tours/payment/verify` -> `TourPaymentVerify`
- `/tours/payment/failed` -> `TourPaymentFailed`
- `/tours/payment/receipt/:transactionId` -> `TourPaymentReceipt`
- `/tours/:tourId/confirmation` -> `TourConfirmation`
- `/tours/history` -> `TourHistory`

## Flowchart

```mermaid
flowchart TD
  A["/tours<br/>Dashboard"] -->|Browse all tours| B["/tours/available<br/>Browse Catalog"]
  A -->|Book featured / Upcoming item| C["/tours/:tourId<br/>Tour Detail"]
  A -->|Build custom / Request quote| D["/tours/new<br/>Custom Tour"]
  A -->|View all upcoming| H["/tours/history<br/>My Tours"]

  B -->|Select a tour card| C
  D -->|Continue to dates| E["/tours/:tourId/dates<br/>Date & Guests"]
  C -->|Select date & guests| E

  E -->|Continue to payment| F["/tours/:tourId/summary<br/>Review + Payment Method"]
  F -->|Wallet| G1["/tours/payment/wallet"]
  F -->|Card| G2["/tours/payment/card"]
  F -->|Mobile money| G3["/tours/payment/mobile-money"]

  G1 --> P["/tours/payment/processing"]
  G2 --> P
  G3 --> P

  P -->|Success| R["/tours/payment/receipt/:transactionId"]
  P -->|Requires OTP| V["/tours/payment/verify"]
  P -->|Declined/failed/timeout| X["/tours/payment/failed"]

  V -->|Correct OTP| R
  V -->|Wrong OTP| V

  X -->|Try again| G1
  X -->|Try again| G2
  X -->|Try again| G3
  X -->|Choose another method| F

  R -->|Continue| CFM["/tours/:tourId/confirmation"]
  R -->|View tour details| C

  CFM -->|Add to calendar| H
  CFM -->|Back to home| HOME["/home"]
```

## Page Interconnection Notes

- Tour selection happens on dashboard, browse list, and history cards, then route enters `/:tourId`.
- `TourDates` writes booking core fields: `date`, `timeSlot`, `adults`, `children`, `guests`.
- `TourSummary` initializes payment session and sends user to gateway pages by selected method.
- `TourPaymentProcessing` drives final outcome:
  - success -> receipt
  - verification needed -> OTP page
  - failure -> failed page
- `TourPaymentReceipt` is the only page that links directly to confirmation.
- `TourHistory` is fed from persisted `tours.bookings` (confirmed/pending/failed states).

## Inputs and Buttons by Stage

- `ToursHomeEntryScreen`: search text, category chips, tour cards.
- `ToursNew`: tour type, destination, dates, group size, special requests, submit.
- `TourDates`: date input, time slot chips, adults +/- , children +/- , continue.
- `TourSummary`: payment method cards, terms checkbox, confirm & pay.
- `TourPaymentCard`: cardholder/card number/expiry/cvv/billing inputs, pay now.
- `TourPaymentMobileMoney`: provider + phone, send payment prompt.
- `TourPaymentWallet`: wallet validation + pay button.
- `TourPaymentVerify`: OTP input, verify button.

## State Machine (High-Level)

- Booking status:
  - `draft` -> `pending_payment` -> `confirmed`
  - `pending_payment` -> `failed_payment` (if gateway fails)
- Payment status:
  - `pending` -> `processing` -> `successful`
  - `processing` -> `requires_verification` -> `successful`
  - `processing` -> `failed|declined|timeout|insufficient_funds`

## Gaps Fixed

The following gaps were patched:

- Booking details persistence:
  - Added `timeSlot`, `adults`, `children` to `TourBooking`.
  - `TourDates` now persists those values into shared booking state.
  - `TourSummary` now reads from persisted booking state first (route state is fallback).
  - `TourConfirmation` now displays persisted `timeSlot`.
- Custom-tour handoff:
  - `TourDates` now pre-fills date/group when opened from `/tours/new`.
- Payment-method switching:
  - `TourPaymentWallet` “Choose another payment method” now returns to
    `/:tourId/summary` (instead of generic `/tours`) when possible.
