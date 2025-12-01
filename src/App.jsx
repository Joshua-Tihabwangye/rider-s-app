import React, { useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Box, IconButton, Typography, Divider } from "@mui/material";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import { createEvzoneTheme } from "./theme";
import RA01 from "./screens/RA01";
import RA02 from "./screens/RA02";
import RA03 from "./screens/RA03";
import RA04 from "./screens/RA04";
import RA05 from "./screens/RA05";
import RA06 from "./screens/RA06";
import RA07 from "./screens/RA07";
import RA08 from "./screens/RA08";
import RA09 from "./screens/RA09";
import RA10 from "./screens/RA10";
import RA11 from "./screens/RA11";
import RA12 from "./screens/RA12";
import RA13 from "./screens/RA13";
import RA14 from "./screens/RA14";
import RA15 from "./screens/RA15";
import RA16 from "./screens/RA16";
import RA17 from "./screens/RA17";
import RA18 from "./screens/RA18";
import RA19 from "./screens/RA19";
import RA20 from "./screens/RA20";
import RA21 from "./screens/RA21";
import RA22 from "./screens/RA22";
import RA23 from "./screens/RA23";
import RA24 from "./screens/RA24";
import RA25 from "./screens/RA25";
import RA26 from "./screens/RA26";
import RA27 from "./screens/RA27";
import RA28 from "./screens/RA28";
import RA29 from "./screens/RA29";
import RA30 from "./screens/RA30";
import RA31 from "./screens/RA31";
import RA32 from "./screens/RA32";
import RA33 from "./screens/RA33";
import RA34 from "./screens/RA34";
import RA35 from "./screens/RA35";
import RA36 from "./screens/RA36";
import RA37 from "./screens/RA37";
import RA38 from "./screens/RA38";
import RA39 from "./screens/RA39";
import RA40 from "./screens/RA40";
import RA41 from "./screens/RA41";
import RA42 from "./screens/RA42";
import RA43 from "./screens/RA43";
import RA44 from "./screens/RA44";
import RA45 from "./screens/RA45";
import RA46 from "./screens/RA46";
import RA47 from "./screens/RA47";
import RA48 from "./screens/RA48";
import RA49 from "./screens/RA49";
import RA50 from "./screens/RA50";
import RA51 from "./screens/RA51";
import RA52 from "./screens/RA52";
import RA53 from "./screens/RA53";
import RA54 from "./screens/RA54";
import RA55 from "./screens/RA55";
import RA56 from "./screens/RA56";
import RA57 from "./screens/RA57";
import RA58 from "./screens/RA58";
import RA59 from "./screens/RA59";
import RA60 from "./screens/RA60";
import RA61 from "./screens/RA61";
import RA62 from "./screens/RA62";
import RA63 from "./screens/RA63";
import RA64 from "./screens/RA64";
import RA65 from "./screens/RA65";
import RA66 from "./screens/RA66";
import RA67 from "./screens/RA67";
import RA68 from "./screens/RA68";
import RA69 from "./screens/RA69";
import RA70 from "./screens/RA70";
import RA71 from "./screens/RA71";
import RA72 from "./screens/RA72";
import RA73 from "./screens/RA73";
import RA74 from "./screens/RA74";
import RA75 from "./screens/RA75";
import RA76 from "./screens/RA76";
import RA77 from "./screens/RA77";
import RA78 from "./screens/RA78";
import RA79 from "./screens/RA79";
import RA80 from "./screens/RA80";
import RA81 from "./screens/RA81";
import RA82 from "./screens/RA82";
import RA83 from "./screens/RA83";
import RA84 from "./screens/RA84";
import RA85 from "./screens/RA85";
import RA86 from "./screens/RA86";
import RA87 from "./screens/RA87";
import RA88 from "./screens/RA88";
import RA89 from "./screens/RA89";
import RA90 from "./screens/RA90";
import RA91 from "./screens/RA91";

const SCREENS = [
  { id: "RA01", label: "RA01 – Home – EVzone Super App", component: RA01 },
  { id: "RA02", label: "RA02 – Enter Destination – Main", component: RA02 },
  { id: "RA03", label: "RA03 – Daily Commutes", component: RA03 },
  { id: "RA04", label: "RA04 – Upcoming Rides", component: RA04 },
  { id: "RA05", label: "RA05 – Enter Destination – Expanded", component: RA05 },
  { id: "RA06", label: "RA06 – Pick Your Destination – Map", component: RA06 },
  { id: "RA07", label: "RA07 – Enter Destination – Simplified", component: RA07 },
  { id: "RA08", label: "RA08 – Schedule Ride – Date & Time", component: RA08 },
  { id: "RA09", label: "RA09 – Ride Later – Summary", component: RA09 },
  { id: "RA10", label: "RA10 – Switch Rider – Selector", component: RA10 },
  { id: "RA11", label: "RA11 – Switch Rider – Contact", component: RA11 },
  { id: "RA12", label: "RA12 – Switch Rider – Manual Entry", component: RA12 },
  { id: "RA13", label: "RA13 – Ride for Contact – Summary", component: RA13 },
  { id: "RA14", label: "RA14 – Select Ride Type", component: RA14 },
  { id: "RA15", label: "RA15 – Round Trip Toggle", component: RA15 },
  { id: "RA16", label: "RA16 – Round Trip Details", component: RA16 },
  { id: "RA17", label: "RA17 – Preference Selection", component: RA17 },
  { id: "RA18", label: "RA18 – Ride Preference Setup", component: RA18 },
  { id: "RA19", label: "RA19 – Driver Preferences", component: RA19 },
  { id: "RA20", label: "RA20 – Select Your Ride", component: RA20 },
  { id: "RA21", label: "RA21 – Payment Method Selection", component: RA21 },
  { id: "RA22", label: "RA22 – Searching for Driver", component: RA22 },
  { id: "RA23", label: "RA23 – Driver Assigned / On The Way", component: RA23 },
  { id: "RA24", label: "RA24 – Driver Has Arrived / Start Trip", component: RA24 },
  { id: "RA25", label: "RA25 – Trip in Progress – Basic", component: RA25 },
  { id: "RA26", label: "RA26 – Trip in Progress – With Driver", component: RA26 },
  { id: "RA27", label: "RA27 – Trip in Progress – Expanded Route", component: RA27 },
  { id: "RA28", label: "RA28 – Driver Profile During Trip", component: RA28 },
  { id: "RA29", label: "RA29 – Trip Completed – Summary", component: RA29 },
  { id: "RA30", label: "RA30 – Share Ride / Passengers", component: RA30 },
  { id: "RA31", label: "RA31 – Ride Rating & Feedback", component: RA31 },
  { id: "RA32", label: "RA32 – Ride Rating + Tip", component: RA32 },
  { id: "RA33", label: "RA33 – Ride History – Past Trips", component: RA33 },
  { id: "RA34", label: "RA34 – Ride History – Upcoming Trips", component: RA34 },
  { id: "RA35", label: "RA35 – Rate Driver & Add Tip", component: RA35 },
  { id: "RA36", label: "RA36 – Shared Passengers", component: RA36 },
  { id: "RA37", label: "RA37 – Ride Info – Completed Trip", component: RA37 },
  { id: "RA38", label: "RA38 – Enter Destination – Variant", component: RA38 },
  { id: "RA39", label: "RA39 – Enter Destination – Multiple Stops", component: RA39 },
  { id: "RA40", label: "RA40 – Maximum Stops Reached", component: RA40 },
  { id: "RA41", label: "RA41 – Add Stop – Search Overlay", component: RA41 },
  { id: "RA42", label: "RA42 – Ride Details – Pre Confirm", component: RA42 },
  { id: "RA43", label: "RA43 – Add Stop – Search Results", component: RA43 },
  { id: "RA44", label: "RA44 – Where to Today? – Alt Entry", component: RA44 },
  { id: "RA45", label: "RA45 – Enter Destination – Variant Layout", component: RA45 },
  { id: "RA46", label: "RA46 – Ride Details – Variant 2", component: RA46 },
  { id: "RA47", label: "RA47 – Ride Details – Booking Confirmation", component: RA47 },
  { id: "RA48", label: "RA48 – Ride Booking Confirmation – Thank You", component: RA48 },
  { id: "RA49", label: "RA49 – Upcoming Rides – Dedicated Screen", component: RA49 },
  { id: "RA50", label: "RA50 – Deliveries – Delivering Tab v1", component: RA50 },
  { id: "RA51", label: "RA51 – Deliveries – Received Tab v1", component: RA51 },
  { id: "RA52", label: "RA52 – Deliveries – Delivering Tab v2", component: RA52 },
  { id: "RA53", label: "RA53 – Deliveries – Received Tab v2", component: RA53 },
  { id: "RA54", label: "RA54 – Deliveries – Received Tab v3", component: RA54 },
  { id: "RA55", label: "RA55 – Shipment Tracking – Received Parcel", component: RA55 },
  { id: "RA56", label: "RA56 – Incoming Tracking Requests", component: RA56 },
  { id: "RA57", label: "RA57 – Invitations – Pending v1", component: RA57 },
  { id: "RA58", label: "RA58 – Invitations – Pending v2", component: RA58 },
  { id: "RA59", label: "RA59 – Order Delivery – Setup", component: RA59 },
  { id: "RA60", label: "RA60 – Package Tracking – En Route", component: RA60 },
  { id: "RA61", label: "RA61 – Active Delivery – With Cancel", component: RA61 },
  { id: "RA62", label: "RA62 – Active Delivery – Live Tracking", component: RA62 },
  { id: "RA63", label: "RA63 – Active Delivery – Driver Info", component: RA63 },
  { id: "RA64", label: "RA64 – Delivery Status – Timeline", component: RA64 },
  { id: "RA65", label: "RA65 – Order Delivered – Confirmation", component: RA65 },
  { id: "RA66", label: "RA66 – Pick Up Confirmed – Order Details", component: RA66 },
  { id: "RA67", label: "RA67 – Order Completion – Rating", component: RA67 },
  { id: "RA68", label: "RA68 – Order Delivery – Detailed View", component: RA68 },
  { id: "RA69", label: "RA69 – Rental Entry", component: RA69 },
  { id: "RA70", label: "RA70 – Rental Vehicle List", component: RA70 },
  { id: "RA71", label: "RA71 – Rental Vehicle Detail", component: RA71 },
  { id: "RA72", label: "RA72 – Rental Dates & Duration", component: RA72 },
  { id: "RA73", label: "RA73 – Rental Pickup/Return Branches", component: RA73 },
  { id: "RA74", label: "RA74 – Rental Summary & Payment", component: RA74 },
  { id: "RA75", label: "RA75 – Rental Booking Confirmation", component: RA75 },
  { id: "RA76", label: "RA76 – Rental Upcoming & History", component: RA76 },
  { id: "RA77", label: "RA77 – Tours – Browse", component: RA77 },
  { id: "RA78", label: "RA78 – Tours – Detail", component: RA78 },
  { id: "RA79", label: "RA79 – Tours – Date & Guests", component: RA79 },
  { id: "RA80", label: "RA80 – Tour Booking – Summary & Payment", component: RA80 },
  { id: "RA81", label: "RA81 – Tour Booking – Confirmation", component: RA81 },
  { id: "RA82", label: "RA82 – Tours – Upcoming & History", component: RA82 },
  { id: "RA83", label: "RA83 – Ambulance – Home / Request Type", component: RA83 },
  { id: "RA84", label: "RA84 – Ambulance – Location & Patient", component: RA84 },
  { id: "RA85", label: "RA85 – Ambulance – Destination Hospital", component: RA85 },
  { id: "RA86", label: "RA86 – Ambulance – Request Confirmation & ETA", component: RA86 },
  { id: "RA87", label: "RA87 – Ambulance – Live Tracking", component: RA87 },
  { id: "RA88", label: "RA88 – Ambulance – Requests History", component: RA88 },
  { id: "RA89", label: "RA89 – School – Handoff to School App", component: RA89 },
  { id: "RA90", label: "RA90 – Rental – Booking Detail", component: RA90 },
  { id: "RA91", label: "RA91 – All Orders – Combined History", component: RA91 },
];

export default function App() {
  const [mode, setMode] = useState("light");
  const theme = useMemo(() => createEvzoneTheme(mode), [mode]);

  const [activeId, setActiveId] = useState("RA01");
  const active = SCREENS.find((s) => s.id === activeId) || SCREENS[0];
  const ActiveComponent = active.component;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="min-h-screen bg-slate-900 text-slate-50 flex flex-col md:flex-row">
        <Box
          className="w-full md:w-72 border-b md:border-b-0 md:border-r border-slate-700/60"
          sx={{
            px: 2,
            py: 2.5,
            bgcolor: (t) =>
              t.palette.mode === "light"
                ? "rgba(15,23,42,0.96)"
                : "rgba(15,23,42,1)"
          }}
        >
          <Box className="flex items-center justify-between gap-2 mb-3">
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                EVzone Rider – Supervisor
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: "rgba(148,163,184,0.9)" }}
              >
                Preview RA01–RA91 mobile canvases
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={() =>
                setMode((prev) => (prev === "light" ? "dark" : "light"))
              }
              sx={{
                bgcolor: "rgba(15,23,42,0.9)",
                borderRadius: 999,
                border: "1px solid rgba(51,65,85,0.9)"
              }}
            >
              {mode === "light" ? (
                <DarkModeRoundedIcon sx={{ fontSize: 18, color: "#E5E7EB" }} />
              ) : (
                <LightModeRoundedIcon sx={{ fontSize: 18, color: "#FDE68A" }} />
              )}
            </IconButton>
          </Box>

          <Divider
            sx={{
              mb: 1.5,
              borderColor: "rgba(51,65,85,0.9)"
            }}
          />

          <Box
            sx={{
              maxHeight: "calc(100vh - 120px)",
              overflowY: "auto",
              pr: 0.5
            }}
          >
            {SCREENS.map((screen) => (
              <Box
                key={screen.id}
                onClick={() => setActiveId(screen.id)}
                sx={{
                  px: 1.25,
                  py: 0.65,
                  mb: 0.5,
                  borderRadius: 999,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  bgcolor:
                    activeId === screen.id
                      ? "rgba(3,205,140,0.16)"
                      : "transparent",
                  "&:hover": {
                    bgcolor:
                      activeId === screen.id
                        ? "rgba(3,205,140,0.2)"
                        : "rgba(15,23,42,0.85)"
                  }
                }}
              >
                <Box sx={{ mr: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "rgba(249,250,251,0.98)"
                    }}
                  >
                    {screen.id}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: 10,
                      color: "rgba(148,163,184,0.95)",
                      display: "block"
                    }}
                  >
                    {screen.label.replace(screen.id + " – ", "")}
                  </Typography>
                </Box>
                {activeId === screen.id && (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: 999,
                      bgcolor: "#22C55E"
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>
        </Box>

        <Box className="flex-1 flex justify-center items-stretch px-2 md:px-6 py-4 md:py-6">
          <ActiveComponent />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
