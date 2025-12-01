import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RA01 from "../screens/RA01";
import RA02 from "../screens/RA02";
import RA03 from "../screens/RA03";
import RA04 from "../screens/RA04";
import RA05 from "../screens/RA05";
import RA06 from "../screens/RA06";
import RA07 from "../screens/RA07";
import RA08 from "../screens/RA08";
import RA09 from "../screens/RA09";
import RA10 from "../screens/RA10";
import RA11 from "../screens/RA11";
import RA12 from "../screens/RA12";
import RA13 from "../screens/RA13";
import RA14 from "../screens/RA14";
import RA15 from "../screens/RA15";
import RA16 from "../screens/RA16";
import RA17 from "../screens/RA17";
import RA18 from "../screens/RA18";
import RA19 from "../screens/RA19";
import RA20 from "../screens/RA20";
import RA21 from "../screens/RA21";
import RA22 from "../screens/RA22";
import RA23 from "../screens/RA23";
import RA24 from "../screens/RA24";
import RA25 from "../screens/RA25";
import RA26 from "../screens/RA26";
import RA27 from "../screens/RA27";
import RA28 from "../screens/RA28";
import RA29 from "../screens/RA29";
import RA30 from "../screens/RA30";
import RA31 from "../screens/RA31";
import RA32 from "../screens/RA32";
import RA33 from "../screens/RA33";
import RA34 from "../screens/RA34";
import RA35 from "../screens/RA35";
import RA36 from "../screens/RA36";
import RA37 from "../screens/RA37";
import RA38 from "../screens/RA38";
import RA39 from "../screens/RA39";
import RA40 from "../screens/RA40";
import RA41 from "../screens/RA41";
import RA42 from "../screens/RA42";
import RA43 from "../screens/RA43";
import RA44 from "../screens/RA44";
import RA45 from "../screens/RA45";
import RA46 from "../screens/RA46";
import RA47 from "../screens/RA47";
import RA48 from "../screens/RA48";
import RA49 from "../screens/RA49";
import RA50 from "../screens/RA50";
import RA51 from "../screens/RA51";
import RA52 from "../screens/RA52";
import RA53 from "../screens/RA53";
import RA54 from "../screens/RA54";
import RA55 from "../screens/RA55";
import RA56 from "../screens/RA56";
import RA57 from "../screens/RA57";
import RA58 from "../screens/RA58";
import RA59 from "../screens/RA59";
import RA60 from "../screens/RA60";
import RA61 from "../screens/RA61";
import RA62 from "../screens/RA62";
import RA63 from "../screens/RA63";
import RA64 from "../screens/RA64";
import RA65 from "../screens/RA65";
import RA66 from "../screens/RA66";
import RA67 from "../screens/RA67";
import RA68 from "../screens/RA68";
import RA69 from "../screens/RA69";
import RA70 from "../screens/RA70";
import RA71 from "../screens/RA71";
import RA72 from "../screens/RA72";
import RA73 from "../screens/RA73";
import RA74 from "../screens/RA74";
import RA75 from "../screens/RA75";
import RA76 from "../screens/RA76";
import RA77 from "../screens/RA77";
import RA78 from "../screens/RA78";
import RA79 from "../screens/RA79";
import RA80 from "../screens/RA80";
import RA81 from "../screens/RA81";
import RA82 from "../screens/RA82";
import RA83 from "../screens/RA83";
import RA84 from "../screens/RA84";
import RA85 from "../screens/RA85";
import RA86 from "../screens/RA86";
import RA87 from "../screens/RA87";
import RA88 from "../screens/RA88";
import RA89 from "../screens/RA89";
import RA90 from "../screens/RA90";
import RA91 from "../screens/RA91";
import Wallet from "../screens/Wallet";
import MoreMenu from "../screens/MoreMenu";
import Settings from "../screens/Settings";
import Help from "../screens/Help";
import About from "../screens/About";

export default function AppRouter() {
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
          <Route path="enter" element={<RA02 />} />
          <Route path="enter/details" element={<RA05 />} />
          <Route path="enter/simple" element={<RA07 />} />
          <Route path="enter/map" element={<RA06 />} />
          <Route path="enter/alt" element={<RA44 />} />
          <Route path="enter/variant-layout" element={<RA45 />} />
          <Route path="enter/variant" element={<RA38 />} />
          <Route path="enter/multi-stops" element={<RA39 />} />
          <Route path="enter/multi-stops/max" element={<RA40 />} />
          <Route path="enter/multi-stops/add" element={<RA41 />} />
          <Route path="enter/multi-stops/search-results" element={<RA43 />} />
          <Route path="commutes" element={<RA03 />} />
          <Route path="upcoming-inline" element={<RA04 />} />
          <Route path="upcoming" element={<RA49 />} />
          <Route path="schedule" element={<RA08 />} />
          <Route path="schedule/summary" element={<RA09 />} />
          <Route path="switch-rider" element={<RA10 />} />
          <Route path="switch-rider/contact" element={<RA11 />} />
          <Route path="switch-rider/manual" element={<RA12 />} />
          <Route path="switch-rider/summary" element={<RA13 />} />
          <Route path="select-type" element={<RA14 />} />
          <Route path="round-trip" element={<RA15 />} />
          <Route path="round-trip/details" element={<RA16 />} />
          <Route path="preferences/quick" element={<RA17 />} />
          <Route path="preferences/setup" element={<RA18 />} />
          <Route path="preferences/driver" element={<RA19 />} />
          <Route path="options" element={<RA20 />} />
          <Route path="payment" element={<RA21 />} />
          <Route path="searching" element={<RA22 />} />
          <Route path="driver-on-way" element={<RA23 />} />
          <Route path="driver-arrived" element={<RA24 />} />
          <Route path="trip" element={<RA25 />} />
          <Route path="trip/details" element={<RA26 />} />
          <Route path="trip/route" element={<RA27 />} />
          <Route path="trip/driver-profile" element={<RA28 />} />
          <Route path="trip/completed" element={<RA29 />} />
          <Route path="trip/share" element={<RA30 />} />
          <Route path="rating" element={<RA31 />} />
          <Route path="rating/tip" element={<RA32 />} />
          <Route path="rating/driver" element={<RA35 />} />
          <Route path="shared-passengers" element={<RA36 />} />
          <Route path="history/past" element={<RA33 />} />
          <Route path="history/upcoming" element={<RA34 />} />
          <Route path="history/:rideId" element={<RA37 />} />
          <Route path="details" element={<RA42 />} />
          <Route path="details/variant" element={<RA46 />} />
          <Route path="booking/confirmation" element={<RA47 />} />
          <Route path="booking/thank-you" element={<RA48 />} />
        </Route>

        {/* Deliveries */}
        <Route path="deliveries">
          <Route index element={<RA50 />} />
          <Route path="delivering-v2" element={<RA52 />} />
          <Route path="received" element={<RA51 />} />
          <Route path="received-v2" element={<RA53 />} />
          <Route path="received-v3" element={<RA54 />} />
          <Route path="new" element={<RA59 />} />
          <Route path="tracking/incoming" element={<RA56 />} />
          <Route path="invitations" element={<RA57 />} />
          <Route path="invitations/v2" element={<RA58 />} />
          <Route path="tracking/:orderId/received" element={<RA55 />} />
          <Route path="tracking/:orderId/en-route" element={<RA60 />} />
          <Route path="tracking/:orderId/cancel" element={<RA61 />} />
          <Route path="tracking/:orderId/live" element={<RA62 />} />
          <Route path="tracking/:orderId/driver" element={<RA63 />} />
          <Route path="tracking/:orderId/timeline" element={<RA64 />} />
          <Route path="tracking/:orderId/delivered" element={<RA65 />} />
          <Route path="tracking/:orderId/pickup-confirmed" element={<RA66 />} />
          <Route path="tracking/:orderId/rating" element={<RA67 />} />
          <Route path="tracking/:orderId/details" element={<RA68 />} />
        </Route>

        {/* Rental */}
        <Route path="rental">
          <Route index element={<RA69 />} />
          <Route path="list" element={<RA70 />} />
          <Route path="vehicle/:vehicleId" element={<RA71 />} />
          <Route path="dates" element={<RA72 />} />
          <Route path="branches" element={<RA73 />} />
          <Route path="summary" element={<RA74 />} />
          <Route path="confirmation" element={<RA75 />} />
          <Route path="history" element={<RA76 />} />
          <Route path="history/:rentalId" element={<RA90 />} />
        </Route>

        {/* Tours */}
        <Route path="tours">
          <Route index element={<RA77 />} />
          <Route path=":tourId" element={<RA78 />} />
          <Route path=":tourId/dates" element={<RA79 />} />
          <Route path=":tourId/summary" element={<RA80 />} />
          <Route path=":tourId/confirmation" element={<RA81 />} />
          <Route path="history" element={<RA82 />} />
        </Route>

        {/* Ambulance */}
        <Route path="ambulance">
          <Route index element={<RA83 />} />
          <Route path="location" element={<RA84 />} />
          <Route path="destination" element={<RA85 />} />
          <Route path="confirmation" element={<RA86 />} />
          <Route path="tracking/:requestId" element={<RA87 />} />
          <Route path="history" element={<RA88 />} />
        </Route>

        {/* Placeholder routes - Wallet is marked as "future work" in routing guide */}
        <Route path="wallet" element={<Wallet />} />
        <Route path="more" element={<MoreMenu />} />
        <Route path="settings" element={<Settings />} />
        <Route path="help" element={<Help />} />
        <Route path="about" element={<About />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

