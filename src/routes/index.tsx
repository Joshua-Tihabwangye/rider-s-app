import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import SignIn from "../screens/auth/SignIn";
import SignUp from "../screens/auth/SignUp";
import ForgotPassword from "../screens/auth/ForgotPassword";
import Home from "../screens/Home";
import Commutes from "../screens/Commutes";
import UpcomingInline from "../screens/UpcomingInline";
import RideEnterDetails from "../screens/RideEnterDetails";
import RideMap from "../screens/RideMap";
import RideSimple from "../screens/RideSimple";
import ScheduleRide from "../screens/ScheduleRide";
import ScheduleSummary from "../screens/ScheduleSummary";
import SwitchRider from "../screens/SwitchRider";
import SwitchRiderContact from "../screens/SwitchRiderContact";
import SwitchRiderManual from "../screens/SwitchRiderManual";
import SwitchRiderSummary from "../screens/SwitchRiderSummary";
import SelectTripType from "../screens/SelectTripType";
import RoundTrip from "../screens/RoundTrip";
import RoundTripDetails from "../screens/RoundTripDetails";
import QuickPreferences from "../screens/QuickPreferences";
import SetupPreferences from "../screens/SetupPreferences";
import DriverPreferences from "../screens/DriverPreferences";
import RideOptions from "../screens/RideOptions";
import Payment from "../screens/Payment";
import SearchingDriver from "../screens/SearchingDriver";
import DriverOnWay from "../screens/DriverOnWay";
import DriverArrived from "../screens/DriverArrived";
import ActiveTrip from "../screens/ActiveTrip";
import TripDetails from "../screens/TripDetails";
import TripRoute from "../screens/TripRoute";
import DriverProfile from "../screens/DriverProfile";
import TripCompleted from "../screens/TripCompleted";
import ShareTrip from "../screens/ShareTrip";
import TripSharing from "../screens/TripSharing";
import TipDriver from "../screens/TipDriver";
import PastRides from "../screens/PastRides";
import UpcomingRides from "../screens/UpcomingRides";
import RateDriver from "../screens/RateDriver";
import SharedPassengers from "../screens/SharedPassengers";
import RideHistoryDetail from "../screens/RideHistoryDetail";
import RideSOS from "../screens/RideSOS";
import RideVariant from "../screens/RideVariant";
import MultiStops from "../screens/MultiStops";
import MaxMultiStops from "../screens/MaxMultiStops";
import AddStop from "../screens/AddStop";
import RideDetails from "../screens/RideDetails";
import MultiStopsSearchResults from "../screens/MultiStopsSearchResults";
import RideAlt from "../screens/RideAlt";
import RideVariantLayout from "../screens/RideVariantLayout";
import RideDetailsVariant from "../screens/RideDetailsVariant";
import ConfirmRideDetails from "../screens/ConfirmRideDetails";
import BookingThankYou from "../screens/BookingThankYou";
import BookingConfirmation from "../screens/BookingConfirmation";
import DeliveryReceived from "../screens/DeliveryReceived";
import DeliveringV2 from "../screens/DeliveringV2";
import DeliveryReceivedV2 from "../screens/DeliveryReceivedV2";
import DeliveryReceivedV3 from "../screens/DeliveryReceivedV3";
import DeliveryTrackingReceived from "../screens/DeliveryTrackingReceived";
import DeliveryTrackingIncoming from "../screens/DeliveryTrackingIncoming";
import DeliveryInvitations from "../screens/DeliveryInvitations";
import DeliveryInvitationsV2 from "../screens/DeliveryInvitationsV2";
import Preferences from "../screens/Preferences";
import DeliveryEnRoute from "../screens/DeliveryEnRoute";
import DeliveryCancel from "../screens/DeliveryCancel";
import DeliveryLiveTracking from "../screens/DeliveryLiveTracking";
import DeliveryDriver from "../screens/DeliveryDriver";
import DeliveryTimeline from "../screens/DeliveryTimeline";
import DeliveryDelivered from "../screens/DeliveryDelivered";
import DeliveryPickupConfirmed from "../screens/DeliveryPickupConfirmed";
import DeliveryRating from "../screens/DeliveryRating";
import DeliveryDetails from "../screens/DeliveryDetails";
import RentalList from "../screens/RentalList";
import RentalVehicleDetail from "../screens/RentalVehicleDetail";
import RentalDates from "../screens/RentalDates";
import RentalBranches from "../screens/RentalBranches";
import RentalSummary from "../screens/RentalSummary";
import RentalConfirmation from "../screens/RentalConfirmation";
import RentalHistory from "../screens/RentalHistory";
import TourDetail from "../screens/TourDetail";
import TourDates from "../screens/TourDates";
import TourSummary from "../screens/TourSummary";
import TourConfirmation from "../screens/TourConfirmation";
import TourHistory from "../screens/TourHistory";
import AmbulanceLocation from "../screens/AmbulanceLocation";
import AmbulanceDestination from "../screens/AmbulanceDestination";
import AmbulanceConfirmation from "../screens/AmbulanceConfirmation";
import AmbulanceTracking from "../screens/AmbulanceTracking";
import AmbulanceHistory from "../screens/AmbulanceHistory";
import SchoolHandoff from "../screens/SchoolHandoff";
import RentalHistoryDetail from "../screens/RentalHistoryDetail";
import AllHistory from "../screens/AllHistory";
import Wallet from "../screens/Wallet";
import MoreMenu from "../screens/MoreMenu";
import Settings from "../screens/Settings";
import LanguageSettings from "../screens/LanguageSettings";
import SecuritySettings from "../screens/SecuritySettings";
import PrivacySettings from "../screens/PrivacySettings";
import Help from "../screens/Help";
import About from "../screens/About";
import RidesDashboard from "../screens/RidesDashboard";
import DeliveriesDashboard from "../screens/DeliveriesDashboard";
import RentalDashboard from "../screens/RentalDashboard";
import ToursDashboard from "../screens/ToursDashboard";
import AmbulanceDashboard from "../screens/AmbulanceDashboard";
import SchoolDashboard from "../screens/SchoolDashboard";
import SchoolFees from "../screens/SchoolFees";
import RidePromotions from "../screens/RidePromotions";
import ToursNew from "../screens/ToursNew";
import Profile from "../screens/Profile";

export default function AppRouter(): React.JSX.Element {
	return (
		<Routes>
			{/* ── Auth (public) ─────────────────────────────────── */}
			<Route path="auth/sign-in" element={<SignIn />} />
			<Route path="auth/sign-up" element={<SignUp />} />
			<Route path="auth/forgot-password" element={<ForgotPassword />} />

			{/* ── Protected app routes ──────────────────────────── */}
			<Route element={<ProtectedRoute><ProtectedOutlet /></ProtectedRoute>}>
				{/* Home & Global */}
				<Route index element={<Navigate to="/home" replace />} />
				<Route path="home" element={<Home />} />
				<Route path="school-handoff" element={<SchoolDashboard />} />
				<Route path="school-handoff/fees" element={<SchoolFees />} />
				<Route path="school-handoff/details" element={<SchoolHandoff />} />
				<Route path="history/all" element={<AllHistory />} />
				{/* Rides */}
				<Route path="rides">
					<Route index element={<Navigate to="/rides/enter" replace />} />
					<Route path="enter" element={<RidesDashboard />} />
					<Route path="enter/details" element={<RideEnterDetails />} />
					<Route path="enter/preferences" element={<Preferences />} />
					<Route path="enter/simple" element={<RideSimple />} />
					<Route path="enter/map" element={<RideMap />} />
					<Route path="enter/alt" element={<RideAlt />} />
					<Route
						path="enter/variant-layout"
						element={<RideVariantLayout />}
					/>
					<Route path="enter/variant" element={<RideVariant />} />
					<Route path="enter/multi-stops" element={<MultiStops />} />
					<Route
						path="enter/multi-stops/max"
						element={<MaxMultiStops />}
					/>
					<Route path="enter/multi-stops/add" element={<AddStop />} />
					<Route
						path="enter/multi-stops/search-results"
						element={<MultiStopsSearchResults />}
					/>
					<Route path="commutes" element={<Commutes />} />
					<Route path="upcoming-inline" element={<UpcomingInline />} />
					<Route path="upcoming" element={<BookingConfirmation />} />
					<Route path="schedule" element={<ScheduleRide />} />
					<Route path="schedule/summary" element={<ScheduleSummary />} />
					<Route path="switch-rider" element={<SwitchRider />} />
					<Route
						path="switch-rider/contact"
						element={<SwitchRiderContact />}
					/>
					<Route
						path="switch-rider/manual"
						element={<SwitchRiderManual />}
					/>
					<Route
						path="switch-rider/summary"
						element={<SwitchRiderSummary />}
					/>
					<Route path="select-type" element={<SelectTripType />} />
					<Route path="round-trip" element={<RoundTrip />} />
					<Route
						path="round-trip/details"
						element={<RoundTripDetails />}
					/>
					<Route
						path="preferences/quick"
						element={<QuickPreferences />}
					/>
					<Route
						path="preferences/setup"
						element={<SetupPreferences />}
					/>
					<Route
						path="preferences/driver"
						element={<DriverPreferences />}
					/>
					<Route path="options" element={<RideOptions />} />
					<Route path="payment" element={<Payment />} />
					<Route path="searching" element={<SearchingDriver />} />
					<Route path="driver-on-way" element={<DriverOnWay />} />
					<Route path="driver-arrived" element={<DriverArrived />} />
					<Route path="trip" element={<ActiveTrip />} />
					<Route path="trip/details" element={<TripDetails />} />
					<Route path="trip/route" element={<TripRoute />} />
					<Route path="trip/driver-profile" element={<DriverProfile />} />
					<Route path="trip/completed" element={<TripCompleted />} />
					<Route path="trip/share" element={<ShareTrip />} />
					<Route path="trip/sharing" element={<TripSharing />} />
					<Route path="sos" element={<RideSOS />} />
					<Route path="rating" element={<RateDriver />} />
					<Route path="rating/tip" element={<TipDriver />} />
					<Route path="rating/driver" element={<RateDriver />} />
					<Route
						path="shared-passengers"
						element={<SharedPassengers />}
					/>
					<Route path="history/past" element={<PastRides />} />
					<Route path="history/upcoming" element={<UpcomingRides />} />
					<Route path="history/promotions" element={<RidePromotions />} />
					<Route path="promotions" element={<RidePromotions />} />
					<Route path="history/:rideId" element={<RideHistoryDetail />} />
					<Route path="details" element={<RideDetails />} />
					<Route
						path="details/variant"
						element={<RideDetailsVariant />}
					/>
					<Route
						path="details/confirm"
						element={<ConfirmRideDetails />}
					/>
					<Route
						path="booking/confirmation"
						element={<BookingConfirmation />}
					/>
					<Route path="booking/thank-you" element={<BookingThankYou />} />
				</Route>
				{/* Deliveries */}
				<Route path="deliveries">
					<Route index element={<DeliveriesDashboard />} />
					<Route path="delivering-v2" element={<DeliveringV2 />} />
					<Route path="received" element={<DeliveryReceived />} />
					<Route path="received-v2" element={<DeliveryReceivedV2 />} />
					<Route path="received-v3" element={<DeliveryReceivedV3 />} />
					<Route path="new" element={<Preferences />} />
					<Route
						path="tracking/incoming"
						element={<DeliveryTrackingIncoming />}
					/>
					<Route path="invitations" element={<DeliveryInvitations />} />
					<Route
						path="invitations/v2"
						element={<DeliveryInvitationsV2 />}
					/>
					<Route
						path="tracking/:orderId/received"
						element={<DeliveryTrackingReceived />}
					/>
					<Route
						path="tracking/:orderId/en-route"
						element={<DeliveryEnRoute />}
					/>
					<Route
						path="tracking/:orderId/cancel"
						element={<DeliveryCancel />}
					/>
					<Route
						path="tracking/:orderId/live"
						element={<DeliveryLiveTracking />}
					/>
					<Route
						path="tracking/:orderId/driver"
						element={<DeliveryDriver />}
					/>
					<Route
						path="tracking/:orderId/timeline"
						element={<DeliveryTimeline />}
					/>
					<Route
						path="tracking/:orderId/delivered"
						element={<DeliveryDelivered />}
					/>
					<Route
						path="tracking/:orderId/pickup-confirmed"
						element={<DeliveryPickupConfirmed />}
					/>
					<Route
						path="tracking/:orderId/rating"
						element={<DeliveryRating />}
					/>
					<Route
						path="tracking/:orderId/details"
						element={<DeliveryDetails />}
					/>
				</Route>
				{/* Rental */}
				<Route path="rental">
					<Route index element={<RentalDashboard />} />
					<Route path="list" element={<RentalList />} />
					<Route
						path="vehicle/:vehicleId"
						element={<RentalVehicleDetail />}
					/>
					<Route path="dates" element={<RentalDates />} />
					<Route path="branches" element={<RentalBranches />} />
					<Route path="summary" element={<RentalSummary />} />
					<Route path="confirmation" element={<RentalConfirmation />} />
					<Route path="history" element={<RentalHistory />} />
					<Route
						path="history/:rentalId"
						element={<RentalHistoryDetail />}
					/>
				</Route>
				{/* Tours */}
				<Route path="tours">
					<Route index element={<ToursDashboard />} />
					<Route path="new" element={<ToursNew />} />
					<Route path=":tourId" element={<TourDetail />} />
					<Route path=":tourId/dates" element={<TourDates />} />
					<Route path=":tourId/summary" element={<TourSummary />} />
					<Route
						path=":tourId/confirmation"
						element={<TourConfirmation />}
					/>
					<Route path="history" element={<TourHistory />} />
				</Route>
				{/* Ambulance */}
				<Route path="ambulance">
					<Route index element={<AmbulanceDashboard />} />
					<Route path="location" element={<AmbulanceLocation />} />
					<Route path="destination" element={<AmbulanceDestination />} />
					<Route
						path="confirmation"
						element={<AmbulanceConfirmation />}
					/>
					<Route
						path="tracking/:requestId"
						element={<AmbulanceTracking />}
					/>
					<Route path="history" element={<AmbulanceHistory />} />
				</Route>
				{/* Wallet, Profile, More, Settings */}
				<Route path="wallet" element={<Wallet />} />
				<Route path="profile" element={<Profile />} />
				<Route path="manager" element={<MoreMenu />} />
				<Route path="more" element={<MoreMenu />} />
				<Route path="settings">
					<Route index element={<Settings />} />
					<Route path="language" element={<LanguageSettings />} />
					<Route path="security" element={<SecuritySettings />} />
					<Route path="privacy" element={<PrivacySettings />} />
				</Route>
				<Route path="help" element={<Help />} />
				<Route path="about" element={<About />} />
				<Route path="school" element={<SchoolDashboard />} />
			</Route>

			{/* Fallback */}
			<Route path="*" element={<Navigate to="/home" replace />} />
		</Routes>
	);
}

/**
 * Simple pass-through that renders all child routes.
 * Used as a child of ProtectedRoute to enable nested <Route> elements.
 */
function ProtectedOutlet(): React.JSX.Element {
	return <Outlet />;
}
