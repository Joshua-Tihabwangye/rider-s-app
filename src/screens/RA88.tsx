import React, { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate } from "react-router-dom";
import {
  
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Button
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";

import MobileShell from "../components/MobileShell";

const AMBULANCE_REQUESTS = [
  {
    id: "AMB-REQ-2025-10-07-001",
    date: "Today • 14:32",
    from: "Nsambya Road 472, Kampala",
    to: "Nsambya Hospital",
    status: "Completed"
  },
  {
    id: "AMB-REQ-2025-09-25-004",
    date: "25 Sep 2025 • 09:10",
    from: "Bugolobi Village, Kampala",
    to: "Mulago National Referral Hospital",
    status: "Completed"
  },
  {
    id: "AMB-REQ-2025-09-10-002",
    date: "10 Sep 2025 • 18:45",
    from: "Kansanga Market",
    to: "Case Hospital",
    status: "Cancelled"
  }
];

interface AmbulanceRequest {
  id: string;
  date: string;
  from: string;
  to: string;
  status: string;
}

interface AmbulanceRequestCardProps {
  req: AmbulanceRequest;
}

function AmbulanceRequestCard({ req }: AmbulanceRequestCardProps): React.JSX.Element {
  const navigate = useNavigate();
  return (
    <Card
      elevation={0}
      onClick={() => navigate(`/ambulance/tracking/${req.id}`)}
      sx={{
        mb: 1.75,
        borderRadius: 2,
        cursor: "pointer",
        bgcolor: (t) =>
          t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
        border: (t) =>
          t.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.9)",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 4
        }
      }}
    >
      <CardContent sx={{ px: 1.75, py: 1.6 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 999,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FEE2E2" : "rgba(127,29,29,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <LocalHospitalRoundedIcon sx={{ fontSize: 22, color: "#DC2626" }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              Ambulance request
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              {req.date}
            </Typography>
            <Stack spacing={0.25} sx={{ mt: 0.4 }}>
              <Stack direction="row" spacing={0.75} alignItems="center">
                <PlaceRoundedIcon
                  sx={{ fontSize: 15, color: (t) => t.palette.text.secondary }}
                />
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  From: {req.from}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.75} alignItems="center">
                <PlaceRoundedIcon
                  sx={{ fontSize: 15, color: (t) => t.palette.text.secondary }}
                />
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  To: {req.to}
                </Typography>
              </Stack>
            </Stack>
          </Box>
          <Chip
            size="small"
            label={req.status}
            sx={{
              borderRadius: 999,
              fontSize: 10,
              height: 22,
              bgcolor:
                req.status === "Completed"
                  ? "rgba(34,197,94,0.12)"
                  : "rgba(148,163,184,0.18)",
              color:
                req.status === "Completed" ? "#16A34A" : "rgba(148,163,184,1)"
            }}
          />
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
          >
            ID: {req.id}
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/ambulance/tracking/${req.id}`);
            }}
            sx={{
              borderRadius: 999,
              px: 2,
              py: 0.4,
              fontSize: 12,
              textTransform: "none",
              transition: "all 0.15s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: 2
              }
            }}
          >
            View details
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function AmbulanceRequestsHistoryScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [tab, setTab] = useState("all");

  const filtered = AMBULANCE_REQUESTS.filter((req) => {
    if (tab === "all") return true;
    return req.status.toLowerCase() === tab;
  });

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          minHeight: 48
        }}
      >
        <IconButton
          size="small"
          aria-label="Back"
          onClick={() => navigate(-1)}
          sx={{
            position: "absolute",
            left: 0,
            borderRadius: 999,
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
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
          >
            Ambulance requests
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, display: "block" }}
          >
            Completed and cancelled requests
          </Typography>
        </Box>
      </Box>

      {/* Filters */}
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
        <Chip
          label="All"
          onClick={() => setTab("all")}
          size="small"
          sx={{
            borderRadius: 999,
            fontSize: 11,
            height: 26,
            bgcolor: tab === "all" ? "primary.main" : (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)",
            color: tab === "all" ? "#020617" : (t) => t.palette.text.primary
          }}
        />
        <Chip
          label="Completed"
          onClick={() => setTab("completed")}
          size="small"
          sx={{
            borderRadius: 999,
            fontSize: 11,
            height: 26,
            bgcolor: tab === "completed" ? "primary.main" : (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)",
            color: tab === "completed" ? "#020617" : (t) => t.palette.text.primary
          }}
        />
        <Chip
          label="Cancelled"
          onClick={() => setTab("cancelled")}
          size="small"
          sx={{
            borderRadius: 999,
            fontSize: 11,
            height: 26,
            bgcolor: tab === "cancelled" ? "primary.main" : (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)",
            color: tab === "cancelled" ? "#020617" : (t) => t.palette.text.primary
          }}
        />
      </Stack>

      {filtered.length === 0 ? (
        <Typography
          variant="caption"
          sx={{ mt: 4, display: "block", textAlign: "center", color: (t) => t.palette.text.secondary }}
        >
          No ambulance requests in this view yet.
        </Typography>
      ) : (
        filtered.map((req) => <AmbulanceRequestCard key={req.id} req={req} />)
      )}
    </Box>
  );
}

export default function RiderScreen88AmbulanceRequestsHistoryCanvas_v2() {
      return (
    
      
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          bgcolor: (t) => t.palette.background.default
        }}
      >
        

        <DarkModeToggle />

        

        <MobileShell>
          <AmbulanceRequestsHistoryScreen />
        </MobileShell>
      </Box>
    
  );
}
