import React from "react";
import { Box, Typography, Chip, Paper } from "@mui/material";

interface ScreenScaffoldProps {
  code: string;
  title: string;
  subtitle?: string;
  badge?: string;
}

export default function ScreenScaffold({
  code,
  title,
  subtitle,
  badge
}: ScreenScaffoldProps): JSX.Element {
  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="caption"
              sx={{
                fontSize: 11,
                color: (t) => t.palette.text.secondary
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.5 }}>
          <Chip
            size="small"
            label={code}
            sx={{
              borderRadius: 999,
              fontSize: 10,
              height: 22,
              bgcolor: (t) =>
                t.palette.mode === "light"
                  ? "#F3F4F6"
                  : "rgba(15,23,42,0.9)"
            }}
          />
          {badge && (
            <Chip
              size="small"
              label={badge}
              color="primary"
              sx={{
                borderRadius: 999,
                fontSize: 10,
                height: 22
              }}
            />
          )}
        </Box>
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <Box sx={{ px: 1.75, py: 1.75 }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: 11,
              color: (t) => t.palette.text.secondary,
              display: "block",
              mb: 0.75
            }}
          >
            This is a scaffold for {code}.{" "}
            Replace this block with the full high-fidelity UI for this screen.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: 12.5,
              color: (t) => t.palette.text.primary
            }}
          >
            Use this project as your safe, plug-and-play playground: the EVzone
            theme, mobile frame and navigation are already wired. Your team can
            now paste in the detailed JSX for each RA screen without worrying
            about breaking the app.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

