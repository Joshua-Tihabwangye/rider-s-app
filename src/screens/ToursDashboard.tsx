import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, Card, CardContent, Stack, Chip, Button, TextField,
  InputAdornment, IconButton, Skeleton, Divider, Select, MenuItem,
  FormControl, Snackbar, Alert
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import ElectricBoltRoundedIcon from "@mui/icons-material/ElectricBoltRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import AddLocationAltRoundedIcon from "@mui/icons-material/AddLocationAltRounded";
import SentimentDissatisfiedRoundedIcon from "@mui/icons-material/SentimentDissatisfiedRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import MobileShell from "../components/MobileShell";
import DarkModeToggle from "../components/DarkModeToggle";
import {
  Tour, MOCK_BOOKINGS, CATEGORY_LABELS, formatUGX, getGradientForTour,
  fetchTours
} from "../data/tours";

// ── Color constants ───────────────────────────────────────
const G = "#03CD8C";
const G2 = "#22C55E";


/* ═══════════════════════════════════════════════════════════
   Tour Card Component
   ═══════════════════════════════════════════════════════════ */
interface TourCardProps {
  tour: Tour;
  wishlisted: boolean;
  onToggleWishlist: (slug: string) => void;
}

function TourCard({ tour, wishlisted, onToggleWishlist }: TourCardProps) {
  const navigate = useNavigate();
  const gradient = getGradientForTour(tour.slug);

  const availBadge = tour.availability === "sold_out"
    ? { label: "Sold out", color: "#EF4444", bg: "rgba(239,68,68,0.15)" }
    : tour.availability === "few_spots"
      ? { label: "Few spots left", color: "#F59E0B", bg: "rgba(245,158,11,0.15)" }
      : { label: "Available", color: G, bg: "rgba(3,205,140,0.12)" };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: t => t.palette.mode === "light" ? "#fff" : "rgba(15,23,42,0.98)",
        border: t => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.7)",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        "&:hover": { transform: "translateY(-2px)", boxShadow: "0 8px 30px rgba(0,0,0,0.25)" }
      }}
    >
      {/* Image */}
      <Box
        onClick={() => navigate(`/tours/${tour.slug}`)}
        sx={{
          height: 180, background: gradient, position: "relative", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}
      >
        <Typography sx={{ color: "rgba(255,255,255,0.3)", fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>
          {tour.destination.charAt(0)}
        </Typography>

        {/* Wishlist */}
        <IconButton
          onClick={e => { e.stopPropagation(); onToggleWishlist(tour.slug); }}
          sx={{
            position: "absolute", top: 10, right: 10, bgcolor: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)", "&:hover": { bgcolor: "rgba(0,0,0,0.6)" }
          }}
          size="small"
        >
          {wishlisted
            ? <FavoriteRoundedIcon sx={{ fontSize: 18, color: "#EF4444" }} />
            : <FavoriteBorderRoundedIcon sx={{ fontSize: 18, color: "#fff" }} />}
        </IconButton>

        {/* Availability badge */}
        <Chip
          label={availBadge.label} size="small"
          sx={{
            position: "absolute", bottom: 10, left: 10,
            bgcolor: availBadge.bg, color: availBadge.color,
            fontSize: 10, height: 22, fontWeight: 600, borderRadius: 999,
            backdropFilter: "blur(4px)"
          }}
        />

        {/* EV badge */}
        {tour.evPowered && (
          <Chip
            icon={<ElectricBoltRoundedIcon sx={{ fontSize: 12, color: `${G} !important` }} />}
            label="EV" size="small"
            sx={{
              position: "absolute", bottom: 10, right: 10,
              bgcolor: "rgba(3,205,140,0.15)", color: G,
              fontSize: 10, height: 22, fontWeight: 600, borderRadius: 999,
              backdropFilter: "blur(4px)"
            }}
          />
        )}

        {/* Discount badge */}
        {tour.originalPrice && (
          <Chip
            label={`-${Math.round((1 - tour.pricePerPerson / tour.originalPrice) * 100)}%`}
            size="small"
            sx={{
              position: "absolute", top: 10, left: 10,
              bgcolor: "#EF4444", color: "#fff",
              fontSize: 10, height: 22, fontWeight: 700, borderRadius: 999
            }}
          />
        )}
      </Box>

      {/* Content */}
      <CardContent sx={{ px: 1.8, py: 1.5 }}>
        <Typography
          variant="subtitle2"
          onClick={() => navigate(`/tours/${tour.slug}`)}
          sx={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.01em", cursor: "pointer", mb: 0.3, "&:hover": { color: G } }}
        >
          {tour.title}
        </Typography>

        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.5 }}>
          <PlaceRoundedIcon sx={{ fontSize: 13, color: t => t.palette.text.secondary }} />
          <Typography variant="caption" sx={{ fontSize: 11, color: t => t.palette.text.secondary }}>
            {tour.destination}
          </Typography>
        </Stack>

        {/* 2 lines of details */}
        <Typography variant="caption" sx={{
          fontSize: 11.5, color: t => t.palette.text.secondary, lineHeight: 1.5, mb: 0.8,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
        }}>
          {tour.subtitle || tour.description}
        </Typography>

        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.8 }}>
          <Stack direction="row" spacing={0.3} alignItems="center">
            <AccessTimeRoundedIcon sx={{ fontSize: 13, color: t => t.palette.text.secondary }} />
            <Typography variant="caption" sx={{ fontSize: 11, color: t => t.palette.text.secondary }}>
              {tour.duration}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.3} alignItems="center">
            <StarRoundedIcon sx={{ fontSize: 13, color: "#F59E0B" }} />
            <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600 }}>
              {tour.rating > 0 ? tour.rating : "New"}
            </Typography>
            {tour.reviewCount > 0 && (
              <Typography variant="caption" sx={{ fontSize: 10, color: t => t.palette.text.secondary }}>
                ({tour.reviewCount})
              </Typography>
            )}
          </Stack>
        </Stack>

        {/* Price */}
        <Stack direction="row" spacing={0.75} alignItems="baseline" sx={{ mb: 1.2 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 15, color: G }}>
            {formatUGX(tour.pricePerPerson)}
          </Typography>
          {tour.originalPrice && (
            <Typography variant="caption" sx={{ fontSize: 11, textDecoration: "line-through", color: t => t.palette.text.secondary }}>
              {formatUGX(tour.originalPrice)}
            </Typography>
          )}
          <Typography variant="caption" sx={{ fontSize: 10.5, color: t => t.palette.text.secondary }}>
            / person
          </Typography>
        </Stack>

        {/* CTAs */}
        <Stack direction="row" spacing={1}>
          <Button
            fullWidth variant="contained" size="small"
            onClick={() => navigate(`/tours/${tour.slug}`)}
            sx={{
              bgcolor: G, color: "#020617", borderRadius: 999, py: 0.7, fontSize: 12, fontWeight: 600,
              textTransform: "none", "&:hover": { bgcolor: G2 }
            }}
          >
            View details
          </Button>
          <Button
            fullWidth variant="outlined" size="small"
            disabled={tour.availability === "sold_out"}
            onClick={() => navigate(`/tours/${tour.slug}/book`)}
            sx={{
              borderRadius: 999, py: 0.7, fontSize: 12, fontWeight: 600, textTransform: "none",
              borderColor: G, color: G, "&:hover": { borderColor: G2, bgcolor: "rgba(3,205,140,0.08)" }
            }}
          >
            Book now
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════
   Skeleton Card (loading)
   ═══════════════════════════════════════════════════════════ */
function TourCardSkeleton() {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3, overflow: "hidden",
        bgcolor: t => t.palette.mode === "light" ? "#fff" : "rgba(15,23,42,0.98)",
        border: t => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.5)" : "1px solid rgba(51,65,85,0.5)"
      }}
    >
      <Skeleton variant="rectangular" height={180} animation="wave" />
      <CardContent sx={{ px: 1.8, py: 1.5 }}>
        <Skeleton variant="text" width="80%" height={22} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="40%" height={16} sx={{ mb: 0.3 }} />
        <Skeleton variant="text" width="60%" height={16} sx={{ mb: 0.8 }} />
        <Skeleton variant="text" width="45%" height={20} sx={{ mb: 1 }} />
        <Stack direction="row" spacing={1}>
          <Skeleton variant="rounded" width="50%" height={32} sx={{ borderRadius: 999 }} />
          <Skeleton variant="rounded" width="50%" height={32} sx={{ borderRadius: 999 }} />
        </Stack>
      </CardContent>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main Tours Browse Screen
   ═══════════════════════════════════════════════════════════ */
function ToursBrowseScreen() {
  const navigate = useNavigate();

  // Data states
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Search & filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  // Load tours
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    fetchTours()
      .then(data => { if (!cancelled) { setTours(data); setLoading(false); } })
      .catch(() => { if (!cancelled) { setError(true); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  // Filter + sort
  const filtered = useCallback(() => {
    let result = [...tours];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.destination.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    }

    // Category
    if (category !== "all") {
      result = result.filter(t => t.category === category);
    }

    // Default sort: featured first, then by rating
    result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating);

    return result;
  }, [tours, search, category]);

  const filteredTours = filtered();
  const upcomingBookings = MOCK_BOOKINGS.filter(b => b.status === "upcoming" || b.status === "confirmed");

  const toggleWishlist = (slug: string) => {
    setWishlist(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
    setToast(wishlist.includes(slug) ? "Removed from wishlist" : "Added to wishlist ♥");
  };

  return (
    <Box>
      {/* Green Header */}
      <Box sx={{ 
        bgcolor: "#03CD8C", 
        px: 2, 
        pt: 2.5, 
        pb: 2.5, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        position: "relative",
        minHeight: 80
      }}>
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
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: 20, lineHeight: 1.2, color: "#FFFFFF" }}>
            Tours & Experiences
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 13, color: "rgba(255,255,255,0.9)", mt: 0.5 }}>
            Discover EV-powered tours across Uganda
          </Typography>
        </Box>
      </Box>

      {/* Search bar */}
        <TextField
          fullWidth size="small" placeholder="Search tours, destinations..."
          value={search} onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchRoundedIcon sx={{ fontSize: 20, color: t => t.palette.text.secondary }} /></InputAdornment>
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 999,
              bgcolor: "#FFFFFF",
              "& fieldset": { borderColor: "rgba(209,213,219,0.9)" },
              "&:hover fieldset": { borderColor: G },
              "&.Mui-focused fieldset": { borderColor: G }
            },
            mt: 1.5,
            px: 2
          }}
        />

      <Box sx={{ px: 2, pt: 2, pb: 3 }}>

      {/* ── Tour count + Category dropdown (same line) ── */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="caption" sx={{ fontSize: 12, color: t => t.palette.text.secondary, fontWeight: 500 }}>
          {loading ? "Loading..." : `${filteredTours.length} tour${filteredTours.length !== 1 ? "s" : ""} found`}
        </Typography>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            value={category}
            onChange={e => setCategory(e.target.value)}
            displayEmpty
            sx={{
              borderRadius: 2, fontSize: 12, fontWeight: 600, height: 34,
              "& .MuiSelect-select": { py: 0.6, display: "flex", alignItems: "center", gap: 0.75 },
              "& fieldset": { borderColor: t => t.palette.divider },
              "&:hover fieldset": { borderColor: `${G} !important` },
              "&.Mui-focused fieldset": { borderColor: `${G} !important` }
            }}
          >
            <MenuItem value="all" sx={{ fontSize: 12, fontWeight: 600 }}>All categories</MenuItem>
            {(Object.keys(CATEGORY_LABELS) as Array<Tour["category"]>).map(cat => (
              <MenuItem key={cat} value={cat} sx={{ fontSize: 12 }}>{CATEGORY_LABELS[cat]}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* ── Add custom destination CTA ─────────────────── */}
      <Card
        elevation={0}
        onClick={() => navigate("/tours/custom")}
        sx={{
          mb: 2.5, borderRadius: 2.5, overflow: "hidden", cursor: "pointer",
          background: t => t.palette.mode === "light"
            ? "linear-gradient(135deg, rgba(3,205,140,0.08) 0%, #fff 100%)"
            : "linear-gradient(135deg, rgba(3,205,140,0.1) 0%, rgba(15,23,42,0.98) 100%)",
          border: `1.5px dashed ${G}`,
          transition: "all 0.2s ease",
          "&:hover": { borderColor: G2, transform: "translateY(-1px)", boxShadow: "0 4px 20px rgba(3,205,140,0.15)" }
        }}
      >
        <CardContent sx={{ px: 2, py: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{
            width: 48, height: 48, borderRadius: "50%",
            bgcolor: "rgba(3,205,140,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
          }}>
            <AddLocationAltRoundedIcon sx={{ fontSize: 24, color: G }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 14 }}>
              Add a custom destination
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11, color: t => t.palette.text.secondary, lineHeight: 1.5 }}>
              Enter any place → see it on the map → get an instant price based on distance
            </Typography>
          </Box>
          <ArrowForwardIosRoundedIcon sx={{ fontSize: 16, color: G, flexShrink: 0 }} />
        </CardContent>
      </Card>

      {/* ── Upcoming bookings (if any) ─────────────────── */}
      {upcomingBookings.length > 0 && (
        <Card
          elevation={0}
          sx={{
            mb: 2.5, borderRadius: 2.5, overflow: "hidden",
            bgcolor: t => t.palette.mode === "light" ? "#fff" : "rgba(15,23,42,0.98)",
            border: t => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.7)"
          }}
        >
          <CardContent sx={{ px: 1.8, py: 1.5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: t => t.palette.text.secondary }}>
                Your upcoming tours
              </Typography>
              <Typography variant="caption" onClick={() => navigate("/bookings")}
                sx={{ fontSize: 11, color: G, cursor: "pointer", fontWeight: 600, "&:hover": { textDecoration: "underline" } }}>
                View all
              </Typography>
            </Stack>
            {upcomingBookings.slice(0, 2).map(b => (
              <Box key={b.id} onClick={() => navigate(`/bookings/${b.id}`)}
                sx={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", py: 0.8,
                  cursor: "pointer", borderRadius: 1, "&:hover": { bgcolor: t => t.palette.action.hover },
                  "&:not(:last-child)": { borderBottom: t => `1px dashed ${t.palette.divider}` }
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontSize: 12.5, fontWeight: 600 }}>{b.tourTitle}</Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <CalendarMonthRoundedIcon sx={{ fontSize: 13, color: t => t.palette.text.secondary }} />
                    <Typography variant="caption" sx={{ fontSize: 10.5, color: t => t.palette.text.secondary }}>
                      {b.date} • {b.timeSlot}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <GroupRoundedIcon sx={{ fontSize: 13, color: t => t.palette.text.secondary }} />
                    <Typography variant="caption" sx={{ fontSize: 10.5, color: t => t.palette.text.secondary }}>
                      {b.adults} adult{b.adults !== 1 ? "s" : ""}{b.children > 0 ? `, ${b.children} child${b.children !== 1 ? "ren" : ""}` : ""}
                    </Typography>
                  </Stack>
                </Box>
                <Stack alignItems="flex-end" spacing={0.3}>
                  <Chip label={b.status.charAt(0).toUpperCase() + b.status.slice(1)} size="small"
                    sx={{ borderRadius: 999, fontSize: 9, height: 20, fontWeight: 600, bgcolor: "rgba(3,205,140,0.12)", color: G }} />
                  <ArrowForwardIosRoundedIcon sx={{ fontSize: 12, color: t => t.palette.text.secondary }} />
                </Stack>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ── Tour cards ─────────────────────────────────── */}
      {loading ? (
        <Stack spacing={2}>
          {[0, 1, 2].map(i => <TourCardSkeleton key={i} />)}
        </Stack>
      ) : error ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <ErrorOutlineRoundedIcon sx={{ fontSize: 48, color: "#EF4444", mb: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>Something went wrong</Typography>
          <Typography variant="body2" sx={{ color: t => t.palette.text.secondary, mb: 2, fontSize: 13 }}>
            Failed to load tours. Please try again.
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}
            sx={{ borderRadius: 999, bgcolor: G, color: "#020617", textTransform: "none", "&:hover": { bgcolor: G2 } }}>
            Retry
          </Button>
        </Box>
      ) : filteredTours.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <SentimentDissatisfiedRoundedIcon sx={{ fontSize: 48, color: t => t.palette.text.secondary, mb: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>No tours found</Typography>
          <Typography variant="body2" sx={{ color: t => t.palette.text.secondary, mb: 2, fontSize: 13 }}>
            Try adjusting your search or category.
          </Typography>
          <Button variant="outlined" onClick={() => { setCategory("all"); setSearch(""); }}
            sx={{ borderRadius: 999, textTransform: "none", borderColor: G, color: G }}>
            Clear filters
          </Button>
        </Box>
      ) : (
        <Stack spacing={2}>
          {filteredTours.map(t => (
            <TourCard key={t.slug} tour={t} wishlisted={wishlist.includes(t.slug)} onToggleWishlist={toggleWishlist} />
          ))}
        </Stack>
      )}

      {/* ── Trust badges ───────────────────────────────── */}
      <Stack direction="row" justifyContent="center" spacing={2.5} sx={{ mt: 2.5 }}>
        <Stack alignItems="center" spacing={0.25}>
          <VerifiedRoundedIcon sx={{ fontSize: 20, color: G }} />
          <Typography variant="caption" sx={{ fontSize: 9, color: t => t.palette.text.secondary }}>Verified operators</Typography>
        </Stack>
        <Stack alignItems="center" spacing={0.25}>
          <ElectricBoltRoundedIcon sx={{ fontSize: 20, color: G }} />
          <Typography variant="caption" sx={{ fontSize: 9, color: t => t.palette.text.secondary }}>EV-powered</Typography>
        </Stack>
        <Divider orientation="vertical" flexItem />
        <Stack alignItems="center" spacing={0.25}>
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: G }}>4.7★</Typography>
          <Typography variant="caption" sx={{ fontSize: 9, color: t => t.palette.text.secondary }}>Avg. rating</Typography>
        </Stack>
      </Stack>

      {/* ── Snackbar ───────────────────────────────────── */}
      <Snackbar open={!!toast} autoHideDuration={2000} onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success" variant="filled" sx={{ bgcolor: G, color: "#020617", fontWeight: 600 }}>
          {toast}
        </Alert>
      </Snackbar>
      </Box>
    </Box>
  );
}

/* ═══════════════════════════════════════════════════════════
   Export
   ═══════════════════════════════════════════════════════════ */
export default function ToursDashboard() {
  return (
    <>
      <DarkModeToggle />
      <MobileShell>
        <ToursBrowseScreen />
      </MobileShell>
    </>
  );
}
