import React from "react";
import { Box, Typography } from "@mui/material";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import RoomRoundedIcon from "@mui/icons-material/RoomRounded";
import { Link as RouterLink } from "react-router-dom";

interface RiderAuthShowcaseLayoutProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  children: React.ReactNode;
  promptText: string;
  promptActionLabel: string;
  promptActionTo: string;
  footerText: string;
  promptActionColor?: string;
  heroImageSrc?: string;
  heroImageAlt?: string;
  titleBlockMarginTop?: number | { xs?: number; sm?: number };
  subtitleMarginTop?: number | { xs?: number; sm?: number };
  childrenMarginTop?: number | { xs?: number; sm?: number };
}

function Illustration({ heroImageSrc, heroImageAlt }: { heroImageSrc: string; heroImageAlt: string }): React.JSX.Element {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 300,
        mx: "auto",
        mt: { xs: 0.2, sm: 0.25 },
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        component="img"
        src={heroImageSrc}
        alt={heroImageAlt}
        sx={{
          display: "block",
          width: { xs: 260, sm: 290 },
          maxWidth: "100%",
          height: "auto",
          objectFit: "contain",
        }}
      />
    </Box>
  );
}

export default function RiderAuthShowcaseLayout({
  title,
  subtitle,
  children,
  promptText,
  promptActionLabel,
  promptActionTo,
  footerText,
  promptActionColor = "var(--evz-brand-orange)",
  heroImageSrc = "/rides-ui/Image2.png",
  heroImageAlt = "EVzone scooter",
  titleBlockMarginTop = 0.15,
  subtitleMarginTop = 0.45,
  childrenMarginTop = 1.1,
}: RiderAuthShowcaseLayoutProps): React.JSX.Element {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100dvh",
        overflowX: "hidden",
        overflowY: "auto",
        px: { xs: 1.5, sm: 2.25 },
        py: { xs: "max(env(safe-area-inset-top), 2px)", sm: 0.5 },
        background:
          "radial-gradient(circle at 12% 6%, rgba(3,205,140,0.08), transparent 22%), radial-gradient(circle at 94% 48%, rgba(247,127,0,0.08), transparent 20%), linear-gradient(180deg, #ffffff 0%, #fffdfa 42%, #ffffff 100%)",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: 350,
          mx: "auto",
          pb: "max(env(safe-area-inset-bottom), 12px)",
        }}
      >
        <Illustration heroImageSrc={heroImageSrc} heroImageAlt={heroImageAlt} />

        <Box sx={{ mt: titleBlockMarginTop, textAlign: "center", px: { xs: 0.35, sm: 0.75 } }}>
          <Typography
            sx={{
              fontSize: { xs: 24, sm: 26 },
              lineHeight: 1.02,
              letterSpacing: "-0.05em",
              fontWeight: 800,
              color: "#111827",
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              mt: subtitleMarginTop,
              mx: "auto",
              maxWidth: 254,
              fontSize: { xs: 12.5, sm: 13 },
              lineHeight: 1.28,
              color: "#6b7280",
            }}
          >
            {subtitle}
          </Typography>
        </Box>

        <Box sx={{ mt: childrenMarginTop }}>{children}</Box>

        <Box sx={{ mt: 2.05, textAlign: "center" }}>
          <Typography sx={{ fontSize: 13.5, color: "#6b7280" }}>
            {promptText}{" "}
            <Typography
              component={RouterLink}
              to={promptActionTo}
              sx={{
                display: "inline",
                fontSize: 13.5,
                fontWeight: 700,
                color: promptActionColor,
                textDecoration: "none",
              }}
            >
              {promptActionLabel}
            </Typography>
          </Typography>
        </Box>

        <Box
          sx={{
            mt: 2.2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.75,
            color: "#6b7280",
          }}
        >
          <Box sx={{ width: 54, height: 1.5, bgcolor: "rgba(3,205,140,0.36)" }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.65 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                bgcolor: "rgba(3,205,140,0.14)",
                color: "var(--evz-brand-green)",
              }}
            >
              <SecurityRoundedIcon sx={{ fontSize: 15 }} />
            </Box>
            <Typography sx={{ fontSize: 12.5, fontWeight: 500 }}>{footerText}</Typography>
          </Box>
          <Box sx={{ width: 54, height: 1.5, bgcolor: "rgba(3,205,140,0.36)" }} />
        </Box>

        <Box
          sx={{
            mt: 1.35,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 0.6,
            color: "rgba(107,114,128,0.68)",
          }}
        >
          <RoomRoundedIcon sx={{ fontSize: 13 }} />
          <Typography sx={{ fontSize: 10.5, letterSpacing: "0.03em", textTransform: "uppercase" }}>
            EVzone Rider
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
