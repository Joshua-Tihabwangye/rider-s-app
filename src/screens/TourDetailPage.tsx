import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Typography, Card, CardContent, Stack, Chip, Button, IconButton,
  Skeleton, Divider, Rating, Accordion, AccordionSummary, AccordionDetails,
  LinearProgress
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import ElectricBoltRoundedIcon from "@mui/icons-material/ElectricBoltRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ThumbUpAltRoundedIcon from "@mui/icons-material/ThumbUpAltRounded";
import MobileShell from "../components/MobileShell";
import DarkModeToggle from "../components/DarkModeToggle";
import {
  Tour, Review, fetchTourBySlug, fetchReviewsForTour,
  formatUGX, getGradientForTour, getRatingDistribution, TOURS
} from "../data/tours";

const G = "#03CD8C";
const G2 = "#22C55E";

/* ═══════════════════════════════════════════════════════════
   Tour Detail Screen
   ═══════════════════════════════════════════════════════════ */
function TourDetailScreen() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [tour, setTour] = useState<Tour | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);
  const [imageIdx, setImageIdx] = useState(0);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    Promise.all([fetchTourBySlug(slug), fetchReviewsForTour(slug)])
      .then(([t, r]) => {
        if (!cancelled) {
          setTour(t);
          setReviews(r);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) return <TourDetailSkeleton />;
  if (!tour) return (
    <Box sx={{ mx: 7, px: 2.5, pt: 4, textAlign: "center" }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Tour not found</Typography>
      <Typography variant="body2" sx={{ color: t => t.palette.text.secondary, mb: 2 }}>
        The tour you&apos;re looking for doesn&apos;t exist or has been removed.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/tours")}
        sx={{ borderRadius: 999, bgcolor: G, color: "#020617", textTransform: "none", "&:hover": { bgcolor: G2 } }}>
        Browse tours
      </Button>
    </Box>
  );

  const gradient = getGradientForTour(tour.slug);
  const ratingDist = getRatingDistribution(reviews);
  const maxDistCount = Math.max(...ratingDist, 1);
  const similarTours = TOURS.filter(t => tour.similarTourSlugs.includes(t.slug));

  return (
    <Box sx={{ pb: 10 }}>
      <Box sx={{ bgcolor: "#03CD8C", px: 2, pt: 2, pb: 2, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
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
        <Typography
          variant="subtitle1"
          sx={{ mx: 7, fontWeight: 600, letterSpacing: "-0.01em", color: "#FFFFFF", textAlign: "center", px: 6 }}
        >
          {tour.title}
        </Typography>
        <Stack direction="row" spacing={0.5} sx={{ position: "absolute", right: 20 }}>
          <IconButton onClick={() => setWishlisted(!wishlisted)} size="small"
            sx={{ color: wishlisted ? "#EF4444" : "#FFFFFF" }}>
            {wishlisted ? <FavoriteRoundedIcon sx={{ fontSize: 18 }} /> : <FavoriteBorderRoundedIcon sx={{ fontSize: 18 }} />}
          </IconButton>
          <IconButton size="small" sx={{ color: "#FFFFFF" }}>
            <ShareRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>
      </Box>

      {/* ── Image gallery ──────────────────────────────── */}
      <Box sx={{ position: "relative", height: 200, background: gradient, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography sx={{ color: "rgba(255,255,255,0.2)", fontSize: 64, fontWeight: 900 }}>
          {tour.destination.charAt(0)}
        </Typography>

        {/* Image navigation */}
        {tour.images.length > 1 && (
          <>
            <IconButton
              onClick={() => setImageIdx(p => (p - 1 + tour.images.length) % tour.images.length)}
              sx={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(0,0,0,0.3)", "&:hover": { bgcolor: "rgba(0,0,0,0.5)" } }}
              size="small"
            >
              <ChevronLeftRoundedIcon sx={{ fontSize: 20, color: "#fff" }} />
            </IconButton>
            <IconButton
              onClick={() => setImageIdx(p => (p + 1) % tour.images.length)}
              sx={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(0,0,0,0.3)", "&:hover": { bgcolor: "rgba(0,0,0,0.5)" } }}
              size="small"
            >
              <ChevronRightRoundedIcon sx={{ fontSize: 20, color: "#fff" }} />
            </IconButton>
          </>
        )}

        {/* Image dots */}
        <Stack direction="row" spacing={0.5} sx={{ position: "absolute", bottom: 12 }}>
          {tour.images.map((_, i) => (
            <Box key={i} onClick={() => setImageIdx(i)}
              sx={{
                width: imageIdx === i ? 20 : 6, height: 6, borderRadius: 999,
                bgcolor: imageIdx === i ? "#fff" : "rgba(255,255,255,0.5)",
                cursor: "pointer", transition: "all 0.2s ease"
              }}
            />
          ))}
        </Stack>

        {/* Badges on image */}
        <Stack direction="row" spacing={0.75} sx={{ position: "absolute", bottom: 12, left: 12 }}>
          {tour.evPowered && (
            <Chip
              icon={<ElectricBoltRoundedIcon sx={{ fontSize: 12, color: `${G} !important` }} />}
              label="EV Powered" size="small"
              sx={{ bgcolor: "rgba(3,205,140,0.15)", color: G, fontSize: 10, height: 22, fontWeight: 600, borderRadius: 999, backdropFilter: "blur(4px)" }}
            />
          )}
        </Stack>
      </Box>

      {/* ── Content ────────────────────────────────────── */}
      <Box sx={{ px: 2, pt: 2 }}>
        {/* Title & core info */}
        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: 20, letterSpacing: "-0.02em", lineHeight: 1.3, mb: 0.5 }}>
          {tour.title}
        </Typography>

        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.5 }}>
          <PlaceRoundedIcon sx={{ fontSize: 14, color: t => t.palette.text.secondary }} />
          <Typography variant="body2" sx={{ fontSize: 13, color: t => t.palette.text.secondary }}>
            {tour.destination}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
          <Stack direction="row" spacing={0.3} alignItems="center">
            <StarRoundedIcon sx={{ fontSize: 16, color: "#F59E0B" }} />
            <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 13 }}>{tour.rating}</Typography>
            <Typography variant="caption" sx={{ fontSize: 11, color: t => t.palette.text.secondary }}>({tour.reviewCount} reviews)</Typography>
          </Stack>
          <Stack direction="row" spacing={0.3} alignItems="center">
            <AccessTimeRoundedIcon sx={{ fontSize: 14, color: t => t.palette.text.secondary }} />
            <Typography variant="caption" sx={{ fontSize: 11, color: t => t.palette.text.secondary }}>{tour.duration}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.3} alignItems="center">
            <GroupRoundedIcon sx={{ fontSize: 14, color: t => t.palette.text.secondary }} />
            <Typography variant="caption" sx={{ fontSize: 11, color: t => t.palette.text.secondary }}>Max {tour.maxGroupSize}</Typography>
          </Stack>
        </Stack>

        {/* Highlights */}
        <Card elevation={0} sx={{ borderRadius: 2.5, mb: 2, bgcolor: t => t.palette.mode === "light" ? "rgba(3,205,140,0.04)" : "rgba(3,205,140,0.06)", border: `1px solid rgba(3,205,140,0.15)` }}>
          <CardContent sx={{ px: 1.8, py: 1.5 }}>
            <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: G, mb: 0.8, display: "block" }}>
              Highlights
            </Typography>
            {tour.highlights.map((h, i) => (
              <Stack key={i} direction="row" spacing={0.75} alignItems="flex-start" sx={{ mb: 0.4 }}>
                <CheckCircleRoundedIcon sx={{ fontSize: 14, color: G, mt: 0.2, flexShrink: 0 }} />
                <Typography variant="body2" sx={{ fontSize: 12.5, lineHeight: 1.5 }}>{h}</Typography>
              </Stack>
            ))}
          </CardContent>
        </Card>

        {/* Trust micro-badges */}
        <Stack direction="row" spacing={1} sx={{ mb: 2.5 }}>
          {tour.cancellationHours > 0 && (
            <Chip icon={<EventAvailableRoundedIcon sx={{ fontSize: 14, color: `${G} !important` }} />}
              label={`Free cancel ${tour.cancellationHours}h`} size="small"
              sx={{ borderRadius: 999, fontSize: 10, height: 24, bgcolor: "rgba(3,205,140,0.08)", color: G, fontWeight: 600 }} />
          )}
          {tour.operatorVerified && (
            <Chip icon={<VerifiedRoundedIcon sx={{ fontSize: 14, color: `${G} !important` }} />}
              label="Verified" size="small"
              sx={{ borderRadius: 999, fontSize: 10, height: 24, bgcolor: "rgba(3,205,140,0.08)", color: G, fontWeight: 600 }} />
          )}
          <Chip icon={<SecurityRoundedIcon sx={{ fontSize: 14, color: `${G} !important` }} />}
            label="Secure checkout" size="small"
            sx={{ borderRadius: 999, fontSize: 10, height: 24, bgcolor: "rgba(3,205,140,0.08)", color: G, fontWeight: 600 }} />
        </Stack>

        {/* About */}
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 15, mb: 0.75 }}>About this tour</Typography>
          <Typography variant="body2" sx={{ fontSize: 13, lineHeight: 1.7, color: t => t.palette.text.secondary }}>{tour.description}</Typography>
        </Box>

        {/* Itinerary */}
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 15, mb: 0.75 }}>Itinerary</Typography>
          {tour.itinerary.map((step, i) => (
            <Accordion key={i} elevation={0} disableGutters
              sx={{
                bgcolor: "transparent", "&:before": { display: "none" },
                border: t => `1px solid ${t.palette.mode === "light" ? "rgba(209,213,219,0.5)" : "rgba(51,65,85,0.5)"}`,
                borderRadius: "12px !important", mb: 1, overflow: "hidden"
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />} sx={{ minHeight: 44, px: 1.5 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip label={step.time} size="small"
                    sx={{ borderRadius: 999, fontSize: 10, height: 22, bgcolor: "rgba(3,205,140,0.1)", color: G, fontWeight: 700 }} />
                  <Typography variant="body2" sx={{ fontSize: 12.5, fontWeight: 600 }}>{step.title}</Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 1.5, pt: 0, pb: 1.5 }}>
                <Typography variant="body2" sx={{ fontSize: 12, color: t => t.palette.text.secondary, lineHeight: 1.6 }}>
                  {step.description}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* What's included / not included */}
        <Stack direction="row" spacing={1.5} sx={{ mb: 2.5 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 13, mb: 0.75, color: G }}>Included</Typography>
            {tour.included.map((item, i) => (
              <Stack key={i} direction="row" spacing={0.5} alignItems="flex-start" sx={{ mb: 0.3 }}>
                <CheckCircleRoundedIcon sx={{ fontSize: 13, color: G, mt: 0.2, flexShrink: 0 }} />
                <Typography variant="caption" sx={{ fontSize: 11, lineHeight: 1.5 }}>{item}</Typography>
              </Stack>
            ))}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 13, mb: 0.75, color: "#EF4444" }}>Not included</Typography>
            {tour.notIncluded.map((item, i) => (
              <Stack key={i} direction="row" spacing={0.5} alignItems="flex-start" sx={{ mb: 0.3 }}>
                <CancelRoundedIcon sx={{ fontSize: 13, color: "#EF4444", mt: 0.2, flexShrink: 0 }} />
                <Typography variant="caption" sx={{ fontSize: 11, lineHeight: 1.5 }}>{item}</Typography>
              </Stack>
            ))}
          </Box>
        </Stack>

        {/* Meeting point */}
        <Card elevation={0} sx={{
          borderRadius: 2.5, mb: 2.5,
          bgcolor: t => t.palette.mode === "light" ? "#fff" : "rgba(15,23,42,0.98)",
          border: t => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.7)"
        }}>
          <CardContent sx={{ px: 1.8, py: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 13, mb: 0.5 }}>Meeting point</Typography>
            <Stack direction="row" spacing={0.5} alignItems="flex-start">
              <PlaceRoundedIcon sx={{ fontSize: 16, color: G, mt: 0.2 }} />
              <Typography variant="body2" sx={{ fontSize: 12, color: t => t.palette.text.secondary, lineHeight: 1.5 }}>
                {tour.meetingPoint}
              </Typography>
            </Stack>
            {tour.pickupDetails && (
              <Typography variant="caption" sx={{ fontSize: 11, color: t => t.palette.text.secondary, mt: 0.75, display: "block", lineHeight: 1.5 }}>
                {tour.pickupDetails}
              </Typography>
            )}
            {/* Map placeholder */}
            <Box sx={{
              mt: 1.5, height: 120, borderRadius: 2,
              background: "linear-gradient(135deg, rgba(3,205,140,0.1) 0%, rgba(15,23,42,0.3) 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: t => `1px dashed ${t.palette.divider}`
            }}>
              <Typography variant="caption" sx={{ color: t => t.palette.text.secondary, fontSize: 11 }}>
                📍 Map — {tour.destination}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Cancellation policy */}
        <Card elevation={0} sx={{
          borderRadius: 2.5, mb: 2.5,
          bgcolor: t => t.palette.mode === "light" ? "rgba(3,205,140,0.04)" : "rgba(3,205,140,0.04)",
          border: "1px solid rgba(3,205,140,0.15)"
        }}>
          <CardContent sx={{ px: 1.8, py: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 13, mb: 0.5, color: G }}>Cancellation policy</Typography>
            <Typography variant="body2" sx={{ fontSize: 12, color: t => t.palette.text.secondary, lineHeight: 1.6 }}>
              {tour.cancellationPolicy}
            </Typography>
          </CardContent>
        </Card>

        {/* FAQs */}
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 15, mb: 0.75 }}>Frequently asked questions</Typography>
          {tour.faqs.map((faq, i) => (
            <Accordion key={i} elevation={0} disableGutters
              sx={{
                bgcolor: "transparent", "&:before": { display: "none" },
                border: t => `1px solid ${t.palette.mode === "light" ? "rgba(209,213,219,0.5)" : "rgba(51,65,85,0.5)"}`,
                borderRadius: "12px !important", mb: 1, overflow: "hidden"
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />} sx={{ minHeight: 40, px: 1.5 }}>
                <Typography variant="body2" sx={{ fontSize: 12.5, fontWeight: 600 }}>{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 1.5, pt: 0, pb: 1.5 }}>
                <Typography variant="body2" sx={{ fontSize: 12, color: t => t.palette.text.secondary, lineHeight: 1.6 }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* Reviews */}
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 15, mb: 1 }}>
            Reviews ({reviews.length})
          </Typography>

          {/* Rating overview */}
          <Card elevation={0} sx={{
            borderRadius: 2.5, mb: 1.5,
            bgcolor: t => t.palette.mode === "light" ? "#fff" : "rgba(15,23,42,0.98)",
            border: t => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.5)" : "1px solid rgba(51,65,85,0.5)"
          }}>
            <CardContent sx={{ px: 1.8, py: 1.5 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ mx: 7, textAlign: "center" }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: G }}>{tour.rating}</Typography>
                  <Rating value={tour.rating} readOnly precision={0.1} size="small" sx={{ color: "#F59E0B" }} />
                  <Typography variant="caption" sx={{ fontSize: 10, display: "block", color: t => t.palette.text.secondary }}>
                    {tour.reviewCount} reviews
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  {[5, 4, 3, 2, 1].map(star => (
                    <Stack key={star} direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.25 }}>
                      <Typography variant="caption" sx={{ mx: 7, fontSize: 10, width: 10, textAlign: "center" }}>{star}</Typography>
                      <StarRoundedIcon sx={{ fontSize: 12, color: "#F59E0B" }} />
                      <LinearProgress
                        variant="determinate"
                        value={((ratingDist[star - 1] || 0) / maxDistCount) * 100}
                        sx={{
                          flex: 1, height: 6, borderRadius: 999,
                          bgcolor: t => t.palette.mode === "light" ? "#F3F4F6" : "rgba(51,65,85,0.5)",
                          "& .MuiLinearProgress-bar": { bgcolor: "#F59E0B", borderRadius: 999 }
                        }}
                      />
                      <Typography variant="caption" sx={{ mx: 7, fontSize: 10, width: 16, textAlign: "center", color: t => t.palette.text.secondary }}>
                        {ratingDist[star - 1]}
                      </Typography>
                    </Stack>
                  ))}
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Review cards */}
          {reviews.slice(0, 4).map(review => (
            <Card key={review.id} elevation={0} sx={{
              borderRadius: 2, mb: 1,
              bgcolor: t => t.palette.mode === "light" ? "#fff" : "rgba(15,23,42,0.98)",
              border: t => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.5)" : "1px solid rgba(51,65,85,0.5)"
            }}>
              <CardContent sx={{ px: 1.5, py: 1.2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <Box sx={{
                      width: 28, height: 28, borderRadius: "50%", bgcolor: G, display: "flex",
                      alignItems: "center", justifyContent: "center"
                    }}>
                      <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#020617" }}>
                        {review.author.charAt(0)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600 }}>{review.author}</Typography>
                      <Typography variant="caption" sx={{ fontSize: 10, color: t => t.palette.text.secondary }}>{review.date}</Typography>
                    </Box>
                  </Stack>
                  <Rating value={review.rating} readOnly size="small" sx={{ color: "#F59E0B" }} />
                </Stack>
                <Typography variant="body2" sx={{ fontSize: 12, lineHeight: 1.6, color: t => t.palette.text.secondary }}>
                  {review.comment}
                </Typography>
                {review.helpful > 0 && (
                  <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.75 }}>
                    <ThumbUpAltRoundedIcon sx={{ fontSize: 12, color: t => t.palette.text.secondary }} />
                    <Typography variant="caption" sx={{ fontSize: 10, color: t => t.palette.text.secondary }}>
                      {review.helpful} found this helpful
                    </Typography>
                  </Stack>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Similar tours */}
        {similarTours.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 15, mb: 1 }}>Similar tours</Typography>
            <Box sx={{ overflowX: "auto", mx: -2, px: 2, "&::-webkit-scrollbar": { display: "none" } }}>
              <Stack direction="row" spacing={1.5} sx={{ pb: 1 }}>
                {similarTours.map(st => (
                  <Card key={st.slug} elevation={0} onClick={() => navigate(`/tours/${st.slug}`)}
                    sx={{
                      minWidth: 200, borderRadius: 2.5, overflow: "hidden", cursor: "pointer", flexShrink: 0,
                      bgcolor: t => t.palette.mode === "light" ? "#fff" : "rgba(15,23,42,0.98)",
                      border: t => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.5)" : "1px solid rgba(51,65,85,0.5)",
                      transition: "transform 0.15s", "&:hover": { transform: "translateY(-2px)" }
                    }}
                  >
                    <Box sx={{ height: 100, background: getGradientForTour(st.slug), display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Typography sx={{ color: "rgba(255,255,255,0.2)", fontSize: 32, fontWeight: 900 }}>
                        {st.destination.charAt(0)}
                      </Typography>
                    </Box>
                    <CardContent sx={{ px: 1.2, py: 1 }}>
                      <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600, mb: 0.25 }}>{st.title}</Typography>
                      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.3 }}>
                        <StarRoundedIcon sx={{ fontSize: 11, color: "#F59E0B" }} />
                        <Typography variant="caption" sx={{ fontSize: 10 }}>{st.rating}</Typography>
                      </Stack>
                      <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700, color: G }}>
                        {formatUGX(st.pricePerPerson)}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>
          </Box>
        )}

        {/* Operator info */}
        <Card elevation={0} sx={{
          borderRadius: 2.5, mb: 2,
          bgcolor: t => t.palette.mode === "light" ? "#fff" : "rgba(15,23,42,0.98)",
          border: t => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.5)" : "1px solid rgba(51,65,85,0.5)"
        }}>
          <CardContent sx={{ px: 1.8, py: 1.5 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 36, height: 36, borderRadius: "50%", bgcolor: G, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ fontWeight: 800, fontSize: 14, color: "#020617" }}>
                  {tour.operatorName.charAt(0)}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>{tour.operatorName}</Typography>
                  {tour.operatorVerified && <VerifiedRoundedIcon sx={{ fontSize: 14, color: G }} />}
                </Stack>
                <Typography variant="caption" sx={{ fontSize: 10.5, color: t => t.palette.text.secondary }}>
                  Licensed & verified tour operator
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* ── Sticky bottom booking bar ──────────────────── */}
      <Box sx={{
        position: "fixed", bottom: 64, left: 0, right: 0, zIndex: 1000,
        bgcolor: t => t.palette.mode === "light" ? "rgba(255,255,255,0.95)" : "rgba(15,23,42,0.95)",
        backdropFilter: "blur(12px)",
        borderTop: t => `1px solid ${t.palette.divider}`,
        px: 2, py: 1.2
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Stack direction="row" spacing={0.5} alignItems="baseline">
              <Typography variant="body1" sx={{ fontWeight: 800, fontSize: 18, color: G }}>
                {formatUGX(tour.pricePerPerson)}
              </Typography>
              {tour.originalPrice && (
                <Typography variant="caption" sx={{ fontSize: 12, textDecoration: "line-through", color: t => t.palette.text.secondary }}>
                  {formatUGX(tour.originalPrice)}
                </Typography>
              )}
            </Stack>
            <Typography variant="caption" sx={{ fontSize: 10.5, color: t => t.palette.text.secondary }}>per person</Typography>
          </Box>
          <Button variant="contained"
            disabled={tour.availability === "sold_out"}
            onClick={() => navigate(`/tours/${tour.slug}/book`)}
            sx={{
              borderRadius: 999, px: 3.5, py: 1.1, fontSize: 14, fontWeight: 700,
              textTransform: "none", bgcolor: G, color: "#020617",
              "&:hover": { bgcolor: G2 }
            }}
          >
            Book now
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

/* ═══════════════════════════════════════════════════════════
   Loading skeleton
   ═══════════════════════════════════════════════════════════ */
function TourDetailSkeleton() {
  return (
    <Box>
      <Skeleton variant="rectangular" height={240} animation="wave" />
      <Box sx={{ px: 2, pt: 2 }}>
        <Skeleton variant="text" width="75%" height={28} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="40%" height={18} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="60%" height={18} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" width="100%" height={100} sx={{ borderRadius: 2, mb: 2 }} />
        <Skeleton variant="text" width="50%" height={22} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="100%" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" width="100%" height={140} sx={{ borderRadius: 2, mb: 2 }} />
      </Box>
    </Box>
  );
}

/* ═══════════════════════════════════════════════════════════
   Export
   ═══════════════════════════════════════════════════════════ */
export default function TourDetailPage() {
  return (
    <>
      <DarkModeToggle />
      <MobileShell>
        <TourDetailScreen />
      </MobileShell>
    </>
  );
}
