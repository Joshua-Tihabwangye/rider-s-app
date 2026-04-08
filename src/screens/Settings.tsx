import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography
} from "@mui/material";

import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import PaymentRoundedIcon from "@mui/icons-material/PaymentRounded";
import PrivacyTipRoundedIcon from "@mui/icons-material/PrivacyTipRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import ContactPhoneRoundedIcon from "@mui/icons-material/ContactPhoneRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import PageHeader from "../components/PageHeader";
import ScreenScaffold from "../components/ScreenScaffold";
import AppCard from "../components/primitives/AppCard";
import ListSection from "../components/primitives/ListSection";
import SectionHeader from "../components/primitives/SectionHeader";
import RowActionItem from "../components/primitives/RowActionItem";
import { useThemeMode } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { useAppData } from "../contexts/AppDataContext";
import { uiTokens } from "../design/tokens";
import type { EmergencyContact } from "../store/types";

interface ToggleRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleRow({ icon, title, description, checked, onChange }: ToggleRowProps): React.JSX.Element {
  return (
    <AppCard contentSx={{ px: uiTokens.spacing.mdPlus, py: uiTokens.spacing.mdPlus, gap: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.md }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "var(--evz-radius-md)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: uiTokens.colors.brand,
            bgcolor: uiTokens.surfaces.brandTintSoft
          }}
        >
          {icon}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ ...uiTokens.text.itemTitle, lineHeight: 1.25 }}>
            {title}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              ...uiTokens.text.itemBody,
              display: "block",
              mt: uiTokens.spacing.xxs,
              color: (t) => t.palette.text.secondary
            }}
          >
            {description}
          </Typography>
        </Box>

        <Switch checked={checked} onChange={(e) => onChange(e.target.checked)} color="primary" />
      </Box>
    </AppCard>
  );
}

interface ContactFormState {
  name: string;
  phone: string;
  relationship: string;
  isDefault: boolean;
  notifyOnSOS: boolean;
}

const emptyContactForm: ContactFormState = {
  name: "",
  phone: "",
  relationship: "",
  isDefault: false,
  notifyOnSOS: true
};

function getSavedPlaceIcon(label: string): React.ReactNode {
  if (label.toLowerCase().includes("home")) return <HomeRoundedIcon />;
  if (label.toLowerCase().includes("work") || label.toLowerCase().includes("office")) return <WorkRoundedIcon />;
  return <DirectionsCarRoundedIcon />;
}

export default function Settings(): React.JSX.Element {
  const navigate = useNavigate();
  const { mode, toggleMode } = useThemeMode();
  const { user, signOut } = useAuth();
  const { settings, emergencyContacts, ride, actions } = useAppData();

  const [contactDialogOpen, setContactDialogOpen] = React.useState(false);
  const [editingContact, setEditingContact] = React.useState<EmergencyContact | null>(null);
  const [contactForm, setContactForm] = React.useState<ContactFormState>(emptyContactForm);

  const openAddContact = (): void => {
    setEditingContact(null);
    setContactForm(emptyContactForm);
    setContactDialogOpen(true);
  };

  const openEditContact = (contact: EmergencyContact): void => {
    setEditingContact(contact);
    setContactForm({
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
      isDefault: contact.isDefault,
      notifyOnSOS: contact.notifyOnSOS
    });
    setContactDialogOpen(true);
  };

  const closeContactDialog = (): void => {
    setContactDialogOpen(false);
  };

  const handleSaveContact = (): void => {
    if (!contactForm.name.trim() || !contactForm.phone.trim()) return;

    if (editingContact) {
      actions.updateEmergencyContact({
        ...editingContact,
        name: contactForm.name.trim(),
        phone: contactForm.phone.trim(),
        relationship: contactForm.relationship.trim() || "Contact",
        isDefault: contactForm.isDefault,
        notifyOnSOS: contactForm.notifyOnSOS
      });
    } else {
      actions.addEmergencyContact({
        name: contactForm.name.trim(),
        phone: contactForm.phone.trim(),
        relationship: contactForm.relationship.trim() || "Contact",
        isDefault: contactForm.isDefault,
        notifyOnSOS: contactForm.notifyOnSOS
      });
    }
    setContactDialogOpen(false);
  };

  const handleDeleteContact = (id: string): void => {
    actions.removeEmergencyContact(id);
  };

  const handleSignOut = (): void => {
    signOut();
    navigate("/auth/sign-in", { replace: true });
  };

  const savedPlaces = ride.savedPlaces;
  const primaryContact = emergencyContacts.find((contact) => contact.isDefault);

  return (
    <ScreenScaffold
      header={<PageHeader title="Settings" subtitle="Account & preferences" onBack={() => navigate(-1)} />}
      contentSx={{ pt: { xs: uiTokens.spacing.xl, md: uiTokens.spacing.xl } }}
    >
      <AppCard variant="brand" onClick={() => navigate("/profile")}>
        <Stack direction="row" spacing={uiTokens.spacing.mdPlus} alignItems="center">
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: "var(--evz-radius-lg)",
              bgcolor: uiTokens.colors.brand,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              color: uiTokens.colors.ink
            }}
          >
            {user?.initials ?? "??"}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ ...uiTokens.text.itemTitle, mb: 0.25 }}>
              {user?.fullName ?? "EVzone Rider"}
            </Typography>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexWrap: "wrap" }}>
              <Stack direction="row" spacing={0.6} alignItems="center">
                <PhoneRoundedIcon sx={{ fontSize: 14, color: uiTokens.colors.brand }} />
                <Typography variant="caption" sx={{ ...uiTokens.text.itemBody, color: (t) => t.palette.text.secondary }}>
                  {user?.phone ?? ""}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.6} alignItems="center">
                <MailRoundedIcon sx={{ fontSize: 14, color: uiTokens.colors.brand }} />
                <Typography variant="caption" sx={{ ...uiTokens.text.itemBody, color: (t) => t.palette.text.secondary }}>
                  {user?.email ?? ""}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </AppCard>

      <Stack spacing={uiTokens.spacing.smPlus}>
        <SectionHeader eyebrow="Appearance" title="Display" compact />
        <ListSection sx={{ gap: uiTokens.spacing.smPlus }}>
          <ToggleRow
            icon={<DarkModeRoundedIcon />}
            title="Dark mode"
            description="Switch between light and dark theme"
            checked={mode === "dark"}
            onChange={() => toggleMode()}
          />
          <ToggleRow
            icon={<NotificationsRoundedIcon />}
            title="Safety alerts"
            description="Receive SOS and safety notifications"
            checked={settings.notifications.safetyAlerts}
            onChange={(checked) => actions.updateNotifications({ safetyAlerts: checked })}
          />
        </ListSection>
      </Stack>

      <Stack spacing={uiTokens.spacing.smPlus}>
        <SectionHeader eyebrow="Account" title="Personal details" compact />
        <ListSection>
          <RowActionItem
            icon={<LanguageRoundedIcon />}
            title="Language & region"
            description={`${settings.language} • ${settings.region}`}
            onClick={() => navigate("/settings/language")}
          />
          <RowActionItem
            icon={<PaymentRoundedIcon />}
            title="Payment methods"
            description="Manage cards and wallet funding"
            onClick={() => navigate("/wallet")}
          />
          <RowActionItem
            icon={<PrivacyTipRoundedIcon />}
            title="Privacy"
            description="Data sharing and visibility"
            onClick={() => navigate("/settings/privacy")}
          />
          <RowActionItem
            icon={<SecurityRoundedIcon />}
            title="Security"
            description="Password, 2FA, and trusted devices"
            onClick={() => navigate("/settings/security")}
          />
        </ListSection>
      </Stack>

      <Stack spacing={uiTokens.spacing.smPlus}>
        <SectionHeader eyebrow="Saved places" title="Frequently used" compact />
        <ListSection>
          {savedPlaces.map((place) => (
            <AppCard key={place.id} contentSx={{ px: uiTokens.spacing.mdPlus, py: uiTokens.spacing.mdPlus, gap: 0 }}>
              <Stack direction="row" spacing={uiTokens.spacing.md} alignItems="center">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "var(--evz-radius-md)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: uiTokens.colors.brand,
                    bgcolor: uiTokens.surfaces.brandTintSoft
                  }}
                >
                  {getSavedPlaceIcon(place.label)}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ ...uiTokens.text.itemTitle }}>
                    {place.label}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ ...uiTokens.text.itemBody, color: (t) => t.palette.text.secondary, display: "block" }}
                  >
                    {place.address}
                  </Typography>
                </Box>
              </Stack>
            </AppCard>
          ))}
          {!savedPlaces.length && (
            <AppCard variant="muted" contentSx={{ px: uiTokens.spacing.mdPlus, py: uiTokens.spacing.mdPlus }}>
              <Typography variant="caption" sx={{ ...uiTokens.text.itemBody, color: (t) => t.palette.text.secondary }}>
                No saved places yet. Add your home and office for faster booking.
              </Typography>
            </AppCard>
          )}
        </ListSection>
      </Stack>

      <Stack spacing={uiTokens.spacing.smPlus}>
        <SectionHeader eyebrow="Preferences" title="Ride & delivery" compact />
        <ListSection sx={{ gap: uiTokens.spacing.smPlus }}>
          <ToggleRow
            icon={<DirectionsCarRoundedIcon />}
            title="Quiet ride"
            description="Prefer a quiet ride experience"
            checked={settings.ride.quietRide}
            onChange={(checked) => actions.updateRidePreferences({ quietRide: checked })}
          />
          <ToggleRow
            icon={<DirectionsCarRoundedIcon />}
            title="Luggage assistance"
            description="Driver helps with luggage"
            checked={settings.ride.luggageAssistance}
            onChange={(checked) => actions.updateRidePreferences({ luggageAssistance: checked })}
          />
          <ToggleRow
            icon={<LocalShippingRoundedIcon />}
            title="Call before drop-off"
            description="Courier calls before delivery"
            checked={settings.delivery.callBeforeDropoff}
            onChange={(checked) => actions.updateDeliveryPreferences({ callBeforeDropoff: checked })}
          />
          <ToggleRow
            icon={<LocalShippingRoundedIcon />}
            title="Leave at door"
            description="Allow drop-off without signature"
            checked={settings.delivery.leaveAtDoor}
            onChange={(checked) => actions.updateDeliveryPreferences({ leaveAtDoor: checked })}
          />
        </ListSection>
      </Stack>

      <Stack spacing={uiTokens.spacing.smPlus}>
        <SectionHeader eyebrow="Emergency" title="SOS & safety" compact />
        <ListSection sx={{ gap: uiTokens.spacing.smPlus }}>
          <AppCard contentSx={{ px: uiTokens.spacing.mdPlus, py: uiTokens.spacing.mdPlus }}>
            <Stack direction="row" spacing={uiTokens.spacing.md} alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "var(--evz-radius-md)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: uiTokens.colors.brand,
                  bgcolor: uiTokens.surfaces.brandTintSoft
                }}
              >
                <ContactPhoneRoundedIcon />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ ...uiTokens.text.itemTitle }}>
                  Emergency contacts
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ ...uiTokens.text.itemBody, color: (t) => t.palette.text.secondary, display: "block" }}
                >
                  {primaryContact
                    ? `Default: ${primaryContact.name} (${primaryContact.phone})`
                    : "Add a trusted contact for SOS alerts"}
                </Typography>
              </Box>
              <Button
                size="small"
                variant="contained"
                onClick={openAddContact}
                startIcon={<AddRoundedIcon />}
                sx={{
                  borderRadius: "var(--evz-radius-pill)",
                  textTransform: "none",
                  fontSize: 12,
                  bgcolor: uiTokens.colors.brand,
                  color: uiTokens.colors.white,
                  px: 2
                }}
              >
                Add
              </Button>
            </Stack>
          </AppCard>

          {emergencyContacts.map((contact) => (
            <AppCard key={contact.id} contentSx={{ px: uiTokens.spacing.mdPlus, py: uiTokens.spacing.mdPlus, gap: 0 }}>
              <Stack direction="row" spacing={uiTokens.spacing.md} alignItems="center">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "var(--evz-radius-md)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: uiTokens.colors.brand,
                    bgcolor: uiTokens.surfaces.brandTintSoft,
                    fontWeight: 700
                  }}
                >
                  {contact.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <Typography variant="body2" sx={{ ...uiTokens.text.itemTitle }}>
                      {contact.name}
                    </Typography>
                    {contact.isDefault && (
                      <Chip
                        label="Default"
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: 10,
                          borderRadius: "var(--evz-radius-pill)",
                          bgcolor: "rgba(34,197,94,0.16)",
                          color: "#15803D"
                        }}
                      />
                    )}
                  </Stack>
                  <Typography
                    variant="caption"
                    sx={{ ...uiTokens.text.itemBody, color: (t) => t.palette.text.secondary, display: "block" }}
                  >
                    {contact.relationship} • {contact.phone}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  {!contact.isDefault && (
                    <Button
                      size="small"
                      variant="text"
                      onClick={() => actions.setDefaultEmergencyContact(contact.id)}
                      sx={{ textTransform: "none", fontSize: 11 }}
                    >
                      Set default
                    </Button>
                  )}
                  <IconButton size="small" onClick={() => openEditContact(contact)}>
                    <EditRoundedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDeleteContact(contact.id)}>
                    <DeleteRoundedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Stack>
              </Stack>
            </AppCard>
          ))}

          <ToggleRow
            icon={<ContactPhoneRoundedIcon />}
            title="Share trip status during SOS"
            description="Send live trip status to emergency contacts"
            checked={settings.privacy.shareTripStatus}
            onChange={(checked) => actions.updatePrivacy({ shareTripStatus: checked })}
          />
          <ToggleRow
            icon={<ContactPhoneRoundedIcon />}
            title="Share live location"
            description="Allow location sharing during emergency events"
            checked={settings.privacy.shareLocation}
            onChange={(checked) => actions.updatePrivacy({ shareLocation: checked })}
          />
        </ListSection>
      </Stack>

      <Stack spacing={uiTokens.spacing.smPlus}>
        <SectionHeader eyebrow="Support" title="Help & info" compact />
        <ListSection>
          <RowActionItem
            icon={<HelpRoundedIcon />}
            title="Help & support"
            description="Chat, FAQs, and contact support"
            onClick={() => navigate("/help")}
          />
          <RowActionItem
            icon={<InfoRoundedIcon />}
            title="About EVzone"
            description="App version and legal"
            onClick={() => navigate("/about")}
          />
        </ListSection>
      </Stack>

      <Divider sx={{ my: uiTokens.spacing.mdPlus }} />

      <Button
        fullWidth
        variant="outlined"
        startIcon={<LogoutRoundedIcon />}
        onClick={handleSignOut}
        sx={{
          py: uiTokens.spacing.md,
          fontSize: 13,
          fontWeight: 600,
          textTransform: "none",
          borderRadius: uiTokens.radius.md,
          borderColor: "var(--evz-danger)",
          color: "var(--evz-danger)",
          "&:hover": {
            borderColor: "var(--evz-danger-hover)",
            bgcolor: "var(--evz-surface-danger-tint-soft)"
          }
        }}
      >
        Sign out
      </Button>

      <Dialog open={contactDialogOpen} onClose={closeContactDialog} fullWidth maxWidth="xs">
        <DialogTitle>{editingContact ? "Edit emergency contact" : "Add emergency contact"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <TextField
            label="Full name"
            value={contactForm.name}
            onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Phone number"
            value={contactForm.phone}
            onChange={(e) => setContactForm((prev) => ({ ...prev, phone: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Relationship"
            value={contactForm.relationship}
            onChange={(e) => setContactForm((prev) => ({ ...prev, relationship: e.target.value }))}
            fullWidth
          />
          <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
            <Typography variant="body2">Notify on SOS</Typography>
            <Switch
              checked={contactForm.notifyOnSOS}
              onChange={(e) => setContactForm((prev) => ({ ...prev, notifyOnSOS: e.target.checked }))}
            />
          </Stack>
          <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
            <Typography variant="body2">Set as default</Typography>
            <Switch
              checked={contactForm.isDefault}
              onChange={(e) => setContactForm((prev) => ({ ...prev, isDefault: e.target.checked }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeContactDialog} variant="text">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSaveContact} disabled={!contactForm.name || !contactForm.phone}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </ScreenScaffold>
  );
}
