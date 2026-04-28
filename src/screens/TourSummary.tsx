import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Divider
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import TourRoundedIcon from "@mui/icons-material/TourRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import { useAppData } from "../contexts/AppDataContext";


function TourBookingSummaryPaymentScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { tourId } = useParams();
  const { tours, actions, walletBalance, paymentMethods } = useAppData();
  const selectTour = actions.selectTour;
  const updateTourBooking = actions.updateTourBooking;
  const initializeTourPayment = actions.initializeTourPayment;
  const selectedTour =
    tours.tours.find((tour) => tour.id === tourId) ??
    tours.tours.find((tour) => tour.id === tours.selectedTourId) ??
    tours.tours[0];
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "card" | "mobile_money">("wallet");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { date = tours.booking.date || "Sat, 12 Oct 2025", timeSlot = "Afternoon (14:00)", adults = tours.booking.guests || 2, children = 1 } = (location.state as any) || {};
  const adultPrice = 250000;
  const childPrice = 150000;
  const bookingFee = 15000;

  const totalAdultsPrice = adults * adultPrice;
  const totalChildrenPrice = children * childPrice;
  const totalPrice = totalAdultsPrice + totalChildrenPrice + bookingFee;
  const walletInsufficient = paymentMethod === "wallet" && walletBalance < totalPrice;
  const disableConfirm = !acceptedTerms || walletInsufficient;

  useEffect(() => {
    if (tourId) {
      selectTour(tourId);
    }
  }, [tourId, selectTour]);

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 5,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)"
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              Review & confirm tour
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              {(selectedTour?.title ?? "EV Tour")} • {adults} {adults === 1 ? "adult" : "adults"}{children > 0 ? `, ${children} ${children === 1 ? "child" : "children"}` : ""}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Tour summary */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 5,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#DBEAFE" : "rgba(15,23,42,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <TourRoundedIcon sx={{ fontSize: 26, color: "#1D4ED8" }} />
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                {selectedTour?.title ?? "EV Tour"}
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                {selectedTour ? `${selectedTour.duration} • EV transport included` : "Tour details pending"}
              </Typography>
            </Box>
          </Stack>

          <Stack spacing={0.6}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <CalendarMonthRoundedIcon
                sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                {date} • {timeSlot}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <PlaceRoundedIcon
                sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Meeting point: Central Kampala (hotel pickup / agreed spot)
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <PeopleAltRoundedIcon
                sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                {adults} {adults === 1 ? "adult" : "adults"}{children > 0 ? `, ${children} ${children === 1 ? "child" : "children"}` : ""}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Price breakdown */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1, display: "block" }}
          >
            Price breakdown
          </Typography>
          <Stack spacing={0.4}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                {adults} × Adult (UGX {adultPrice.toLocaleString()})
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                UGX {totalAdultsPrice.toLocaleString()}
              </Typography>
            </Stack>
            {children > 0 && (
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" sx={{ fontSize: 11 }}>
                  {children} × Child (UGX {childPrice.toLocaleString()})
                </Typography>
                <Typography variant="caption" sx={{ fontSize: 11 }}>
                  UGX {totalChildrenPrice.toLocaleString()}
                </Typography>
              </Stack>
            )}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                Booking fee
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                UGX {bookingFee.toLocaleString()}
              </Typography>
            </Stack>
          </Stack>

          <Divider sx={{ my: 1.2, borderColor: (t) => t.palette.divider }} />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography
              variant="caption"
              sx={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}
            >
              Total
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}
            >
              UGX {totalPrice.toLocaleString()}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* Payment methods */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1, display: "block" }}
          >
            Pay with
          </Typography>
          <Stack spacing={1}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: (t) =>
                  paymentMethod === "wallet"
                    ? "rgba(3,205,140,0.16)"
                    : t.palette.mode === "light"
                    ? "#F3F4F6"
                    : "rgba(15,23,42,0.96)",
                border: (t) =>
                  paymentMethod === "wallet"
                    ? "1px solid #03CD8C"
                    : t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)"
              }}
              onClick={() => setPaymentMethod("wallet")}
            >
              <CardContent sx={{ px: 1.75, py: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AccountBalanceWalletRoundedIcon
                    sx={{ fontSize: 18, color: "primary.main" }}
                  />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}
                    >
                      EVzone Wallet
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                    >
                      Balance: UGX {walletBalance.toLocaleString()}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: (t) =>
                  paymentMethod === "card"
                    ? "rgba(59,130,246,0.15)"
                    : t.palette.mode === "light"
                    ? "#F3F4F6"
                    : "rgba(15,23,42,0.96)",
                border: (t) =>
                  paymentMethod === "card"
                    ? "1px solid #03CD8C"
                    : t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)"
              }}
              onClick={() => setPaymentMethod("card")}
            >
              <CardContent sx={{ px: 1.75, py: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CreditCardRoundedIcon
                    sx={{ fontSize: 18, color: (t) => t.palette.text.secondary }}
                  />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}
                    >
                      Card (Visa / Mastercard)
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                    >
                      Secure online payment
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: (t) =>
                  paymentMethod === "mobile"
                    ? "rgba(249,115,22,0.15)"
                    : t.palette.mode === "light"
                    ? "#F3F4F6"
                    : "rgba(15,23,42,0.96)",
                border: (t) =>
                  paymentMethod === "mobile"
                    ? "1px solid #F97316"
                    : t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)"
              }}
              onClick={() => setPaymentMethod("mobile_money")}
            >
              <CardContent sx={{ px: 1.75, py: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PhoneIphoneRoundedIcon
                    sx={{ fontSize: 18, color: (t) => t.palette.text.secondary }}
                  />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}
                    >
                      Mobile money
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                    >
                      MTN / Airtel (where available)
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </CardContent>
      </Card>

      <Button
        fullWidth
        variant="contained"
        disabled={disableConfirm}
        onClick={() => {
          setSubmitError(null);
          if (!selectedTour) {
            setSubmitError("No tour selected. Please go back and choose a tour.");
            return;
          }
          if (walletInsufficient) {
            setSubmitError("Wallet balance is insufficient. Choose another payment method.");
            return;
          }

          const paymentMethodId =
            paymentMethods.find((entry) => entry.type === paymentMethod)?.id ??
            paymentMethods.find((entry) => entry.type !== "cash")?.id;
          if (!paymentMethodId) {
            setSubmitError("No supported payment method is available.");
            return;
          }

          const session = initializeTourPayment({
            paymentMethodId,
            amount: totalPrice
          });
          if (!session) {
            setSubmitError("Could not initialize payment. Please try again.");
            return;
          }

          updateTourBooking({
            tourId: selectedTour.id,
            guests: adults + children,
            priceEstimate: `UGX ${totalPrice.toLocaleString()}`,
            paymentMethodId
          });

          if (paymentMethod === "wallet") {
            navigate("/tours/payment/wallet");
            return;
          }
          if (paymentMethod === "card") {
            navigate("/tours/payment/card");
            return;
          }
          if (paymentMethod === "mobile_money") {
            navigate("/tours/payment/mobile-money");
            return;
          }
        }}
        sx={{
          borderRadius: 5,
          py: 1.1,
          fontSize: 15,
          fontWeight: 600,
          textTransform: "none",
          bgcolor: "primary.main",
          color: "#020617",
          "&:hover": { bgcolor: "#06e29a" }
        }}
      >
        Confirm booking & pay
      </Button>

      {walletInsufficient && (
        <Alert severity="warning" sx={{ mt: 1.1 }}>
          Wallet balance is below the total amount. Choose card/mobile money or top up your wallet.
        </Alert>
      )}
      {submitError && (
        <Alert severity="error" sx={{ mt: 1.1 }}>
          {submitError}
        </Alert>
      )}

      <Card
        elevation={0}
        sx={{
          mt: 1.2,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.45 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
              />
            }
            label={
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                I agree to the tour booking terms, refund policy and EV travel guidelines.
              </Typography>
            }
          />
        </CardContent>
      </Card>

      <Typography
        variant="caption"
        sx={{ mt: 1.2, fontSize: 11, color: (t) => t.palette.text.secondary }}
      >
        By confirming you agree to the tour operator’s terms, refund policy and
        EV transport guidelines.
      </Typography>
    </Box>
  );
}

export default function RiderScreen80TourBookingSummaryPaymentCanvas_v2() {
      return (
    
      
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          bgcolor: (t) => t.palette.background.default
        }}
      >

          <TourBookingSummaryPaymentScreen />
        
      </Box>
    
  );
}
