# Screens and Routing Documentation

This document outlines all the screens available in the Rider App and their corresponding routes as defined in the system.

## 1. Landing & Authentication
* **Path:** `/` — Redirects to Home (if authenticated) or Sign In (if unauthenticated)
* **Path:** `/auth/sign-in` — Screen: `SignIn`
* **Path:** `/auth/sign-up` — Screen: `SignUp`
* **Path:** `/auth/forgot-password` — Screen: `ForgotPassword`

## 2. Core & Global Screens
* **Path:** `/home` — Screen: `Home`
* **Path:** `/history/all` — Screen: `AllHistory`

## 3. Rides (`/rides`)
* **Path:** `/rides` — Redirects to `/rides/enter`
* **Path:** `/rides/enter` — Screen: `RidesDashboard`
* **Path:** `/rides/enter/details` — Screen: `RideEnterDetails`
* **Path:** `/rides/enter/preferences` — Screen: `Preferences`
* **Path:** `/rides/enter/simple` — Screen: `RideSimple`
* **Path:** `/rides/enter/map` — Screen: `RideMap`
* **Path:** `/rides/enter/alt` — Screen: `RideAlt`
* **Path:** `/rides/enter/variant-layout` — Screen: `RideVariantLayout`
* **Path:** `/rides/enter/variant` — Screen: `RideVariant`
* **Path:** `/rides/enter/multi-stops` — Screen: `MultiStops`
* **Path:** `/rides/enter/multi-stops/max` — Screen: `MaxMultiStops`
* **Path:** `/rides/enter/multi-stops/add` — Screen: `AddStop`
* **Path:** `/rides/enter/multi-stops/search-results` — Screen: `MultiStopsSearchResults`
* **Path:** `/rides/commutes` — Screen: `Commutes`
* **Path:** `/rides/upcoming-inline` — Screen: `UpcomingInline`
* **Path:** `/rides/upcoming` — Screen: `UpcomingRides`
* **Path:** `/rides/schedule` — Screen: `ScheduleRide`
* **Path:** `/rides/schedule/summary` — Screen: `ScheduleSummary`
* **Path:** `/rides/switch-rider` — Screen: `SwitchRider`
* **Path:** `/rides/switch-rider/contact` — Screen: `SwitchRiderContact`
* **Path:** `/rides/switch-rider/summary` — Screen: `SwitchRiderSummary`
* **Path:** `/rides/select-type` — Screen: `SelectTripType`
* **Path:** `/rides/round-trip` — Screen: `RoundTrip`
* **Path:** `/rides/round-trip/details` — Screen: `RoundTripDetails`
* **Path:** `/rides/preferences/quick` — Screen: `QuickPreferences`
* **Path:** `/rides/preferences/setup` — Screen: `SetupPreferences`
* **Path:** `/rides/preferences/driver` — Screen: `DriverPreferences`
* **Path:** `/rides/options` — Screen: `RideOptions`
* **Path:** `/rides/payment` — Screen: `Payment`
* **Path:** `/rides/payment/gateway/:gatewayId` — Screen: `PaymentGatewayFlow`
* **Path:** `/rides/payment/success` — Screen: `PaymentSuccessScreen`
* **Path:** `/rides/searching` — Screen: `SearchingDriver`
* **Path:** `/rides/driver-on-way` — Screen: `DriverOnWay`
* **Path:** `/rides/driver-arrived` — Screen: `DriverArrived`
* **Path:** `/rides/trip` — Screen: `ActiveTrip`
* **Path:** `/rides/trip/details` — Screen: `TripDetails`
* **Path:** `/rides/trip/route` — Screen: `TripRoute`
* **Path:** `/rides/trip/driver-profile` — Screen: `DriverProfile`
* **Path:** `/rides/trip/completed` — Screen: `TripCompleted`
* **Path:** `/rides/trip/share` — Screen: `ShareTrip`
* **Path:** `/rides/trip/sharing` — Screen: `TripSharing`
* **Path:** `/rides/sos` — Screen: `RideSOS`
* **Path:** `/rides/rating` — Screen: `RateDriver`
* **Path:** `/rides/rating/tip` — Screen: `TipDriver`
* **Path:** `/rides/rating/driver` — Screen: `RateDriver`
* **Path:** `/rides/shared-passengers` — Screen: `SharedPassengers`
* **Path:** `/rides/history/past` — Screen: `PastRides`
* **Path:** `/rides/history/upcoming` — Screen: `UpcomingRides`
* **Path:** `/rides/history/promotions` — Screen: `RidePromotions`
* **Path:** `/rides/promotions` — Screen: `RidePromotions`
* **Path:** `/rides/history/:rideId` — Screen: `RideHistoryDetail`
* **Path:** `/rides/details` — Screen: `RideDetails`
* **Path:** `/rides/details/variant` — Screen: `RideDetailsVariant`
* **Path:** `/rides/details/confirm` — Screen: `ConfirmRideDetails`
* **Path:** `/rides/booking/confirmation` — Screen: `BookingConfirmation`
* **Path:** `/rides/booking/thank-you` — Screen: `BookingThankYou`

## 4. Deliveries (`/deliveries`)
* **Path:** `/deliveries` — Screen: `DeliveryDashboard`
* **Path:** `/deliveries/notifications` — Screen: `DeliveryNotifications`
* **Path:** `/deliveries/new` — Screen: `DeliveryNew`
* **Path:** `/deliveries/tracking/:orderId` — Screen: `DeliveryTracking`
* **Path:** `/deliveries/rating/:orderId` — Screen: `DeliveryRating`
* **Path:** `/deliveries/settlement/:orderId` — Screen: `DeliverySettlement`

## 5. Rentals (`/rental`)
* **Path:** `/rental` — Screen: `RentalDashboard`
* **Path:** `/rental/custom` — Screen: `RentalCustom`
* **Path:** `/rental/list` — Screen: `RentalList`
* **Path:** `/rental/vehicle/:vehicleId` — Screen: `RentalVehicleDetail`
* **Path:** `/rental/dates` — Screen: `RentalDates`
* **Path:** `/rental/branches` — Screen: `RentalBranches`
* **Path:** `/rental/summary` — Screen: `RentalSummary`
* **Path:** `/rental/payment/wallet` — Screen: `RentalWalletPayment`
* **Path:** `/rental/payment/processing` — Screen: `RentalPaymentProcessing`
* **Path:** `/rental/payment/card` — Screen: `RentalCardPayment`
* **Path:** `/rental/payment/mobile-money` — Screen: `RentalMobileMoneyPayment`
* **Path:** `/rental/payment/verify` — Screen: `RentalPaymentVerify`
* **Path:** `/rental/payment/success` — Screen: `RentalPaymentSuccess`
* **Path:** `/rental/payment/failed` — Screen: `RentalPaymentFailed`
* **Path:** `/rental/payment/receipt/:transactionId` — Screen: `RentalPaymentReceipt`
* **Path:** `/rental/confirmation` — Screen: `RentalConfirmation`
* **Path:** `/rental/history` — Screen: `RentalHistory`
* **Path:** `/rental/history/:rentalId` — Screen: `RentalHistoryDetail`

## 6. Tours (`/tours`)
* **Path:** `/tours` — Screen: `ToursDashboard`
* **Path:** `/tours/available` — Screen: `ToursHomeEntryScreen`
* **Path:** `/tours/new` — Screen: `ToursNew`
* **Path:** `/tours/history` — Screen: `TourHistory`
* **Path:** `/tours/:tourId` — Screen: `TourDetail`
* **Path:** `/tours/:tourId/dates` — Screen: `TourDates`
* **Path:** `/tours/:tourId/summary` — Screen: `TourSummary`
* **Path:** `/tours/:tourId/confirmation` — Screen: `TourConfirmation`
* **Path:** `/tours/payment/wallet` — Screen: `TourPaymentWallet`
* **Path:** `/tours/payment/card` — Screen: `TourPaymentCard`
* **Path:** `/tours/payment/mobile-money` — Screen: `TourPaymentMobileMoney`
* **Path:** `/tours/payment/processing` — Screen: `TourPaymentProcessing`
* **Path:** `/tours/payment/verify` — Screen: `TourPaymentVerify`
* **Path:** `/tours/payment/failed` — Screen: `TourPaymentFailed`
* **Path:** `/tours/payment/receipt/:transactionId` — Screen: `TourPaymentReceipt`

## 7. Ambulance (`/ambulance`)
* **Path:** `/ambulance` — Screen: `AmbulanceDashboard`
* **Path:** `/ambulance/location` — Screen: `AmbulanceLocation`
* **Path:** `/ambulance/destination` — Screen: `AmbulanceDestination`
* **Path:** `/ambulance/confirmation` — Screen: `AmbulanceConfirmation`
* **Path:** `/ambulance/tracking` — Screen: `AmbulanceTracking`
* **Path:** `/ambulance/history` — Screen: `AmbulanceHistory`
* **Path:** `/ambulance/history/:requestId` — Screen: `AmbulanceHistoryDetail`

## 8. Wallet, Profile, Menu & Settings
* **Path:** `/wallet` — Screen: `Wallet`
* **Path:** `/wallet/:flowType` — Screen: `WalletTransferSelectionScreen`
* **Path:** `/wallet/:flowType/:method` — Screen: `WalletTransferMethodScreen`
* **Path:** `/wallet/:flowType/:method/success` — Screen: `WalletTransferSuccessScreen`
* **Path:** `/profile` — Screen: `Profile`
* **Path:** `/manager` — Screen: `MoreMenu`
* **Path:** `/more` — Screen: `MoreMenu`
* **Path:** `/settings` — Screen: `Settings`
* **Path:** `/settings/language` — Screen: `LanguageSettings`
* **Path:** `/settings/security` — Screen: `SecuritySettings`
* **Path:** `/settings/privacy` — Screen: `PrivacySettings`
* **Path:** `/help` — Screen: `Help`
* **Path:** `/about` — Screen: `About`

## 9. School Management (`/school`)
* **Path:** `/school` — Screen: `SchoolManagementGateway`
* **Path:** `/school/dashboard` — Screen: `SchoolDashboard`
* **Path:** `/school/fees` — Screen: `SchoolFees`
* **Path:** `/school/handoff` — Screen: `SchoolHandoff`
* **Path:** `/school/book` — Screen: `SchoolFees`
* **Path:** `/school/manage` — Screen: `SchoolDashboard`
* **Path:** `/school/schedules` — Screen: `SchoolDashboard`
* **Path:** `/school/management-system` — Screen: `SchoolManagementGateway`

## Fallback
* **Path:** `*` — Unmatched paths redirect to Home or Sign In based on auth status via `AuthAwareRedirect`
