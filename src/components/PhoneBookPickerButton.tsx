import React from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import ContactPhoneRoundedIcon from "@mui/icons-material/ContactPhoneRounded";
import SmartphoneRoundedIcon from "@mui/icons-material/SmartphoneRounded";
import type { PhoneBookContact } from "../features/contacts/phoneBook";
import {
  canUseDevicePhoneBook,
  getFallbackPhoneBookContacts,
  pickDevicePhoneBookContact
} from "../features/contacts/phoneBook";

interface PhoneBookPickerButtonProps extends Omit<ButtonProps, "onClick"> {
  onContactPicked: (contact: PhoneBookContact) => void;
  dialogTitle?: string;
  dialogDescription?: string;
}

export default function PhoneBookPickerButton({
  onContactPicked,
  dialogTitle = "Phone book",
  dialogDescription = "Choose a contact from the device phone book or the app fallback contacts.",
  children,
  startIcon,
  ...buttonProps
}: PhoneBookPickerButtonProps): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const contacts = React.useMemo(() => getFallbackPhoneBookContacts(), []);
  const filteredContacts = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return contacts;
    return contacts.filter((contact) => {
      const haystack = `${contact.name} ${contact.phone} ${contact.relation ?? ""}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [contacts, query]);

  const handleClose = (): void => {
    setOpen(false);
    setQuery("");
    setBusy(false);
    setMessage("");
  };

  const handleSelect = (contact: PhoneBookContact): void => {
    onContactPicked(contact);
    handleClose();
  };

  const handleDeviceImport = async (): Promise<void> => {
    setBusy(true);
    setMessage("");

    try {
      const contact = await pickDevicePhoneBookContact();
      if (!contact) {
        setMessage("No device contact was selected. You can still choose one from the phone-book list below.");
        return;
      }
      handleSelect(contact);
    } catch {
      setMessage("Device phone-book access is unavailable here. Use one of the phone-book contacts below.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        startIcon={startIcon ?? <ContactPhoneRoundedIcon sx={{ fontSize: 18 }} />}
        {...buttonProps}
      >
        {children ?? "Import from phone book"}
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent sx={{ pt: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {dialogDescription}
          </Typography>

          <Button
            variant="outlined"
            size="small"
            onClick={handleDeviceImport}
            disabled={busy}
            startIcon={<SmartphoneRoundedIcon sx={{ fontSize: 18 }} />}
            sx={{ width: "fit-content", textTransform: "none" }}
          >
            {canUseDevicePhoneBook() ? "Use device phone book" : "Try device phone book"}
          </Button>

          {!canUseDevicePhoneBook() && (
            <Alert severity="info">
              Device phone-book access works on supported mobile browsers and webviews. The fallback list below stays
              available for local testing.
            </Alert>
          )}

          {message && <Alert severity="warning">{message}</Alert>}

          <TextField
            size="small"
            placeholder="Search phone book"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            fullWidth
          />

          <Stack spacing={1} sx={{ maxHeight: 320, overflowY: "auto", pr: 0.25 }}>
            {filteredContacts.map((contact) => (
              <Box
                key={contact.id}
                onClick={() => handleSelect(contact)}
                sx={{
                  p: 1.25,
                  borderRadius: 2,
                  border: "1px solid rgba(209,213,219,0.9)",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "rgba(3,205,140,0.08)",
                    borderColor: "rgba(3,205,140,0.45)"
                  }
                }}
              >
                <Avatar
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: "rgba(3,205,140,0.16)",
                    color: "#047857",
                    fontWeight: 700
                  }}
                >
                  {contact.initials}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {contact.name}
                  </Typography>
                  <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
                    {contact.phone}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {contact.relation}
                  </Typography>
                </Box>
              </Box>
            ))}

            {filteredContacts.length === 0 && (
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                No contacts match this search.
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} variant="text">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
