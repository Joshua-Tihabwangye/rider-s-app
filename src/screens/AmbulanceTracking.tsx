import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography
} from "@mui/material";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import PhoneEnabledRoundedIcon from "@mui/icons-material/PhoneEnabledRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import ExpandableMapPanel from "../components/maps/ExpandableMapPanel";
import MapShell from "../components/maps/MapShell";
import ScreenScaffold from "../components/ScreenScaffold";
import { useAppData } from "../contexts/AppDataContext";
import { uiTokens } from "../design/tokens";
import { getApproachPoint, normalizeRoute } from "../utils/mapRoutes";

function getEtaMinutes(status: string): number {
  if (status === "arrived") return 0;
  if (status === "en_route") return 6;
  return 8;
}

function getStatusLabel(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (value) => value.toUpperCase());
}

function AmbulanceLiveTrackingScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { ambulance, actions } = useAppData();
  const request = ambulance.request;
  const pickupCoords = request.pickup?.coordinates ?? null;
  const destinationCoords = request.destination?.coordinates ?? null;
  const baseRoute = normalizeRoute(
    pickupCoords && destinationCoords ? [pickupCoords, destinationCoords] : []
  );
  const [progress, setProgress] = useState(request.status === "arrived" ? 1 : 0.3);
  const etaMinutes = getEtaMinutes(request.status);
  const driverLocation = useMemo(
    () => getApproachPoint(baseRoute, progress) ?? pickupCoords,
    [baseRoute, pickupCoords, progress]
  );

  useEffect(() => {
    if (request.status !== "en_route") {
      return undefined;
    }
    const interval = window.setInterval(() => {
      setProgress((previous) => Math.min(previous + 0.06, 1));
    }, 1200);
    return () => window.clearInterval(interval);
  }, [request.status]);

  useEffect(() => {
    actions.updateAmbulanceRequest({
      status: request.status === "idle" ? "en_route" : request.status,
      dispatchedAt: request.dispatchedAt ?? new Date().toISOString()
    });
  }, [actions, request.dispatchedAt, request.status]);

  const topMapBleedSx = {
    position: "relative",
    width: {
      xs: "calc(100% + (var(--rider-shell-content-px-xs, 20px) * 2))",
      md: "calc(100% + (var(--rider-shell-content-px-md, 24px) * 2))"
    },
    ml: {
      xs: "calc(var(--rider-shell-content-px-xs, 20px) * -1)",
      md: "calc(var(--rider-shell-content-px-md, 24px) * -1)"
    },
    mr: {
      xs: "calc(var(--rider-shell-content-px-xs, 20px) * -1)",
      md: "calc(var(--rider-shell-content-px-md, 24px) * -1)"
    },
    overflow: "hidden"
  } as const;

  const primaryActionLabel =
    request.status === "arrived" ? "Complete emergency trip" : "Mark ambulance arrived";

  const handlePrimaryAction = () => {
    if (request.status === "arrived") {
      const completedAt = new Date().toISOString();
      actions.updateAmbulanceRequest({
        status: "completed",
        completedAt
      });
      navigate(`/ambulance/history/${request.id}`, {
        replace: true,
        state: {
          requestSnapshot: {
            ...request,
            status: "completed",
            completedAt
          }
        }
      });
      return;
    }

    const arrivedAt = new Date().toISOString();
    actions.updateAmbulanceRequest({
      status: "arrived",
      arrivedAt
    });
    setProgress(1);
  };

  return (
    <ScreenScaffold disableTopPadding>
      <ExpandableMapPanel
        containerSx={topMapBleedSx}
        mapHeight={{ xs: "48dvh", md: "50vh" }}
        expandedMapHeight={{ xs: "78dvh", md: "76vh" }}
        map={
          <MapShell
            preset="compact"
            sx={{ height: "100%" }}
            onBack={() => navigate(-1)}
            showBackButton
            pickupLocation={pickupCoords}
            dropoffLocation={destinationCoords}
            driverLocation={driverLocation}
            routePolyline={baseRoute}
            routeInfoLabel={etaMinutes > 0 ? `ETA ${etaMinutes} min` : "Ambulance arrived"}
            canvasSx={{ background: uiTokens.map.canvasEmphasis }}
          >
            <Box sx={{ position: "absolute", top: 14, left: 72 }}>
              <Chip
                size="small"
                icon={<AccessTimeRoundedIcon sx={{ fontSize: 14 }} />}
                label={etaMinutes > 0 ? `ETA ${etaMinutes} min` : "Arrived"}
                sx={{
                  borderRadius: 5,
                  fontSize: 11,
                  height: 24,
                  bgcolor: "rgba(15,23,42,0.82)",
                  color: "#F9FAFB"
                }}
              />
            </Box>
          </MapShell>
        }
        details={
          <>
            <Box sx={{ pt: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}>
                {request.status === "arrived" ? "Ambulance has arrived" : "Ambulance tracking"}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                Follow the live response status and continue the request without leaving this flow.
              </Typography>
            </Box>

            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"),
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)"
              }}
            >
              <CardContent sx={{ px: 1.75, py: 1.6 }}>
                <Stack spacing={0.9}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {request.id}
                  </Typography>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <PlaceRoundedIcon sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }} />
                    <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                      Pickup: {request.pickup?.label ?? request.pickup?.address ?? "Current pickup not set"}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <LocalHospitalRoundedIcon sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }} />
                    <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                      Destination: {request.destination?.label ?? request.destination?.address ?? "Destination hospital pending"}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <DirectionsCarFilledRoundedIcon sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }} />
                    <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                      {request.assignedUnit ?? "Assigned unit pending"} • {request.ambulancePlateNumber ?? "Plate pending"}
                    </Typography>
                  </Stack>
                  <Chip
                    size="small"
                    label={getStatusLabel(request.status)}
                    sx={{
                      width: "fit-content",
                      borderRadius: 5,
                      fontSize: 11,
                      bgcolor:
                        request.status === "arrived"
                          ? "rgba(34,197,94,0.14)"
                          : "rgba(59,130,246,0.14)",
                      color: request.status === "arrived" ? "#15803D" : "#1D4ED8"
                    }}
                  />
                </Stack>
              </CardContent>
            </Card>

            <Stack direction="row" spacing={1.25}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<PhoneEnabledRoundedIcon sx={{ fontSize: 18 }} />}
                onClick={() => navigate("/help")}
                sx={{
                  borderRadius: 5,
                  py: 0.9,
                  fontSize: 13,
                  textTransform: "none"
                }}
              >
                Call control room
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<PhoneIphoneRoundedIcon sx={{ fontSize: 18 }} />}
                onClick={() => {
                  if (request.driverPhone) {
                    window.location.href = `tel:${request.driverPhone}`;
                  }
                }}
                sx={{
                  borderRadius: 5,
                  py: 0.9,
                  fontSize: 13,
                  textTransform: "none"
                }}
              >
                Call ambulance
              </Button>
            </Stack>

            <Button
              fullWidth
              variant="contained"
              onClick={handlePrimaryAction}
              sx={{
                borderRadius: 5,
                py: 1.1,
                fontSize: 14,
                fontWeight: 700,
                textTransform: "none",
                bgcolor: request.status === "arrived" ? "#16A34A" : "#DC2626",
                "&:hover": {
                  bgcolor: request.status === "arrived" ? "#15803D" : "#B91C1C"
                }
              }}
            >
              {primaryActionLabel}
            </Button>
          </>
        }
      />
    </ScreenScaffold>
  );
}

export default function RiderScreen87AmbulanceLiveTrackingCanvas_v2(): React.JSX.Element {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: (t) => t.palette.background.default
      }}
    >
      <AmbulanceLiveTrackingScreen />
    </Box>
  );
}
