import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
  Divider,
  Collapse,
  IconButton
} from "@mui/material";

import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PendingRoundedIcon from "@mui/icons-material/PendingRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import MobileShell from "../components/MobileShell";
import DarkModeToggle from "../components/DarkModeToggle";

interface AmbulanceRequest {
  id: string;
  pickup: string;
  destination: string;
  date: string;
  time: string;
  status: "Completed" | "In Transit" | "Pending" | "Scheduled";
  type: "now" | "scheduled";
  requester: {
    name: string;
    phone: string;
    forWhom: string;
    reason: string;
    notes?: string;
  };
  driver: {
    name: string;
    phone: string;
    vehiclePlate: string;
    vehicleType: string;
    rating: number;
  };
}

const AMBULANCE_REQUESTS: AmbulanceRequest[] = [
  {
    id: "AMB-REQ-2026-02-27-001",
    pickup: "Nsambya Road 472",
    destination: "Nsambya Hospital",
    date: "27 Feb 2026",
    time: "14:32",
    status: "Completed",
    type: "now",
    requester: {
      name: "Joshua Tihabwangye",
      phone: "+256 700 123 456",
      forWhom: "Me",
      reason: "Emergency - chest pain"
    },
    driver: {
      name: "David Mukasa",
      phone: "+256 777 987 654",
      vehiclePlate: "UAX 312P",
      vehicleType: "Toyota HiAce Ambulance",
      rating: 4.8
    }
  },
  {
    id: "AMB-REQ-2026-02-25-004",
    pickup: "Bugolobi Clinic",
    destination: "Mulago National Referral Hospital",
    date: "25 Feb 2026",
    time: "22:15",
    status: "Completed",
    type: "scheduled",
    requester: {
      name: "Sarah Namukasa",
      phone: "+256 701 456 789",
      forWhom: "Family / friend",
      reason: "Clinic referral",
      notes: "Patient requires wheelchair access"
    },
    driver: {
      name: "Peter Ochieng",
      phone: "+256 772 345 678",
      vehiclePlate: "UBB 108K",
      vehicleType: "Mercedes Sprinter Ambulance",
      rating: 4.9
    }
  },
  {
    id: "AMB-REQ-2026-02-28-002",
    pickup: "Kampala International Hospital",
    destination: "Case Hospital",
    date: "28 Feb 2026",
    time: "09:00",
    status: "Scheduled",
    type: "scheduled",
    requester: {
      name: "Grace Achieng",
      phone: "+256 703 222 111",
      forWhom: "Clinic / hospital",
      reason: "Specialist appointment"
    },
    driver: {
      name: "Pending assignment",
      phone: "—",
      vehiclePlate: "—",
      vehicleType: "Will be assigned",
      rating: 0
    }
  },
  {
    id: "AMB-REQ-2026-02-27-003",
    pickup: "Ntinda Shopping Centre",
    destination: "Mengo Hospital",
    date: "27 Feb 2026",
    time: "16:45",
    status: "In Transit",
    type: "now",
    requester: {
      name: "James Kato",
      phone: "+256 706 789 012",
      forWhom: "Me",
      reason: "Emergency - accident injury"
    },
    driver: {
      name: "Francis Ssempala",
      phone: "+256 778 654 321",
      vehiclePlate: "UAZ 445M",
      vehicleType: "Toyota Land Cruiser Ambulance",
      rating: 4.7
    }
  }
];

const statusConfig: Record<AmbulanceRequest["status"], { color: string; bgcolor: string; icon: React.ReactNode }> = {
  Completed: {
    color: "#16A34A",
    bgcolor: "rgba(22,163,74,0.12)",
    icon: <CheckCircleRoundedIcon sx={{ fontSize: 14 }} />
  },
  "In Transit": {
    color: "#F59E0B",
    bgcolor: "rgba(245,158,11,0.12)",
    icon: <LocalShippingRoundedIcon sx={{ fontSize: 14 }} />
  },
  Pending: {
    color: "#6366F1",
    bgcolor: "rgba(99,102,241,0.12)",
    icon: <PendingRoundedIcon sx={{ fontSize: 14 }} />
  },
  Scheduled: {
    color: "#3B82F6",
    bgcolor: "rgba(59,130,246,0.12)",
    icon: <AccessTimeRoundedIcon sx={{ fontSize: 14 }} />
  }
};

function AmbulanceDashboardHomeScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showPastRequests, setShowPastRequests] = useState(false);

  const handleRequestAmbulance = () => {
    navigate("/ambulance/book-transfer");
  };

  const handleToggleDetails = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const activeRequests = AMBULANCE_REQUESTS.filter((r) => r.status !== "Completed");
  const pastRequests = AMBULANCE_REQUESTS.filter((r) => r.status === "Completed");
  const displayedRequests = showPastRequests ? AMBULANCE_REQUESTS : activeRequests;

  return (
    <Box>
      {/* Green Header */}
      <Box sx={{ bgcolor: "#03CD8C", px: 2, pt: 2.5, pb: 2.5, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", minHeight: 80 }}>
        <IconButton
          size="small"
          aria-label="Back"
          onClick={() => navigate(-1)}
          sx={{
            position: "absolute",
            left: 20,
            borderRadius: 999,
            bgcolor: "rgba(255,255,255,0.2)",
            color: "#FFFFFF",
            "&:hover": { bgcolor: "rgba(255,255,255,0.3)" }
          }}
        >
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <Box sx={{ mx: 7, textAlign: "center" }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, fontSize: 18, lineHeight: 1.2, color: "#FFFFFF" }}
          >
            Ambulance & medical transport
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontSize: 12, color: "rgba(255,255,255,0.9)", mt: 0.5, display: "block" }}
          >
            Request emergency or planned medical transfer
          </Typography>
        </Box>
      </Box>

    <Box sx={{ px: 2.5, pt: 2, pb: 3 }}>

      {/* Request ambulance card */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 3,
          bgcolor: (t) =>
            t.palette.mode === "light"
              ? "radial-gradient(circle at top, #FECACA, #FEF2F2)"
              : "radial-gradient(circle at top, #7F1D1D, #020617)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(220,38,38,0.5)"
              : "1px solid rgba(248,113,113,0.8)"
        }}
      >
        <CardContent sx={{ px: 1.9, py: 1.9 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1.3 }}
          >
            <Box>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Need an ambulance?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: (t) => t.palette.text.primary
                }}
              >
                24/7 partner network
              </Typography>
            </Box>
            <Chip
              size="small"
              icon={<NotificationsActiveRoundedIcon sx={{ fontSize: 16 }} />}
              label="Priority line"
              sx={{
                borderRadius: 999,
                fontSize: 10,
                height: 22,
                bgcolor: (t) =>
                  t.palette.mode === "light"
                    ? "rgba(254,242,242,0.95)"
                    : "rgba(15,23,42,0.96)",
                color: (t) => t.palette.text.primary
              }}
            />
          </Stack>

            <Button
              fullWidth
              variant="contained"
            onClick={handleRequestAmbulance}
              sx={{
                borderRadius: 999,
                py: 0.9,
                fontSize: 13,
                fontWeight: 700,
                textTransform: "none",
                bgcolor: "#B91C1C",
                color: "#FEF2F2",
              transition: "all 0.2s ease",
                "&:hover": {
                bgcolor: "#991B1B",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(185,28,28,0.4)"
              },
              "&:active": { transform: "translateY(0)" }
              }}
            >
            Request ambulance
            </Button>
        </CardContent>
      </Card>

      {/* Ambulance Requests List */}
      <Box sx={{ mb: 1 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          sx={{ mb: 1.5 }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
          >
            Ambulance requests
          </Typography>
            <Stack direction="row" spacing={0.75} alignItems="center">
            <Chip
              size="small"
              label={`${displayedRequests.length} shown`}
              sx={{
                borderRadius: 999,
                fontSize: 10,
                height: 22,
                bgcolor: (t) =>
                        t.palette.mode === "light"
                    ? "rgba(220,38,38,0.08)"
                    : "rgba(239,68,68,0.12)",
                color: "#DC2626",
                fontWeight: 600
              }}
            />
            <Button
              size="small"
              variant={showPastRequests ? "contained" : "outlined"}
              onClick={() => setShowPastRequests((prev) => !prev)}
              sx={{
                borderRadius: 999,
                px: 1.5,
                py: 0.3,
                fontSize: 10.5,
                fontWeight: 600,
                textTransform: "none",
                minWidth: 0,
                ...(showPastRequests
                  ? {
                      bgcolor: "#B91C1C",
                      color: "#FEF2F2",
                      "&:hover": { bgcolor: "#991B1B" }
                    }
                  : {
                      borderColor: (t: any) =>
                        t.palette.mode === "light"
                          ? "rgba(209,213,219,0.9)"
                          : "rgba(51,65,85,0.9)",
                      color: (t: any) => t.palette.text.secondary,
                      "&:hover": {
                        borderColor: "#DC2626",
                        color: "#DC2626",
                        bgcolor: "rgba(220,38,38,0.06)"
                      }
                    }),
                transition: "all 0.2s ease"
              }}
            >
              {showPastRequests
                ? `Hide past (${pastRequests.length})`
                : `Show past (${pastRequests.length})`}
            </Button>
          </Stack>
        </Stack>

        {displayedRequests.map((req) => {
          const isExpanded = expandedId === req.id;
          const sc = statusConfig[req.status];

          return (
      <Card
              key={req.id}
        elevation={0}
        sx={{
          mb: 1.5,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
                  isExpanded
                    ? `1px solid ${sc.color}`
                    : t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
                      : "1px solid rgba(51,65,85,0.9)",
                transition: "border-color 0.2s ease"
        }}
      >
              <CardContent sx={{ px: 1.75, py: 1.5, "&:last-child": { pb: 1.5 } }}>
                {/* Request summary row */}
          <Stack
            direction="row"
            justifyContent="space-between"
                  alignItems="flex-start"
          >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.4 }}>
                      <PlaceRoundedIcon sx={{ fontSize: 14, color: "#DC2626" }} />
            <Typography
                        variant="body2"
                        sx={{
                          fontSize: 12.5,
                          fontWeight: 600,
                          letterSpacing: "-0.01em",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}
            >
                        {req.pickup} → {req.destination}
            </Typography>
          </Stack>

                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <Chip
                        size="small"
                        icon={sc.icon as React.ReactElement}
                        label={req.status}
                        sx={{
                          borderRadius: 999,
                          fontSize: 10,
                          height: 22,
                          bgcolor: sc.bgcolor,
                          color: sc.color,
                          fontWeight: 600,
                          "& .MuiChip-icon": { color: sc.color }
                        }}
                      />
                      <Chip
                        size="small"
                        label={req.type === "now" ? "Urgent" : "Scheduled"}
              sx={{
                          borderRadius: 999,
                          fontSize: 10,
                          height: 22,
                          bgcolor: (t) =>
                            t.palette.mode === "light" ? "#F3F4F6" : "rgba(51,65,85,0.5)",
                          color: (t) => t.palette.text.secondary,
                          fontWeight: 500
                        }}
                      />
                    </Stack>

                    <Stack direction="row" spacing={0.5} alignItems="center">
                  <AccessTimeRoundedIcon
                        sx={{ fontSize: 13, color: (t) => t.palette.text.secondary }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
                  >
                        {req.date} • {req.time}
                  </Typography>
                    </Stack>
                  </Box>

                  <IconButton
                    size="small"
                    onClick={() => handleToggleDetails(req.id)}
                    sx={{
                      mt: -0.25,
                      transition: "all 0.2s ease",
                      color: isExpanded ? sc.color : (t: any) => t.palette.text.secondary,
                      "&:hover": {
                        bgcolor: sc.bgcolor
                      }
                    }}
                  >
                    {isExpanded ? (
                      <ExpandLessRoundedIcon sx={{ fontSize: 20 }} />
                    ) : (
                      <ExpandMoreRoundedIcon sx={{ fontSize: 20 }} />
                    )}
                  </IconButton>
                </Stack>

                {/* Expandable details */}
                <Collapse in={isExpanded} timeout={250}>
                  <Divider sx={{ my: 1.2, borderColor: (t) => t.palette.divider }} />

                  {/* Driver details */}
                  <Box sx={{ mb: 1.5 }}>
                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.75 }}>
                      <DirectionsCarRoundedIcon sx={{ fontSize: 15, color: "#F59E0B" }} />
                      <Typography
                        variant="caption"
                        sx={{ fontSize: 11, fontWeight: 700, color: (t) => t.palette.text.primary }}
                      >
                        Driver details
                      </Typography>
                    </Stack>

                    <Box
                      sx={{
                        pl: 1,
                        borderLeft: "2px solid",
                        borderColor: "rgba(245,158,11,0.4)"
                      }}
                    >
                      <Stack spacing={0.5}>
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <PersonRoundedIcon sx={{ fontSize: 14, color: (t) => t.palette.text.secondary }} />
                          <Typography variant="caption" sx={{ fontSize: 11.5 }}>
                            {req.driver.name}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <PhoneIphoneRoundedIcon sx={{ fontSize: 14, color: (t) => t.palette.text.secondary }} />
                          <Typography variant="caption" sx={{ fontSize: 11.5 }}>
                            {req.driver.phone}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <BadgeRoundedIcon sx={{ fontSize: 14, color: (t) => t.palette.text.secondary }} />
                          <Typography variant="caption" sx={{ fontSize: 11.5 }}>
                            {req.driver.vehicleType} • {req.driver.vehiclePlate}
                          </Typography>
                        </Stack>
                        {req.driver.rating > 0 && (
                          <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, pl: 2.5 }}>
                            ⭐ {req.driver.rating} rating
                          </Typography>
                        )}
                </Stack>
              </Box>
            </Box>

                  {/* Requester details */}
                  <Box>
                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.75 }}>
                      <PersonRoundedIcon sx={{ fontSize: 15, color: "#3B82F6" }} />
      <Typography
        variant="caption"
                        sx={{ fontSize: 11, fontWeight: 700, color: (t) => t.palette.text.primary }}
      >
                        Requester details
                      </Typography>
                    </Stack>

                    <Box
                      sx={{
                        pl: 1,
                        borderLeft: "2px solid",
                        borderColor: "rgba(59,130,246,0.4)"
                      }}
                    >
                      <Stack spacing={0.5}>
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <PersonRoundedIcon sx={{ fontSize: 14, color: (t) => t.palette.text.secondary }} />
                          <Typography variant="caption" sx={{ fontSize: 11.5 }}>
                            {req.requester.name}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <PhoneIphoneRoundedIcon sx={{ fontSize: 14, color: (t) => t.palette.text.secondary }} />
                          <Typography variant="caption" sx={{ fontSize: 11.5 }}>
                            {req.requester.phone}
                          </Typography>
                        </Stack>
                        <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, pl: 2.5 }}>
                          For: {req.requester.forWhom}
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, pl: 2.5 }}>
                          Reason: {req.requester.reason}
                        </Typography>
                        {req.requester.notes && (
                          <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, pl: 2.5, fontStyle: "italic" }}>
                            Notes: {req.requester.notes}
      </Typography>
                        )}
                      </Stack>
                    </Box>
                  </Box>

                  {/* Track the movement button */}
                  {req.status !== "Completed" && (
                    <Button
                      fullWidth
                      size="small"
                      variant="contained"
                      onClick={() => navigate(`/ambulance/tracking/${req.id}`, { state: { request: req } })}
                      startIcon={<MapRoundedIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        mt: 1.5,
                        borderRadius: 999,
                        py: 0.7,
                        fontSize: 12,
                        textTransform: "none",
                        fontWeight: 700,
                        bgcolor: "#B91C1C",
                        color: "#FEF2F2",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor: "#991B1B",
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 12px rgba(185,28,28,0.4)"
                        },
                        "&:active": { transform: "translateY(0)" }
                      }}
                    >
                      Track the movement
                    </Button>
                  )}
                </Collapse>
              </CardContent>
            </Card>
          );
        })}
      </Box>
      </Box>
    </Box>
  );
}

export default function AmbulanceDashboard(): React.JSX.Element {
  return (
    <>
      <DarkModeToggle />
      <MobileShell>
        <AmbulanceDashboardHomeScreen />
      </MobileShell>
    </>
  );
}
