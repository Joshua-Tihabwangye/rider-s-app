import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Snackbar,
  Stack,
  Typography
} from "@mui/material";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import ContactPhoneRoundedIcon from "@mui/icons-material/ContactPhoneRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ScreenScaffold from "../components/ScreenScaffold";
import PageHeader from "../components/PageHeader";
import AppCard from "../components/primitives/AppCard";
import ListSection from "../components/primitives/ListSection";
import SectionHeader from "../components/primitives/SectionHeader";
import { useAuth } from "../contexts/AuthContext";
import { useAppData } from "../contexts/AppDataContext";
import { uiTokens } from "../design/tokens";
import type { SosStatus } from "../store/types";

const SOS_STATUS_LABELS: Record<SosStatus, string> = {
  initiated: "SOS initiated",
  alert_sent: "Alert sent",
  contacts_notified: "Emergency contacts notified",
  support_notified: "Safety team notified",
  resolved: "Resolved"
};

export default function RideSOS(): React.JSX.Element {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { ride, sos, emergencyContacts, actions } = useAppData();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState<{ open: boolean; message: string }>({ open: false, message: "" });

  const activeTrip = ride.activeTrip;
  const defaultContact = emergencyContacts.find((contact) => contact.isDefault) ?? emergencyContacts[0];
  const activeEvent = sos.events.find((event) => event.id === sos.activeEventId);

  const context = React.useMemo(() => {
    return {
      passengerName: user?.fullName ?? "EVzone Rider",
      passengerPhone: user?.phone ?? "",
      driverName: activeTrip?.driver?.name,
      driverPhone: activeTrip?.driver?.phone,
      driverRating: activeTrip?.driver?.rating,
      vehicleModel: activeTrip?.vehicle?.model,
      vehicleColor: activeTrip?.vehicle?.color,
      licensePlate: activeTrip?.vehicle?.plate,
      pickup: activeTrip?.pickup?.address,
      destination: activeTrip?.dropoff?.address,
      routeSummary: activeTrip?.routeSummary,
      tripStatus: activeTrip?.status,
      lastLocation: activeTrip?.lastKnownLocation?.address
    };
  }, [activeTrip, user]);

  const handleSendSos = (): void => {
    const eventId = actions.startSos(context);
    actions.updateSosStatus(eventId, "alert_sent", "Emergency alert sent to safety team.");
    setTimeout(() => {
      actions.updateSosStatus(eventId, "contacts_notified", "Emergency contacts notified via SMS.");
    }, 800);
    setTimeout(() => {
      actions.updateSosStatus(eventId, "support_notified", "Support agent assigned to your case.");
    }, 1400);
    setSnackbar({ open: true, message: "SOS alert sent. Help is on the way." });
    setConfirmOpen(false);
  };

  const handleCallEmergency = (): void => {
    window.location.href = `tel:${sos.emergencyServicesNumber}`;
  };

  const handleCallContact = (): void => {
    if (!defaultContact) return;
    window.location.href = `tel:${defaultContact.phone}`;
  };

  const handleShareTrip = async (): Promise<void> => {
    const summary = `EVzone SOS\nTrip: ${activeTrip?.id ?? ""}\nDriver: ${activeTrip?.driver?.name ?? ""}\nVehicle: ${activeTrip?.vehicle?.model ?? ""} (${activeTrip?.vehicle?.plate ?? ""})\nPickup: ${activeTrip?.pickup?.address ?? ""}\nDestination: ${activeTrip?.dropoff?.address ?? ""}\nStatus: ${activeTrip?.status ?? ""}`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(summary);
      setSnackbar({ open: true, message: "Trip details copied for sharing." });
      return;
    }
    setSnackbar({ open: true, message: "Share unavailable on this device." });
  };

  const handleResolve = (): void => {
    if (!activeEvent) return;
    actions.resolveSos(activeEvent.id, "Resolved by rider.");
    setSnackbar({ open: true, message: "SOS marked as resolved." });
  };

  return (
    <ScreenScaffold
      header={<PageHeader title="Safety & SOS" subtitle="Emergency assistance" onBack={() => navigate(-1)} />}
    >
      <AppCard variant="warning">
        <Stack spacing={uiTokens.spacing.smPlus}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            You are connected to EVzone Safety.
          </Typography>
          <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
            Use SOS only for urgent situations. You can call emergency services, notify trusted contacts, or share live
            trip details.
          </Typography>
          <Button
            variant="contained"
            onClick={() => setConfirmOpen(true)}
            startIcon={<ShieldRoundedIcon />}
            sx={{ bgcolor: "var(--evz-warning)", color: "#0f172a", textTransform: "none" }}
          >
            Send SOS alert
          </Button>
        </Stack>
      </AppCard>

      <Stack spacing={uiTokens.spacing.smPlus}>
        <SectionHeader eyebrow="Quick actions" title="Reach help" compact />
        <ListSection>
          <AppCard onClick={handleCallEmergency} contentSx={{ px: uiTokens.spacing.mdPlus, py: uiTokens.spacing.mdPlus }}>
            <Stack direction="row" spacing={uiTokens.spacing.md} alignItems="center">
              <PhoneRoundedIcon sx={{ color: uiTokens.colors.danger }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ ...uiTokens.text.itemTitle }}>
                  Call emergency services
                </Typography>
                <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                  {sos.emergencyServicesNumber} • Local responders
                </Typography>
              </Box>
              <Chip label="Call" size="small" color="error" />
            </Stack>
          </AppCard>

          <AppCard onClick={handleCallContact} contentSx={{ px: uiTokens.spacing.mdPlus, py: uiTokens.spacing.mdPlus }}>
            <Stack direction="row" spacing={uiTokens.spacing.md} alignItems="center">
              <ContactPhoneRoundedIcon sx={{ color: uiTokens.colors.brand }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ ...uiTokens.text.itemTitle }}>
                  Call emergency contact
                </Typography>
                <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                  {defaultContact ? `${defaultContact.name} • ${defaultContact.phone}` : "Add a contact in settings"}
                </Typography>
              </Box>
              <Chip label="Call" size="small" />
            </Stack>
          </AppCard>

          <AppCard onClick={handleShareTrip} contentSx={{ px: uiTokens.spacing.mdPlus, py: uiTokens.spacing.mdPlus }}>
            <Stack direction="row" spacing={uiTokens.spacing.md} alignItems="center">
              <ShareRoundedIcon sx={{ color: uiTokens.colors.brand }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ ...uiTokens.text.itemTitle }}>
                  Share live trip status
                </Typography>
                <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                  Copy trip details to share with trusted contacts
                </Typography>
              </Box>
              <Chip label="Share" size="small" />
            </Stack>
          </AppCard>
        </ListSection>
      </Stack>

      <Stack spacing={uiTokens.spacing.smPlus}>
        <SectionHeader eyebrow="Trip" title="Current ride context" compact />
        <AppCard contentSx={{ px: uiTokens.spacing.mdPlus, py: uiTokens.spacing.mdPlus }}>
          <Stack spacing={0.75}>
            <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
              Trip ID: {activeTrip?.id ?? "Not assigned"}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {activeTrip?.routeSummary ?? "No active trip"}
            </Typography>
            <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
              {activeTrip?.pickup?.address ?? "Pickup"} → {activeTrip?.dropoff?.address ?? "Destination"}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
              Driver: {activeTrip?.driver?.name ?? "—"} • {activeTrip?.vehicle?.model ?? ""} ({activeTrip?.vehicle?.plate ?? ""})
            </Typography>
            <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
              Last location: {activeTrip?.lastKnownLocation?.address ?? "—"}
            </Typography>
          </Stack>
        </AppCard>
      </Stack>

      <Stack spacing={uiTokens.spacing.smPlus}>
        <SectionHeader eyebrow="Status" title="Safety timeline" compact />
        <ListSection>
          {activeEvent ? (
            <AppCard contentSx={{ px: uiTokens.spacing.mdPlus, py: uiTokens.spacing.mdPlus }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircleRoundedIcon sx={{ color: uiTokens.colors.successText }} />
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {SOS_STATUS_LABELS[activeEvent.status]}
                  </Typography>
                </Stack>
                {activeEvent.logs.map((log) => (
                  <Box key={`${log.status}-${log.timestamp}`}>
                    <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                      {new Date(log.timestamp).toLocaleTimeString()} — {SOS_STATUS_LABELS[log.status]}
                    </Typography>
                    {log.note && (
                      <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary, display: "block" }}>
                        {log.note}
                      </Typography>
                    )}
                  </Box>
                ))}
                {activeEvent.status !== "resolved" && (
                  <Button variant="outlined" onClick={handleResolve} sx={{ textTransform: "none" }}>
                    Mark as resolved
                  </Button>
                )}
              </Stack>
            </AppCard>
          ) : (
            <AppCard variant="muted" contentSx={{ px: uiTokens.spacing.mdPlus, py: uiTokens.spacing.mdPlus }}>
              <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                No active SOS events. You can send an SOS alert if you feel unsafe.
              </Typography>
            </AppCard>
          )}
        </ListSection>
      </Stack>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Send SOS alert?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: (t) => t.palette.text.secondary }}>
            This will notify EVzone Safety and your emergency contacts with your live trip details.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} variant="text">
            Cancel
          </Button>
          <Button onClick={handleSendSos} variant="contained" color="error">
            Send SOS
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3200}
        onClose={() => setSnackbar({ open: false, message: "" })}
      >
        <Alert severity="success" variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ScreenScaffold>
  );
}
