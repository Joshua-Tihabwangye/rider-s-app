
# EVzone Rider / Customer App – Routing Guide (RA01–RA91)

This document maps all **91 Rider / Customer App screens** (RA01–RA91) to:

- Their **logical routes / paths**
- How they **connect and flow** into each other
- Which **vertical** they belong to (Rides, Deliveries, Rental, Tours, Ambulance, School, Global)

The examples assume a web-style router (e.g. React Router v6), but the structure also applies to mobile stacks (React Navigation, etc.).

---


## 1. Global Navigation Model

### 1.1 Bottom Tabs (Always Visible in Rider App)

Primary bottom navigation:

- **Home** → `/home` (RA01 + service shortcuts)
- **Rides** → `/rides/...` (RidesDashboard + RA03–RA49)
- **Deliveries** → `/deliveries/...` (DeliveriesDashboard + RA51–RA68)
- **Wallet** → `/wallet` (Wallet component)
- **More** → `/more` (settings, help, global history RA91, etc.)

Top-level routes:

```text
/                 (redirect → /home)
/home             (RA01)
/rides/*          (RidesDashboard + RA03–RA49)
/deliveries/*     (DeliveriesDashboard + RA51–RA68)
/rental/*         (RentalDashboard + RA70–RA76, RA90)
/tours/*          (ToursDashboard + RA78–RA82)
/ambulance/*      (AmbulanceDashboard + RA84–RA88)
/wallet           (Wallet)
/more             (MoreMenu)
/settings         (Settings)
/help             (Help)
/about            (About)
/school           (SchoolDashboard)
/school-handoff   (RA89)
/history/all      (RA91)
```


## 2. Home & Global Screens

### 2.1 Super App Home & Service Picker

**RA01 – Home Dashboard – EVzone Super App**

- Path: `/home`
- Role: Landing screen with grid of services:
  - Ride, Delivery, Rental, Tours, School, Ambulance.
- From here:
  - Ride → `/rides/enter` (RidesDashboard) or `/rides/enter/details` (RA05/RA38/RA44/RA45)
  - Delivery → `/deliveries` (DeliveriesDashboard) or `/deliveries/new` (RA59)
  - Rental → `/rental` (RentalDashboard)
  - Tours → `/tours` (ToursDashboard)
  - Ambulance → `/ambulance` (AmbulanceDashboard)
  - School → `/school` (SchoolDashboard) or `/school-handoff` (RA89)
  - Wallet → `/wallet` (Wallet)

### 2.2 School Dashboard & Handoff

**SchoolDashboard – School Shuttles Dashboard**

- Path: `/school`
- Role: Quick overview of children, routes, and shuttle notifications with links to the School app.

**RA89 – School Shuttles Handoff**

- Path: `/school-handoff`
- Role: Explain that school shuttles live in a separate School/Parents app and deep-link there.

### 2.3 Additional Global Routes

**Wallet – Wallet Home**

- Path: `/wallet`
- Role: View balance, add/send money, manage payment methods, and view transaction history.

**MoreMenu – More Menu**

- Path: `/more`
- Role: Access to settings, help, about, and global history (RA91).

**Settings – App Settings**

- Path: `/settings`
- Role: App preferences, account settings, and configuration options.

**Help – Help & Support**

- Path: `/help`
- Role: Help articles, FAQs, and support contact information.

**About – About EVzone**

- Path: `/about`
- Role: App information, version details, and legal links.

### 2.4 Global All-Orders History

**RA91 – All Orders – Combined History**

- Path: `/history/all`
- Role: Unified history across:
  - Rides, Deliveries, Rentals, Tours, Ambulance.
- From each row:
  - Ride → `/rides/history/:rideId` (RA37)
  - Delivery → `/deliveries/tracking/:orderId/details` (RA68)
  - Rental → `/rental/history/:rentalId` (RA90)
  - Tour → `/tours/history` (RA82) then specific tour
  - Ambulance → `/ambulance/history` (RA88) and tracking.


## 3. Rides Vertical (RidesDashboard + RA03–RA49)

### 3.1 Core Ride Entry & Planning

**RidesDashboard – Enter Destination Dashboard** → `/rides/enter`  
**RA03 – Daily Commutes** → `/rides/commutes` (or tab in RidesDashboard)  
**RA04 – Upcoming Rides – Inline** → `/rides/upcoming-inline`  
**RA05 – Enter Destination – Expanded Trip Setup** → `/rides/enter/details`  
**RA06 – Pick Your Destination – Map Selection** → `/rides/enter/map`  
**RA07 – Enter Destination – Simplified View** → `/rides/enter/simple`  
**RA08 – Schedule Ride – Date & Time** → `/rides/schedule`  
**RA09 – Ride Later – Scheduled Summary** → `/rides/schedule/summary`

> **Note:** The entry point `/rides/enter` uses `RidesDashboard` instead of RA02. RA02 exists but is not currently routed.

Typical flow (Ride now, one way):

```text
RA01 → RidesDashboard (/rides/enter)
  (optional RA03 / RA04 tabs)
  → RA05 for full details
```

Ride later:

```text
RidesDashboard (Ride Later) → RA08 (date/time) → RA09 (summary) → RA49/RA34 upcoming
```

From RidesDashboard/RA05 you can also open map (RA06) and variants (RA38/RA44/RA45).

### 3.2 Switch Rider / Ride for Someone Else

**RA10 – Switch Rider (chooser)** → `/rides/switch-rider`  
**RA11 – Switch Rider (Contact selected)** → `/rides/switch-rider/contact`  
**RA12 – Switch Rider (Manual entry)** → `/rides/switch-rider/manual`  
**RA13 – Ride for Contact (Summary)** → `/rides/switch-rider/summary`

These are opened from RA05/RA20 to specify “Ride for me / contact / someone else”, then return to RA20/RA21 with rider context.

### 3.3 Trip Type, Round Trip & Preferences

**RA14 – Select Ride Type** → `/rides/select-type`  
**RA15 – Round Trip Toggle** → `/rides/round-trip`  
**RA16 – Round Trip Details** → `/rides/round-trip/details`  
**RA17 – Preference Selection** → `/rides/preferences/quick`  
**RA18 – Ride Preference Setup** → `/rides/preferences/setup`  
**RA19 – Driver Preferences** → `/rides/preferences/driver`

Segment:

```text
RA05/RA07/RA38
  → RA14
  → (RA15/RA16 if round trip)
  → (optional RA17/RA18/RA19)
  → RA20
```

### 3.4 Final Ride Selection & Payment

**RA20 – Select Your Ride** → `/rides/options`  
**RA21 – Payment Method Selection** → `/rides/payment`

From RA21 you go to matching:

```text
RA20 → RA21 → RA22
```

### 3.5 Matching & Driver Arrival

**RA22 – Searching for Driver** → `/rides/searching`  
**RA23 – Driver Assigned / On The Way** → `/rides/driver-on-way`  
**RA24 – Driver Has Arrived / Start Trip** → `/rides/driver-arrived`

Flows:

```text
RA21 → RA22 → RA23 → RA24 → RA25/RA26/RA27
```

### 3.6 Trip in Progress & Driver Profile

**RA25 – Trip in Progress – Basic** → `/rides/trip`  
**RA26 – Trip in Progress – With Driver & Vehicle info** → `/rides/trip/details`  
**RA27 – Trip in Progress – Expanded Route Details** → `/rides/trip/route`  
**RA28 – Driver Profile During Trip** → `/rides/trip/driver-profile`

### 3.7 Trip Completed, Sharing & Rating

**RA29 – Trip Completed – Arrival Summary** → `/rides/trip/completed`  
**RA30 – Share Ride / Passengers** → `/rides/trip/share`  
**RA31 – Ride Rating & Feedback** → `/rides/rating`  
**RA32 – Ride Rating + Tip** → `/rides/rating/tip`  
**RA35 – Rate Driver & Add Tip (Dedicated)** → `/rides/rating/driver`  
**RA36 – Shared Passengers Screen** → `/rides/shared-passengers`

### 3.8 Ride History & Completed Trip Detail

**RA33 – Ride History – Past Trips** → `/rides/history/past`  
**RA34 – Ride History – Upcoming Trips** → `/rides/history/upcoming`  
**RA37 – Ride Info – Completed Trip Summary** → `/rides/history/:rideId`  
**RA49 – Upcoming Rides – Dedicated Screen** → `/rides/upcoming`


### 3.9 Multi-stop & Booking Variants

**RA38 – Enter Destination – Variant (Single / Multi)** → `/rides/enter/variant`  
**RA39 – Enter Destination – Multiple Stops** → `/rides/enter/multi-stops`  
**RA40 – Enter Destination – Maximum Stops Reached** → `/rides/enter/multi-stops/max`  
**RA41 – Add Stop – Search Overlay** → `/rides/enter/multi-stops/add`  
**RA43 – Add Stop – Search Results** → `/rides/enter/multi-stops/search-results`  

**RA42 – Ride Details – Pre Confirm View (Variant 1)** → `/rides/details`  
**RA46 – Ride Details – Variant 2** → `/rides/details/variant`  
**RA47 – Ride Details – Booking Confirmation** → `/rides/booking/confirmation`  
**RA48 – Ride Booking Confirmation – Thank You** → `/rides/booking/thank-you`  

**RA44 – Where to Today? – Alternate Entry** → `/rides/enter/alt`  
**RA45 – Enter Destination – Variant Layout** → `/rides/enter/variant-layout`

Typical multi-stop flow:

```text
RA01 → RidesDashboard/RA38/RA44/RA45
  → RA39 (multi stops)
    → RA41 / RA43 (add stop)
    → RA40 (max stops reached)
  → RA42/RA46 (pre-confirm)
  → RA47 (booking confirmation)
  → RA48 (thank you)
  → RA22+ (matching and trip lifecycle)
```


## 5. Deliveries Vertical (DeliveriesDashboard + RA51–RA68)

### 5.1 Deliveries Dashboard (Sending & Receiving)

**DeliveriesDashboard – Deliveries Home Dashboard** → `/deliveries`  
**RA52 – Deliveries Dashboard – Delivering Tab v2** → `/deliveries/delivering-v2`  

**RA51 – Deliveries Dashboard – Received Tab v1** → `/deliveries/received`  
**RA53 – Deliveries Dashboard – Received Tab v2** → `/deliveries/received-v2`  
**RA54 – Deliveries Dashboard – Received Tab v3** → `/deliveries/received-v3`

> **Note:** The entry point `/deliveries` uses `DeliveriesDashboard` instead of RA50. RA50 exists but is not currently routed.

### 5.2 Tracking & Invitations

**RA55 – Shipment Tracking – Received Parcel** → `/deliveries/tracking/:orderId/received`  
**RA56 – Incoming Tracking Requests** → `/deliveries/tracking/incoming`  
**RA57 – Invitations – Pending v1** → `/deliveries/invitations`  
**RA58 – Invitations – Pending v2** → `/deliveries/invitations/v2`


### 5.3 Order Setup & Active Tracking

**RA59 – Order Delivery – Address & Parcel Setup** → `/deliveries/new`  

Active tracking views (different states for same order):

- **RA60 – Package Tracking – En Route** → `/deliveries/tracking/:orderId/en-route`  
- **RA61 – Active Delivery – With Cancel Option** → `/deliveries/tracking/:orderId/cancel`  
- **RA62 – Active Delivery – Live Package Tracking** → `/deliveries/tracking/:orderId/live`  
- **RA63 – Active Delivery – Driver Info & Live Tracking** → `/deliveries/tracking/:orderId/driver`

### 5.4 Status, Completion & Detailed View

**RA64 – Delivery Status – Order Progress Timeline** → `/deliveries/tracking/:orderId/timeline`  
**RA65 – Order Delivered – Confirmation** → `/deliveries/tracking/:orderId/delivered`  
**RA66 – Pick Up Confirmed – Order Details** → `/deliveries/tracking/:orderId/pickup-confirmed`  
**RA67 – Order Completion – Rating Prompt** → `/deliveries/tracking/:orderId/rating`  
**RA68 – Order Delivery – Detailed View** → `/deliveries/tracking/:orderId/details`

Typical delivery flow:

```text
RA01/DeliveriesDashboard → RA59
  → RA60/RA61/RA62/RA63
  → RA64/RA66
  → RA65
  → RA67
  → RA68 (detail & receipt)
```


## 6. Rental Vertical (RentalDashboard + RA70–RA76, RA90)

### 6.1 Rental Entry & Vehicle Selection

**RentalDashboard – Rental Home Dashboard** → `/rental`  
**RA70 – Rental Vehicle List** → `/rental/list`  
**RA71 – Rental Vehicle Detail** → `/rental/vehicle/:vehicleId`

> **Note:** The entry point `/rental` uses `RentalDashboard` instead of RA69. RA69 exists but is not currently routed.

### 6.2 Dates, Branches & Payment

**RA72 – Rental Dates & Duration** → `/rental/dates`  
**RA73 – Rental Pickup/Return Branches** → `/rental/branches`  
**RA74 – Rental Summary & Payment** → `/rental/summary`

### 6.3 Booking Confirmation & History

**RA75 – Rental Booking Confirmation** → `/rental/confirmation`  
**RA76 – Rental Upcoming & History** → `/rental/history`  
**RA90 – Rental Booking Detail** → `/rental/history/:rentalId`

Typical rental flow:

```text
RA01 → RentalDashboard
  → RA70
  → RA71
  → RA72
  → RA73
  → RA74
  → RA75
  → RA76
  → RA90 (from history)
```


## 7. Tours Vertical (ToursDashboard + RA78–RA82)

### 7.1 Discovery & Booking

**ToursDashboard – Tours Home Dashboard** → `/tours`  
**RA78 – Tours – Detail** → `/tours/:tourId`  
**RA79 – Tours – Date & Guests** → `/tours/:tourId/dates`

> **Note:** The entry point `/tours` uses `ToursDashboard` instead of RA77. RA77 exists but is not currently routed.

### 7.2 Summary, Payment, Confirmation & History

**RA80 – Tour Booking – Summary & Payment** → `/tours/:tourId/summary`  
**RA81 – Tour Booking – Confirmation** → `/tours/:tourId/confirmation`  
**RA82 – Tours – Upcoming & History** → `/tours/history`

Typical tours flow:

```text
RA01 → ToursDashboard
  → RA78
  → RA79
  → RA80
  → RA81
  → RA82
```


## 8. Ambulance Vertical (AmbulanceDashboard + RA84–RA88)

> EMS is branded as **Ambulance** in the customer app.

### 8.1 Request Setup

**AmbulanceDashboard – Ambulance Home Dashboard** → `/ambulance`  
**RA84 – Ambulance – Location & Patient Details** → `/ambulance/location`  
**RA85 – Ambulance – Destination Hospital** → `/ambulance/destination`

> **Note:** The entry point `/ambulance` uses `AmbulanceDashboard` instead of RA83. RA83 exists but is not currently routed.

### 8.2 Confirmation, Live Tracking & History

**RA86 – Ambulance – Request Confirmation & ETA** → `/ambulance/confirmation`  
**RA87 – Ambulance – Live Tracking** → `/ambulance/tracking/:requestId`  
**RA88 – Ambulance – Requests History** → `/ambulance/history`

Typical ambulance flow:

```text
RA01 → AmbulanceDashboard
  → RA84
  → RA85
  → RA86
  → RA87
  → RA88 (for past requests)
```


## 9. School Handoff & Global History

### 9.1 School Shuttles Handoff

**RA89 – School – Handoff to School App** → `/school-handoff`  
Explains that school shuttle booking and tracking is done in a separate app and provides a deep link / CTA.

### 9.2 All Orders Combined History

**RA91 – All Orders – Combined History** → `/history/all`  

From each item:

- Ride → `/rides/history/:rideId` (RA37)  
- Delivery → `/deliveries/tracking/:orderId/details` (RA68)  
- Rental → `/rental/history/:rentalId` (RA90)  
- Tour → `/tours/history` (RA82) then drill to RA78/RA81  
- Ambulance → `/ambulance/history` (RA88) / `/ambulance/tracking/:requestId` (RA87)

This is the “single pane of glass” for the customer’s multi-vertical activity.


## 10. Example React Router Wiring (Reference)

Below is an example of how these routes are wired using `react-router-dom` in the current implementation.  
Component names match the actual codebase.

```jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import RA01 from "./screens/RA01";
import RA03 from "./screens/RA03";
// ... (all RA screens RA03-RA91, excluding RA02, RA50, RA69, RA77, RA83)
import RidesDashboard from "./screens/RidesDashboard";
import DeliveriesDashboard from "./screens/DeliveriesDashboard";
import RentalDashboard from "./screens/RentalDashboard";
import ToursDashboard from "./screens/ToursDashboard";
import AmbulanceDashboard from "./screens/AmbulanceDashboard";
import SchoolDashboard from "./screens/SchoolDashboard";
import Wallet from "./screens/Wallet";
import MoreMenu from "./screens/MoreMenu";
import Settings from "./screens/Settings";
import Help from "./screens/Help";
import About from "./screens/About";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home & Global */}
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<RA01 />} />
        <Route path="school-handoff" element={<RA89 />} />
        <Route path="history/all" element={<RA91 />} />

        {/* Rides */}
        <Route path="rides">
          <Route index element={<Navigate to="/rides/enter" replace />} />
          <Route path="enter" element={<RidesDashboard />} />
            <Route path="enter/details" element={<ScreenRA05 />} />
            <Route path="enter/simple" element={<ScreenRA07 />} />
            <Route path="enter/map" element={<ScreenRA06 />} />
            <Route path="enter/alt" element={<ScreenRA44 />} />
            <Route path="enter/variant-layout" element={<ScreenRA45 />} />
            <Route path="enter/variant" element={<ScreenRA38 />} />
            <Route path="enter/multi-stops" element={<ScreenRA39 />} />
            <Route path="enter/multi-stops/max" element={<ScreenRA40 />} />
            <Route path="enter/multi-stops/add" element={<ScreenRA41 />} />
            <Route
              path="enter/multi-stops/search-results"
              element={<ScreenRA43 />}
            />

            <Route path="commutes" element={<ScreenRA03 />} />
            <Route path="upcoming-inline" element={<ScreenRA04 />} />
            <Route path="upcoming" element={<ScreenRA49 />} />

            <Route path="schedule" element={<ScreenRA08 />} />
            <Route
              path="schedule/summary"
              element={<ScreenRA09 />}
            />

            <Route path="switch-rider" element={<ScreenRA10 />} />
            <Route
              path="switch-rider/contact"
              element={<ScreenRA11 />}
            />
            <Route
              path="switch-rider/manual"
              element={<ScreenRA12 />}
            />
            <Route
              path="switch-rider/summary"
              element={<ScreenRA13 />}
            />

            <Route path="select-type" element={<ScreenRA14 />} />
            <Route path="round-trip" element={<ScreenRA15 />} />
            <Route
              path="round-trip/details"
              element={<ScreenRA16 />}
            />

            <Route
              path="preferences/quick"
              element={<ScreenRA17 />}
            />
            <Route
              path="preferences/setup"
              element={<ScreenRA18 />}
            />
            <Route
              path="preferences/driver"
              element={<ScreenRA19 />}
            />

            <Route path="options" element={<ScreenRA20 />} />
            <Route path="payment" element={<ScreenRA21 />} />
            <Route path="searching" element={<ScreenRA22 />} />
            <Route
              path="driver-on-way"
              element={<ScreenRA23 />}
            />
            <Route
              path="driver-arrived"
              element={<ScreenRA24 />}
            />

            <Route path="trip" element={<ScreenRA25 />} />
            <Route
              path="trip/details"
              element={<ScreenRA26 />}
            />
            <Route
              path="trip/route"
              element={<ScreenRA27 />}
            />
            <Route
              path="trip/driver-profile"
              element={<ScreenRA28 />}
            />
            <Route
              path="trip/completed"
              element={<ScreenRA29 />}
            />
            <Route
              path="trip/share"
              element={<ScreenRA30 />}
            />

            <Route path="rating" element={<ScreenRA31 />} />
            <Route
              path="rating/tip"
              element={<ScreenRA32 />}
            />
            <Route
              path="rating/driver"
              element={<ScreenRA35 />}
            />
            <Route
              path="shared-passengers"
              element={<ScreenRA36 />}
            />

            <Route
              path="history/past"
              element={<ScreenRA33 />}
            />
            <Route
              path="history/upcoming"
              element={<ScreenRA34 />}
            />
            <Route
              path="history/:rideId"
              element={<ScreenRA37 />}
            />

            <Route path="details" element={<ScreenRA42 />} />
            <Route
              path="details/variant"
              element={<ScreenRA46 />}
            />
            <Route
              path="booking/confirmation"
              element={<ScreenRA47 />}
            />
            <Route
              path="booking/thank-you"
              element={<ScreenRA48 />}
            />
          </Route>

          {/* Deliveries */}
          <Route path="deliveries">
            <Route index element={<DeliveriesDashboard />} />
            <Route
              path="received"
              element={<ScreenRA51 />}
            />
            <Route
              path="delivering-v2"
              element={<ScreenRA52 />}
            />
            <Route
              path="received-v2"
              element={<ScreenRA53 />}
            />
            <Route
              path="received-v3"
              element={<ScreenRA54 />}
            />

            <Route path="new" element={<ScreenRA59 />} />
            <Route
              path="tracking/incoming"
              element={<ScreenRA56 />}
            />
            <Route
              path="invitations"
              element={<ScreenRA57 />}
            />
            <Route
              path="invitations/v2"
              element={<ScreenRA58 />}
            />

            <Route
              path="tracking/:orderId/received"
              element={<ScreenRA55 />}
            />
            <Route
              path="tracking/:orderId/en-route"
              element={<ScreenRA60 />}
            />
            <Route
              path="tracking/:orderId/cancel"
              element={<ScreenRA61 />}
            />
            <Route
              path="tracking/:orderId/live"
              element={<ScreenRA62 />}
            />
            <Route
              path="tracking/:orderId/driver"
              element={<ScreenRA63 />}
            />
            <Route
              path="tracking/:orderId/timeline"
              element={<ScreenRA64 />}
            />
            <Route
              path="tracking/:orderId/delivered"
              element={<ScreenRA65 />}
            />
            <Route
              path="tracking/:orderId/pickup-confirmed"
              element={<ScreenRA66 />}
            />
            <Route
              path="tracking/:orderId/rating"
              element={<ScreenRA67 />}
            />
            <Route
              path="tracking/:orderId/details"
              element={<ScreenRA68 />}
            />
          </Route>

          {/* Rental */}
          <Route path="rental">
            <Route index element={<RentalDashboard />} />
            <Route path="list" element={<ScreenRA70 />} />
            <Route
              path="vehicle/:vehicleId"
              element={<ScreenRA71 />}
            />
            <Route path="dates" element={<ScreenRA72 />} />
            <Route
              path="branches"
              element={<ScreenRA73 />}
            />
            <Route
              path="summary"
              element={<ScreenRA74 />}
            />
            <Route
              path="confirmation"
              element={<ScreenRA75 />}
            />
            <Route
              path="history"
              element={<ScreenRA76 />}
            />
            <Route
              path="history/:rentalId"
              element={<ScreenRA90 />}
            />
          </Route>

          {/* Tours */}
          <Route path="tours">
            <Route index element={<ToursDashboard />} />
            <Route
              path=":tourId"
              element={<ScreenRA78 />}
            />
            <Route
              path=":tourId/dates"
              element={<ScreenRA79 />}
            />
            <Route
              path=":tourId/summary"
              element={<ScreenRA80 />}
            />
            <Route
              path=":tourId/confirmation"
              element={<ScreenRA81 />}
            />
            <Route
              path="history"
              element={<ScreenRA82 />}
            />
          </Route>

          {/* Ambulance */}
          <Route path="ambulance">
            <Route index element={<AmbulanceDashboard />} />
            <Route
              path="location"
              element={<ScreenRA84 />}
            />
            <Route
              path="destination"
              element={<ScreenRA85 />}
            />
            <Route
              path="confirmation"
              element={<ScreenRA86 />}
            />
            <Route
              path="tracking/:requestId"
              element={<ScreenRA87 />}
            />
            <Route
              path="history"
              element={<ScreenRA88 />}
            />
          </Route>

          {/* Global/Misc routes */}
          <Route path="wallet" element={<Wallet />} />
          <Route path="more" element={<MoreMenu />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help" element={<Help />} />
          <Route path="about" element={<About />} />
          <Route path="school" element={<SchoolDashboard />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
```

This wiring matches the current implementation and ensures **every route** has a home in the navigation graph. Note that dashboard components (`RidesDashboard`, `DeliveriesDashboard`, `RentalDashboard`, `ToursDashboard`, `AmbulanceDashboard`) are used as entry points instead of the original RA screens (RA02, RA50, RA69, RA77, RA83), though those RA screens still exist in the codebase.
