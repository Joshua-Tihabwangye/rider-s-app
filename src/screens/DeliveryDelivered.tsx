import React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useNavigate } from "react-router-dom";
import { Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button, IconButton } from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

function OrderDeliveredConfirmationScreen(): React.JSX.Element {
  const navigate = useNavigate();

  const trackingId = "DLV-2025-10-07-001";
  const deliveredAt = "Today • 17:42";

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <IconButton
          size="small"
          aria-label="Back"
          onClick={() => navigate(-1)}
          sx={{
            borderRadius: 5,
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
        <Box sx={{ width: 32 }} />
      </Box>
      {/* Delivered banner */}
      <Box sx={{ textAlign: "center", mb: 2.5 }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 72,
            height: 72,
            borderRadius: "5px",
            bgcolor: "rgba(34,197,94,0.12)",
            mb: 1.5
          }}
        >
          <CheckCircleRoundedIcon sx={{ fontSize: 40, color: "#22c55e" }} />
        </Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, letterSpacing: "-0.02em", mb: 0.4 }}
        >
          Order delivered
        </Typography>
        <Typography
          variant="caption"
          sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, display: "block" }}
        >
          Your parcel has been successfully delivered to Nsambya Road 472, Kampala.
        </Typography>
      </Box>

      {/* Delivery details */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.25 }}>
            <Inventory2RoundedIcon sx={{ fontSize: 20, color: "primary.main" }} />
            <Box>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Tracking ID
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                {trackingId}
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ mb: 1 }}>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              From
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, letterSpacing: "-0.01em" }}
            >
              EVzone Marketplace – China–Africa Hub Warehouse
            </Typography>
          </Box>
          <Box sx={{ mb: 1 }}>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              To
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, letterSpacing: "-0.01em" }}
            >
              Nsambya Road 472, Kampala
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Delivered at
            </Typography>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <AccessTimeRoundedIcon
                sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                {deliveredAt}
              </Typography>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <Stack direction="row" spacing={1.25} sx={{ mb: 1.5 }}>
        <Button
          fullWidth
          variant="outlined"
          sx={{
            borderRadius: 5,
            py: 1,
            fontSize: 14,
            textTransform: "none"
          }}
        >
          View receipt
        </Button>
        <Button
          fullWidth
          variant="outlined"
          sx={{
            borderRadius: 5,
            py: 1,
            fontSize: 14,
            textTransform: "none"
          }}
        >
          Rate delivery
        </Button>
      </Stack>

      <Typography
        variant="caption"
        sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
      >
        You can access this delivery again from Deliveries → History if you need
        proof of delivery or a receipt later.
      </Typography>
    </Box>
  );
}

export default function RiderScreen65OrderDeliveredConfirmationCanvas_v2() {
      return (
    
      
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          bgcolor: (t) => t.palette.background.default
        }}
      >

          <OrderDeliveredConfirmationScreen />
        
      </Box>
    
  );
}
