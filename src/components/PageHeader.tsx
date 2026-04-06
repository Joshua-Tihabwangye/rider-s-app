import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, SxProps, Theme, Typography } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { uiTokens } from "../design/tokens";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  hideBack?: boolean;
  sx?: SxProps<Theme>;
}

export default function PageHeader({
  title,
  subtitle,
  onBack,
  rightAction,
  hideBack = false,
  sx
}: PageHeaderProps): React.JSX.Element {
  const navigate = useNavigate();
  const handleBack = onBack ?? (() => navigate(-1));

  return (
    <Box
      component="header"
      sx={[
        {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.25,
          minHeight: 44
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0, flex: 1 }}>
        {!hideBack && (
          <IconButton
            size="small"
            aria-label="Back"
            onClick={handleBack}
            sx={{
              width: 36,
              height: 36,
              bgcolor: "var(--evz-header-back-bg)",
              border: "1px solid var(--evz-header-back-border)",
              borderRadius: "var(--evz-radius-md)",
              color: (t) => t.palette.text.primary
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 17 }} />
          </IconButton>
        )}

        <Box sx={{ minWidth: 0 }}>
          {subtitle && (
            <Typography
              variant="caption"
              sx={{
                ...uiTokens.text.eyebrow,
                color: (t) => t.palette.text.secondary,
                display: "block",
                mb: 0.15
              }}
            >
              {subtitle}
            </Typography>
          )}
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: (t) => t.palette.text.primary,
              lineHeight: 1.2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            {title}
          </Typography>
        </Box>
      </Box>

      {rightAction && <Box sx={{ flexShrink: 0 }}>{rightAction}</Box>}
    </Box>
  );
}

