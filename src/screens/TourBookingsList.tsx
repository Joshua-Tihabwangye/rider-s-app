import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, Card, CardContent, Stack, Chip, Button, IconButton,
  Skeleton, Divider, TextField, InputAdornment, Collapse
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import SentimentDissatisfiedRoundedIcon from "@mui/icons-material/SentimentDissatisfiedRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import MobileShell from "../components/MobileShell";
import DarkModeToggle from "../components/DarkModeToggle";
import { Booking, BookingStatus, fetchBookings, formatUGX, getGradientForTour } from "../data/tours";

const G = "#03CD8C";

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; bg: string }> = {
  confirmed: { label: "Confirmed", color: G, bg: "rgba(3,205,140,0.12)" },
  upcoming: { label: "Upcoming", color: "#3B82F6", bg: "rgba(59,130,246,0.12)" },
  completed: { label: "Completed", color: "#6B7280", bg: "rgba(107,114,128,0.12)" },
  cancelled: { label: "Cancelled", color: "#EF4444", bg: "rgba(239,68,68,0.12)" }
};

type TabType = "upcoming" | "past" | "cancelled";

/* ═══════════════════════════════════════════════════════════
   Bookings List Screen
   ═══════════════════════════════════════════════════════════ */
function BookingsListScreen() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabType>("upcoming");
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    let c = false;
    fetchBookings().then(data => { if (!c) { setBookings(data); setLoading(false); } });
    return () => { c = true; };
  }, []);

  // Filter by tab
  const tabFiltered = bookings.filter(b => {
    if (tab === "upcoming") return b.status === "upcoming" || b.status === "confirmed";
    if (tab === "past") return b.status === "completed";
    return b.status === "cancelled";
  });

  // Then filter by search
  const filtered = useMemo(() => {
    if (!search.trim()) return tabFiltered;
    const q = search.toLowerCase();
    return tabFiltered.filter(b =>
      b.tourTitle.toLowerCase().includes(q) ||
      b.destination.toLowerCase().includes(q) ||
      b.bookingRef.toLowerCase().includes(q) ||
      b.contactName.toLowerCase().includes(q)
    );
  }, [tabFiltered, search]);

  // Search suggestions (show matching bookings across ALL tabs)
  const suggestions = useMemo(() => {
    if (!search.trim() || search.trim().length < 2) return [];
    const q = search.toLowerCase();
    return bookings
      .filter(b =>
        b.tourTitle.toLowerCase().includes(q) ||
        b.destination.toLowerCase().includes(q) ||
        b.bookingRef.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [bookings, search]);

  const tabCounts = {
    upcoming: bookings.filter(b => b.status === "upcoming" || b.status === "confirmed").length,
    past: bookings.filter(b => b.status === "completed").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length
  };

  return (
    <Box>
      {/* Green Header */}
      <Box sx={{ bgcolor: "#03CD8C", px: 7, pt: 2, pb: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton onClick={() => navigate("/tours")} size="small"
            sx={{
              borderRadius: 999,
              bgcolor: "rgba(255,255,255,0.2)",
              color: "#FFFFFF",
              "&:hover": { bgcolor: "rgba(255,255,255,0.3)" }
            }}>
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: 20, letterSpacing: "-0.02em", color: "#FFFFFF" }}>
              My Bookings
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11, color: "rgba(255,255,255,0.85)" }}>
              {bookings.length} total booking{bookings.length !== 1 ? "s" : ""}
            </Typography>
          </Box>
        </Stack>
      </Box>

    <Box sx={{ px: 2, pt: 2, pb: 3 }}>

      {/* Search bar */}
      <Box sx={{ position: "relative", mb: 2 }}>
        <TextField
          fullWidth size="small"
          placeholder="Search by tour name, destination, or ref..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchRoundedIcon sx={{ fontSize: 20, color: t => t.palette.text.secondary }} /></InputAdornment>
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 999, fontSize: 13,
              bgcolor: t => t.palette.mode === "light" ? "#fff" : "rgba(15,23,42,0.96)",
              "& fieldset": { borderColor: t => t.palette.mode === "light" ? "rgba(209,213,219,0.9)" : "rgba(51,65,85,0.9)" },
              "&:hover fieldset": { borderColor: G },
              "&.Mui-focused fieldset": { borderColor: G }
            }
          }}
        />

        {/* Live suggestions dropdown */}
        <Collapse in={searchFocused && suggestions.length > 0}>
          <Box sx={{
            position: "absolute", top: "100%", left: 0, right: 0, mt: 0.5, zIndex: 20,
            borderRadius: 2, overflow: "hidden",
            bgcolor: t => t.palette.mode === "light" ? "#fff" : "rgba(15,23,42,0.98)",
            border: t => `1px solid ${t.palette.mode === "light" ? "rgba(209,213,219,0.9)" : "rgba(51,65,85,0.7)"}`,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)"
          }}>
            {suggestions.map(s => {
              const sConf = STATUS_CONFIG[s.status];
              return (
                <Box key={s.id}
                  onClick={() => { setSearch(""); navigate(`/bookings/${s.id}`); }}
                  sx={{
                    px: 1.5, py: 1, cursor: "pointer", display: "flex", alignItems: "center", gap: 1,
                    borderBottom: t => `1px solid ${t.palette.divider}`,
                    "&:hover": { bgcolor: "rgba(3,205,140,0.06)" },
                    "&:last-child": { borderBottom: "none" }
                  }}
                >
                  <Box sx={{
                    width: 36, height: 36, borderRadius: 1.5, flexShrink: 0,
                    background: getGradientForTour(s.tourSlug),
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <Typography sx={{ color: "rgba(255,255,255,0.3)", fontSize: 14, fontWeight: 800 }}>
                      {s.destination.charAt(0)}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {s.tourTitle}
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: 10, color: t => t.palette.text.secondary }}>
                      {s.bookingRef} • {s.destination}
                    </Typography>
                  </Box>
                  <Chip label={sConf.label} size="small"
                    sx={{ borderRadius: 999, fontSize: 8, height: 18, fontWeight: 600, bgcolor: sConf.bg, color: sConf.color, flexShrink: 0 }} />
                </Box>
              );
            })}
          </Box>
        </Collapse>
      </Box>

      {/* Tabs */}
      <Stack direction="row" spacing={0.75} sx={{ mb: 2.5 }}>
        {(["upcoming", "past", "cancelled"] as TabType[]).map(t => (
          <Chip
            key={t} size="small"
            label={`${t.charAt(0).toUpperCase() + t.slice(1)} (${tabCounts[t]})`}
            onClick={() => setTab(t)}
            sx={{
              borderRadius: 999, fontSize: 11, fontWeight: 600,
              bgcolor: tab === t ? G : undefined,
              color: tab === t ? "#020617" : undefined
            }}
          />
        ))}
      </Stack>

      {/* Booking cards */}
      {loading ? (
        <Stack spacing={1.5}>
          {[0, 1, 2].map(i => (
            <Skeleton key={i} variant="rounded" height={130} sx={{ borderRadius: 2.5 }} animation="wave" />
          ))}
        </Stack>
      ) : filtered.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <SentimentDissatisfiedRoundedIcon sx={{ fontSize: 48, color: t => t.palette.text.secondary, mb: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>No bookings here</Typography>
          <Typography variant="body2" sx={{ fontSize: 13, color: t => t.palette.text.secondary, mb: 2 }}>
            {tab === "upcoming" ? "You don't have any upcoming tours." : tab === "past" ? "No past tours yet." : "No cancelled bookings."}
          </Typography>
          {tab === "upcoming" && (
            <Button variant="contained" onClick={() => navigate("/tours")}
              sx={{ borderRadius: 999, bgcolor: G, color: "#020617", textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: "#22C55E" } }}>
              Browse tours
            </Button>
          )}
        </Box>
      ) : (
        <Stack spacing={1.5}>
          {filtered.map(booking => {
            const statusConf = STATUS_CONFIG[booking.status];
            return (
              <Card key={booking.id} elevation={0}
                onClick={() => navigate(`/bookings/${booking.id}`)}
                sx={{
                  borderRadius: 2.5, cursor: "pointer", overflow: "hidden",
                  bgcolor: t => t.palette.mode === "light" ? "#fff" : "rgba(15,23,42,0.98)",
                  border: t => `1px solid ${t.palette.mode === "light" ? "rgba(209,213,219,0.9)" : "rgba(51,65,85,0.7)"}`,
                  transition: "transform 0.15s, box-shadow 0.15s",
                  "&:hover": { transform: "translateY(-1px)", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }
                }}
              >
                <CardContent sx={{ px: 1.8, py: 1.5 }}>
                  <Stack direction="row" spacing={1.2} alignItems="center">
                    {/* Mini image */}
                    <Box sx={{
                      width: 52, height: 52, borderRadius: 2, flexShrink: 0,
                      background: getGradientForTour(booking.tourSlug),
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <Typography sx={{ color: "rgba(255,255,255,0.3)", fontSize: 20, fontWeight: 800 }}>
                        {booking.destination.charAt(0)}
                      </Typography>
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 13, mb: 0.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                          {booking.tourTitle}
                        </Typography>
                        <Chip label={statusConf.label} size="small"
                          sx={{ borderRadius: 999, fontSize: 9, height: 20, fontWeight: 600, bgcolor: statusConf.bg, color: statusConf.color, ml: 0.5, flexShrink: 0 }} />
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.3 }}>
                        <Stack direction="row" spacing={0.3} alignItems="center">
                          <PlaceRoundedIcon sx={{ fontSize: 12, color: t => t.palette.text.secondary }} />
                          <Typography variant="caption" sx={{ fontSize: 10, color: t => t.palette.text.secondary }}>{booking.destination}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.3} alignItems="center">
                          <GroupRoundedIcon sx={{ fontSize: 12, color: t => t.palette.text.secondary }} />
                          <Typography variant="caption" sx={{ fontSize: 10, color: t => t.palette.text.secondary }}>
                            {booking.adults + booking.children} guest{booking.adults + booking.children !== 1 ? "s" : ""}
                          </Typography>
                        </Stack>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={0.3} alignItems="center">
                          <CalendarMonthRoundedIcon sx={{ fontSize: 12, color: t => t.palette.text.secondary }} />
                          <Typography variant="caption" sx={{ fontSize: 10, color: t => t.palette.text.secondary }}>
                            {new Date(booking.date).toLocaleDateString("en", { weekday: "short", day: "numeric", month: "short" })} • {booking.timeSlot}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700, color: G }}>
                            {formatUGX(booking.totalCost)}
                          </Typography>
                          <ArrowForwardIosRoundedIcon sx={{ fontSize: 12, color: t => t.palette.text.secondary }} />
                        </Stack>
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}
      </Box>
    </Box>
  );
}

/* ═══════════════════════════════════════════════════════════
   Export
   ═══════════════════════════════════════════════════════════ */
export default function TourBookingsList() {
  return (
    <>
      <DarkModeToggle />
      <MobileShell>
        <BookingsListScreen />
      </MobileShell>
    </>
  );
}
