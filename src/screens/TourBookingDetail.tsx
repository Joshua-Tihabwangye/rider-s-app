import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box, Typography, Card, CardContent, Stack, Chip, Button, IconButton,
  Skeleton, Divider, Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, Collapse
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import EventRepeatRoundedIcon from "@mui/icons-material/EventRepeatRounded";
import ConfirmationNumberRoundedIcon from "@mui/icons-material/ConfirmationNumberRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import CelebrationRoundedIcon from "@mui/icons-material/CelebrationRounded";
import MobileShell from "../components/MobileShell";
import DarkModeToggle from "../components/DarkModeToggle";
import { Booking, BookingStatus, fetchBookingById, formatUGX, getGradientForTour, MOCK_BOOKINGS } from "../data/tours";

const G = "#03CD8C";
const G2 = "#22C55E";

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; bg: string }> = {
  confirmed: { label: "Confirmed", color: G, bg: "rgba(3,205,140,0.12)" },
  upcoming: { label: "Upcoming", color: "#3B82F6", bg: "rgba(59,130,246,0.12)" },
  completed: { label: "Completed", color: "#6B7280", bg: "rgba(107,114,128,0.12)" },
  cancelled: { label: "Cancelled", color: "#EF4444", bg: "rgba(239,68,68,0.12)" }
};

/* ═══════════════════════════════════════════════════════════
   Booking Detail Screen
   ═══════════════════════════════════════════════════════════ */
function BookingDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const justBooked = (location.state as { justBooked?: boolean })?.justBooked;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(justBooked ? "🎉 Tour booked successfully!" : null);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    if (!id) return;
    let c = false;
    // Check if this is a just-created booking
    fetchBookingById(id).then(b => {
      if (!c) {
        if (b) {
          setBooking(b);
        } else if (justBooked) {
          // Create a temporary booking for just-booked scenario
          const newBooking: Booking = {
            id: id || "",
            tourSlug: id || "kampala-city-ev-highlights",
            tourTitle: "Your Booked Tour",
            tourImage: "kampala-1",
            destination: "Uganda",
            date: new Date().toISOString().split("T")[0] || "",
            timeSlot: "08:00 – 18:00",
            tourDays: 1,
            adults: 2,
            children: 0,
            addons: [],
            addonsCost: 0,
            baseCost: 360000,
            taxes: 18000,
            totalCost: 378000,
            currency: "UGX",
            status: "confirmed",
            contactName: "Robert Zimba",
            contactEmail: "robert@example.com",
            contactPhone: "+256 700 123 456",
            country: "Uganda",
            specialRequests: "",
            promoCode: "",
            promoDiscount: 0,
            paymentMethod: "Mobile Money",
            bookingRef: `EVZ-TOUR-${id}`,
            createdAt: new Date().toISOString(),
            cancellationPolicy: "Free cancellation up to 24 hours before the tour.",
            cancellationDeadline: ""
          };
          setBooking(newBooking);
        }
        setLoading(false);
      }
    });
    return () => { c = true; };
  }, [id, justBooked]);

  const handlePrintInvoice = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow || !booking) return;
    printWindow.document.write(`
      <!DOCTYPE html><html><head><title>Invoice - ${booking.bookingRef}</title>
      <style>
        body { font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; color: #0F172A; }
        h1 { color: #03CD8C; font-size: 24px; } h2 { font-size: 16px; margin-top: 24px; }
        .ref { color: #6B7280; font-size: 14px; } .row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 14px; }
        .total { font-weight: 800; font-size: 18px; border-top: 2px solid #E5E7EB; padding-top: 8px; margin-top: 8px; }
        .badge { background: #03CD8C; color: white; padding: 2px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; display: inline-block; }
        hr { border: none; border-top: 1px solid #E5E7EB; margin: 16px 0; }
      </style></head><body>
      <h1>EVzone Tours</h1>
      <p class="ref">Invoice for booking: <strong>${booking.bookingRef}</strong></p>
      <p class="ref">Date issued: ${new Date().toLocaleDateString("en", { day: "numeric", month: "long", year: "numeric" })}</p>
      <p><span class="badge">${booking.status.toUpperCase()}</span></p>
      <hr/>
      <h2>Tour Details</h2>
      <div class="row"><span>Tour</span><span><strong>${booking.tourTitle}</strong></span></div>
      <div class="row"><span>Destination</span><span>${booking.destination}</span></div>
      <div class="row"><span>Date</span><span>${booking.date}</span></div>
      <div class="row"><span>Time</span><span>${booking.timeSlot}</span></div>
      <div class="row"><span>Guests</span><span>${booking.adults} adult(s)${booking.children > 0 ? `, ${booking.children} child(ren)` : ""}</span></div>
      ${booking.addons.length > 0 ? `<div class="row"><span>Add-ons</span><span>${booking.addons.join(", ")}</span></div>` : ""}
      <hr/>
      <h2>Price Breakdown</h2>
      <div class="row"><span>Base cost</span><span>${formatUGX(booking.baseCost)}</span></div>
      ${booking.addonsCost > 0 ? `<div class="row"><span>Add-ons</span><span>${formatUGX(booking.addonsCost)}</span></div>` : ""}
      ${booking.promoDiscount > 0 ? `<div class="row" style="color:#03CD8C"><span>Promo discount</span><span>−${formatUGX(booking.promoDiscount)}</span></div>` : ""}
      <div class="row"><span>Taxes & fees</span><span>${formatUGX(booking.taxes)}</span></div>
      <div class="row total"><span>Total</span><span style="color:#03CD8C">${formatUGX(booking.totalCost)}</span></div>
      <hr/>
      <h2>Contact</h2>
      <div class="row"><span>Name</span><span>${booking.contactName}</span></div>
      <div class="row"><span>Email</span><span>${booking.contactEmail}</span></div>
      <div class="row"><span>Phone</span><span>${booking.contactPhone}</span></div>
      <div class="row"><span>Payment</span><span>${booking.paymentMethod}</span></div>
      <hr/>
      <p style="font-size:12px;color:#6B7280;text-align:center;margin-top:32px;">
        ${booking.cancellationPolicy}<br/>EVzone Tours • evzone.com • support@evzone.com
      </p>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleCancel = () => {
    setCancelDialogOpen(false);
    setToast("Booking cancelled. Refund will be processed within 3–5 business days.");
    if (booking) setBooking({ ...booking, status: "cancelled" });
  };

  if (loading) return (
    <Box sx={{ px: 2.5, pt: 3 }}>
      <Skeleton variant="text" width="60%" height={28} sx={{ mb: 1 }} />
      <Skeleton variant="rounded" height={120} sx={{ borderRadius: 2.5, mb: 2 }} />
      <Skeleton variant="rounded" height={200} sx={{ borderRadius: 2.5, mb: 2 }} />
      <Skeleton variant="rounded" height={100} sx={{ borderRadius: 2.5 }} />
    </Box>
  );

  if (!booking) return (
    <Box sx={{ px: 2.5, pt: 4, textAlign: "center" }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Booking not found</Typography>
      <Typography variant="body2" sx={{ color: t => t.palette.text.secondary, mb: 2 }}>
        This booking doesn&apos;t exist or has been removed.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/bookings")}
        sx={{ borderRadius: 999, bgcolor: G, color: "#020617", textTransform: "none", "&:hover": { bgcolor: G2 } }}>
        My bookings
      </Button>
    </Box>
  );

  const statusConf = STATUS_CONFIG[booking.status];
  const canCancel = booking.status === "confirmed" || booking.status === "upcoming";
  const canReschedule = booking.status === "confirmed" || booking.status === "upcoming";

  return (
    <Box>
      {/* Green Header */}
      <Box sx={{ bgcolor: "#03CD8C", px: 2, pt: 2, pb: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton onClick={() => navigate("/bookings")} size="small"
            sx={{ borderRadius: 999, bgcolor: "rgba(255,255,255,0.2)", color: "#FFFFFF", "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } }}>
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: 16, color: "#FFFFFF" }}>Booking Details</Typography>
          </Box>
          <Chip label={statusConf.label} size="small"
            sx={{ borderRadius: 999, fontSize: 10, height: 24, fontWeight: 600, bgcolor: "rgba(255,255,255,0.2)", color: "#FFFFFF" }} />
        </Stack>
      </Box>

    <Box sx={{ px: 2, pt: 2, pb: 3 }}>

      {/* Confirmation banner */}
      {justBooked && (
        <Card elevation={0} sx={{
          mb: 2, borderRadius: 2.5, overflow: "hidden",
          background: `linear-gradient(135deg, rgba(3,205,140,0.12) 0%, rgba(3,205,140,0.04) 100%)`,
          border: `1px solid rgba(3,205,140,0.3)`
        }}>
          <CardContent sx={{ px: 2, py: 2, textAlign: "center" }}>
            <CelebrationRoundedIcon sx={{ fontSize: 40, color: G, mb: 0.5 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: 18, mb: 0.25 }}>Booking confirmed!</Typography>
            <Typography variant="body2" sx={{ fontSize: 12, color: t => t.palette.text.secondary, mb: 1 }}>
              Your tour has been booked successfully. Check your email for details.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Booking ref & tour card */}
      <Card elevation={0} sx={{
        borderRadius: 2.5, mb: 2, overflow: "hidden",
        bgcolor: t => t.palette.mode === "light" ? "#fff" : "rgba(15,23,42,0.98)",
        border: t => `1px solid ${t.palette.mode === "light" ? "rgba(209,213,219,0.9)" : "rgba(51,65,85,0.7)"}`
      }}>
        <CardContent sx={{ px: 1.8, py: 1.5 }}>
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 1.2 }}>
            <ConfirmationNumberRoundedIcon sx={{ fontSize: 16, color: G }} />
            <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700, color: G }}>
              {booking.bookingRef}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.2} alignItems="center">
            <Box sx={{
              width: 64, height: 64, borderRadius: 2, flexShrink: 0,
              background: getGradientForTour(booking.tourSlug),
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Typography sx={{ color: "rgba(255,255,255,0.3)", fontSize: 24, fontWeight: 800 }}>
                {booking.destination.charAt(0)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 700, fontSize: 15 }}>{booking.tourTitle}</Typography>
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.25 }}>
                <PlaceRoundedIcon sx={{ fontSize: 13, color: t => t.palette.text.secondary }} />
                <Typography variant="caption" sx={{ fontSize: 11, color: t => t.palette.text.secondary }}>{booking.destination}</Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <CalendarMonthRoundedIcon sx={{ fontSize: 13, color: t => t.palette.text.secondary }} />
                <Typography variant="caption" sx={{ fontSize: 11, color: t => t.palette.text.secondary }}>
                  {new Date(booking.date).toLocaleDateString("en", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="caption" sx={{ fontSize: 11, color: t => t.palette.text.secondary }}>
                  🕐 {booking.timeSlot}
                </Typography>
                {booking.tourDays > 0 && (
                  <Typography variant="caption" sx={{ fontSize: 11, color: t => t.palette.text.secondary }}>
                    📅 {booking.tourDays} day{booking.tourDays !== 1 ? "s" : ""}
                  </Typography>
                )}
                <Stack direction="row" spacing={0.3} alignItems="center">
                  <GroupRoundedIcon sx={{ fontSize: 13, color: t => t.palette.text.secondary }} />
                  <Typography variant="caption" sx={{ fontSize: 11, color: t => t.palette.text.secondary }}>
                    {booking.adults} adult{booking.adults !== 1 ? "s" : ""}{booking.children > 0 ? `, ${booking.children} child${booking.children !== 1 ? "ren" : ""}` : ""}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Contact details */}
      <Card elevation={0} sx={{
        borderRadius: 2.5, mb: 2,
        bgcolor: t => t.palette.mode === "light" ? "#fff" : "rgba(15,23,42,0.98)",
        border: t => `1px solid ${t.palette.mode === "light" ? "rgba(209,213,219,0.9)" : "rgba(51,65,85,0.7)"}`
      }}>
        <CardContent sx={{ px: 1.8, py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 13, mb: 1 }}>Contact details</Typography>
          {[
            { icon: <PersonRoundedIcon sx={{ fontSize: 15 }} />, label: booking.contactName },
            { icon: <EmailRoundedIcon sx={{ fontSize: 15 }} />, label: booking.contactEmail },
            { icon: <PhoneRoundedIcon sx={{ fontSize: 15 }} />, label: booking.contactPhone },
            { icon: <PublicRoundedIcon sx={{ fontSize: 15 }} />, label: booking.country },
            { icon: <CreditCardRoundedIcon sx={{ fontSize: 15 }} />, label: `Paid via ${booking.paymentMethod}` }
          ].map((item, i) => (
            <Stack key={i} direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.4 }}>
              <Box sx={{ color: t => t.palette.text.secondary }}>{item.icon}</Box>
              <Typography variant="caption" sx={{ fontSize: 11.5 }}>{item.label}</Typography>
            </Stack>
          ))}
          {booking.specialRequests && (
            <Box sx={{ mt: 1, p: 1, borderRadius: 1.5, bgcolor: t => t.palette.mode === "light" ? "#F9FAFB" : "rgba(51,65,85,0.2)" }}>
              <Typography variant="caption" sx={{ fontSize: 10, fontWeight: 600, color: t => t.palette.text.secondary, display: "block", mb: 0.25 }}>
                Special requests
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>{booking.specialRequests}</Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Price breakdown / Invoice toggle */}
      <Card elevation={0} sx={{
        borderRadius: 2.5, mb: 2,
        bgcolor: t => t.palette.mode === "light" ? "#fff" : "rgba(15,23,42,0.98)",
        border: t => `1px solid ${t.palette.mode === "light" ? "rgba(209,213,219,0.9)" : "rgba(51,65,85,0.7)"}`
      }}>
        <CardContent sx={{ px: 1.8, py: 1.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <ReceiptLongRoundedIcon sx={{ fontSize: 16, color: G }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 13 }}>Price breakdown</Typography>
            </Stack>
            <Typography variant="caption" onClick={() => setShowInvoice(!showInvoice)}
              sx={{ fontSize: 10, color: G, cursor: "pointer", fontWeight: 600, "&:hover": { textDecoration: "underline" } }}>
              {showInvoice ? "Hide" : "Show"} details
            </Typography>
          </Stack>

          <Collapse in={showInvoice}>
            <Stack spacing={0.4} sx={{ mb: 1 }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" sx={{ fontSize: 11, color: t => t.palette.text.secondary }}>Base cost</Typography>
                <Typography variant="caption" sx={{ fontSize: 11 }}>{formatUGX(booking.baseCost)}</Typography>
              </Stack>
              {booking.addonsCost > 0 && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="caption" sx={{ fontSize: 11, color: t => t.palette.text.secondary }}>
                    Add-ons ({booking.addons.join(", ")})
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: 11 }}>{formatUGX(booking.addonsCost)}</Typography>
                </Stack>
              )}
              {booking.promoDiscount > 0 && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="caption" sx={{ fontSize: 11, color: G }}>Promo ({booking.promoCode})</Typography>
                  <Typography variant="caption" sx={{ fontSize: 11, color: G }}>−{formatUGX(booking.promoDiscount)}</Typography>
                </Stack>
              )}
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" sx={{ fontSize: 11, color: t => t.palette.text.secondary }}>Taxes & fees</Typography>
                <Typography variant="caption" sx={{ fontSize: 11 }}>{formatUGX(booking.taxes)}</Typography>
              </Stack>
              <Divider sx={{ my: 0.5 }} />
            </Stack>
          </Collapse>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ fontWeight: 800, fontSize: 15 }}>Total paid</Typography>
            <Typography variant="body2" sx={{ fontWeight: 800, fontSize: 15, color: G }}>{formatUGX(booking.totalCost)}</Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* Cancellation policy */}
      <Card elevation={0} sx={{
        borderRadius: 2.5, mb: 2,
        bgcolor: "rgba(3,205,140,0.04)",
        border: "1px solid rgba(3,205,140,0.15)"
      }}>
        <CardContent sx={{ px: 1.8, py: 1.2 }}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <SecurityRoundedIcon sx={{ fontSize: 14, color: G }} />
            <Typography variant="caption" sx={{ fontSize: 11, color: G, fontWeight: 600, lineHeight: 1.5 }}>
              {booking.cancellationPolicy}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <Stack spacing={1} sx={{ mb: 2 }}>
        <Button fullWidth variant="outlined" startIcon={<PrintRoundedIcon />} onClick={handlePrintInvoice}
          sx={{ borderRadius: 999, py: 0.9, textTransform: "none", fontWeight: 600, borderColor: G, color: G, "&:hover": { borderColor: G2, bgcolor: "rgba(3,205,140,0.06)" } }}>
          Download invoice
        </Button>

        <Button fullWidth variant="outlined" startIcon={<SupportAgentRoundedIcon />} onClick={() => setSupportDialogOpen(true)}
          sx={{ borderRadius: 999, py: 0.9, textTransform: "none", fontWeight: 600 }}>
          Contact support
        </Button>

        {canReschedule && (
          <Button fullWidth variant="outlined" startIcon={<EventRepeatRoundedIcon />}
            onClick={() => navigate(`/tours/${booking.tourSlug}/book`)}
            sx={{ borderRadius: 999, py: 0.9, textTransform: "none", fontWeight: 600, borderColor: "#3B82F6", color: "#3B82F6" }}>
            Reschedule
          </Button>
        )}

        {canCancel && (
          <Button fullWidth variant="outlined" startIcon={<EventBusyRoundedIcon />} onClick={() => setCancelDialogOpen(true)}
            sx={{ borderRadius: 999, py: 0.9, textTransform: "none", fontWeight: 600, borderColor: "#EF4444", color: "#EF4444" }}>
            Cancel booking
          </Button>
        )}
      </Stack>

      {/* Back to tours */}
      <Button fullWidth variant="contained" onClick={() => navigate("/tours")}
        sx={{ borderRadius: 999, py: 1, textTransform: "none", fontWeight: 600, bgcolor: G, color: "#020617", "&:hover": { bgcolor: G2 } }}>
        Browse more tours
      </Button>

      {/* ── Cancel dialog ──────────────────────────────── */}
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 16 }}>Cancel booking?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ fontSize: 13, color: t => t.palette.text.secondary, lineHeight: 1.6 }}>
            {booking.cancellationPolicy}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 13, mt: 1.5, fontWeight: 600 }}>
            Are you sure you want to cancel this booking?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCancelDialogOpen(false)} sx={{ textTransform: "none" }}>Keep booking</Button>
          <Button variant="contained" onClick={handleCancel}
            sx={{ bgcolor: "#EF4444", textTransform: "none", borderRadius: 999, "&:hover": { bgcolor: "#DC2626" } }}>
            Yes, cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Support dialog ─────────────────────────────── */}
      <Dialog open={supportDialogOpen} onClose={() => setSupportDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 16 }}>Contact Support</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ fontSize: 13, color: t => t.palette.text.secondary, mb: 1.5 }}>
            Our team is here to help with your booking.
          </Typography>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <EmailRoundedIcon sx={{ fontSize: 18, color: G }} />
              <Typography variant="body2" sx={{ fontSize: 13 }}>support@evzone.com</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <PhoneRoundedIcon sx={{ fontSize: 18, color: G }} />
              <Typography variant="body2" sx={{ fontSize: 13 }}>+256 800 123 456</Typography>
            </Stack>
          </Stack>
          <Typography variant="caption" sx={{ fontSize: 10, color: t => t.palette.text.secondary, mt: 1.5, display: "block" }}>
            Reference: {booking.bookingRef}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setSupportDialogOpen(false)} variant="contained"
            sx={{ bgcolor: G, color: "#020617", textTransform: "none", borderRadius: 999, "&:hover": { bgcolor: G2 } }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Toast ──────────────────────────────────────── */}
      <Snackbar open={!!toast} autoHideDuration={4000} onClose={() => setToast(null)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success" variant="filled" sx={{ bgcolor: G, color: "#020617", fontWeight: 600 }}>{toast}</Alert>
      </Snackbar>
      </Box>
    </Box>
  );
}

/* ═══════════════════════════════════════════════════════════
   Export
   ═══════════════════════════════════════════════════════════ */
export default function TourBookingDetail() {
  return (
    <>
      <DarkModeToggle />
      <MobileShell>
        <BookingDetailScreen />
      </MobileShell>
    </>
  );
}
