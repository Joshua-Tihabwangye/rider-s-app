import React, { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate } from "react-router-dom";
import {
  
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import FamilyRestroomRoundedIcon from "@mui/icons-material/FamilyRestroomRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import MobileShell from "../components/MobileShell";

const CONTACTS = [
  {
    id: 2,
    name: "John Doe",
    relation: "Friend",
    phone: "+256 772 987654",
    initials: "JD",
    rides: 8
  }
];

function ContactCard({ contact, selected, onSelect }) {
  const isActive = selected?.id === contact.id;
  return (
    <Card
      elevation={0}
      onClick={() => onSelect(contact)}
      sx={{
        mb: 1.5,
        borderRadius: 2,
        cursor: "pointer",
        transition: "all 0.15s ease",
        bgcolor: (theme) =>
          theme.palette.mode === "light"
            ? isActive
              ? "#ECFDF5"
              : "#FFFFFF"
            : isActive
            ? "rgba(15,118,110,0.32)"
            : "rgba(15,23,42,0.98)",
        border: (theme) =>
          isActive
            ? "1px solid #03CD8C"
            : theme.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.9)"
      }}
    >
      <CardContent sx={{ px: 1.75, py: 1.4 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: isActive ? "primary.main" : "rgba(15,118,110,0.16)",
                color: isActive ? "#020617" : "#047857",
                fontSize: 16,
                fontWeight: 600
              }}
            >
              {contact.initials}
            </Avatar>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
                >
                  {contact.name}
                </Typography>
                <Chip
                  size="small"
                  icon={
                    <FamilyRestroomRoundedIcon
                      sx={{ fontSize: 14, color: "#22c55e" }}
                    />
                  }
                  label={contact.relation}
                  sx={{
                    borderRadius: 999,
                    fontSize: 10,
                    height: 22,
                    bgcolor: (theme) =>
                      theme.palette.mode === "light"
                        ? "#F3F4F6"
                        : "rgba(15,23,42,1)",
                    color: "rgba(75,85,99,1)",
                    pl: 0.5
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <PhoneIphoneRoundedIcon
                  sx={{ fontSize: 15, color: "rgba(148,163,184,1)" }}
                />
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
                >
                  {contact.phone}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 0.3 }}>
              <StarRoundedIcon sx={{ fontSize: 15, color: "#fbbf24" }} />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
              >
                {contact.rides} rides
              </Typography>
            </Box>
            {isActive && (
              <Chip
                label="Selected"
                size="small"
                sx={{
                  mt: 0.5,
                  borderRadius: 999,
                  fontSize: 10,
                  height: 22,
                  bgcolor: "primary.main",
                  color: "#020617"
                }}
              />
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function SwitchRiderContactSelectedScreen() {
  const navigate = useNavigate();
  const [selectedContact, setSelectedContact] = useState(CONTACTS[0]);

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 2.5,
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
              borderRadius: 999,
              bgcolor: (theme) =>
                theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)",
              border: (theme) =>
                theme.palette.mode === "light"
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
              Ride for contact
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
            >
              Use my account to book for someone I know
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Selected summary */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: 2,
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#ECFDF5" : "rgba(15,23,42,0.98)",
          border: "1px solid #03CD8C"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: "primary.main",
                color: "#020617",
                fontSize: 18,
                fontWeight: 600
              }}
            >
              {selectedContact.initials}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
                >
                  {selectedContact.name}
                </Typography>
                <Chip
                  size="small"
                  icon={
                    <PersonRoundedIcon
                      sx={{ fontSize: 14, color: "#22c55e" }}
                    />
                  }
                  label={selectedContact.relation}
                  sx={{
                    borderRadius: 999,
                    fontSize: 10,
                    height: 22,
                    bgcolor: (theme) =>
                      theme.palette.mode === "light"
                        ? "#F3F4F6"
                        : "rgba(15,23,42,1)",
                    color: "rgba(75,85,99,1)",
                    pl: 0.5
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                sx={{ mt: 0.25, fontSize: 11, color: (theme) => theme.palette.text.secondary }}
              >
                {selectedContact.phone}
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
              >
                They will receive SMS updates with driver details.
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Contact list */}
      <Typography
        variant="caption"
        sx={{
          mb: 1,
          display: "block",
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: (theme) => theme.palette.text.secondary
        }}
      >
        My contacts
      </Typography>

      <Box sx={{ mb: 2.5 }}>
        {CONTACTS.map((c) => (
          <ContactCard
            key={c.id}
            contact={c}
            selected={selectedContact}
            onSelect={setSelectedContact}
          />
        ))}
      </Box>

      <Button
        fullWidth
        variant="contained"
        sx={{
          borderRadius: 999,
          py: 1.1,
          fontSize: 15,
          fontWeight: 600,
          textTransform: "none",
          bgcolor: "primary.main",
          color: "#020617",
          "&:hover": { bgcolor: "#06e29a" }
        }}
      >
        Use this contact
      </Button>
    </Box>
  );
}

export default function RiderScreen11SwitchRiderContactSelectedCanvas_v2() {
      return (
    
      
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          bgcolor: (theme) => theme.palette.background.default
        }}
      >
        

        <DarkModeToggle />

        

        <MobileShell>
          <SwitchRiderContactSelectedScreen />
        </MobileShell>
      </Box>
    
  );
}
