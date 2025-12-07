import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
  Avatar,
  LinearProgress,
  IconButton
} from "@mui/material";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import { COLORS } from "../../constants/colors";
import { formatDeliveryDateParts } from "../../utils/dateUtils";

interface SenderInfo {
  name?: string;
  city?: string;
  code?: string;
  address?: string;
  profileImage?: string | null;
  avatar?: string;
  icon?: string;
}

interface ReceiverInfo {
  city?: string;
  code?: string;
  icon?: string;
}

interface DeliveryOrder {
  id: string;
  packageName: string;
  status: string;
  progress?: number;
  date?: Date;
  time?: string;
  sender?: SenderInfo;
  receiver?: ReceiverInfo;
  needsPayment?: boolean;
}

interface DeliveryCardProps {
  order: DeliveryOrder;
  variant?: "delivering" | "received";
  onMenuClick?: (event: React.MouseEvent<HTMLButtonElement>, orderId: string) => void;
  onAccept?: (orderId: string) => void;
  onReject?: (orderId: string) => void;
  onMakePayment?: (orderId: string) => void;
  showTruckIcon?: boolean;
}

/**
 * Reusable Delivery Card Component
 * Displays delivery information in a consistent card format
 */
export default function DeliveryCard({
  order,
  variant = "delivering",
  onMenuClick,
  onAccept,
  onReject,
  onMakePayment,
  showTruckIcon = false
}: DeliveryCardProps): React.JSX.Element {
  const greenPrimary = COLORS.green.primary;
  const greenSecondary = COLORS.green.secondary;
  const isReceived = variant === "received";
  const showAcceptReject = variant === "delivering" && order.status === "Waiting to accept";

  return (
    <Card
      elevation={0}
      sx={{
        mb: 2,
        borderRadius: 2.5,
        bgcolor: (t) =>
          t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
        border: (t) =>
          t.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.9)"
      }}
    >
      <CardContent sx={{ px: 1.75, py: 1.75 }}>
        {/* Package Icon and Name */}
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1.5,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "rgba(3,205,140,0.1)" : "rgba(3,205,140,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Inventory2RoundedIcon sx={{ fontSize: 20, color: greenPrimary }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                mb: 0.25
              }}
            >
              {order.packageName}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
            >
              Tracking ID: {order.id}
            </Typography>
          </Box>
          {onMenuClick && (
            <IconButton
              size="small"
              onClick={(e) => onMenuClick(e, order.id)}
              sx={{
                width: 32,
                height: 32,
                color: (t) => t.palette.text.secondary
              }}
            >
              <MoreVertRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          )}
        </Stack>

        {/* Sender Section */}
        {isReceived ? (
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Avatar
              src={order.sender?.profileImage || undefined}
              sx={{
                width: 32,
                height: 32,
                bgcolor: greenPrimary,
                fontSize: 13,
                fontWeight: 600,
                color: "#FFFFFF"
              }}
            >
              {order.sender?.avatar || order.sender?.name?.charAt(0) || "U"}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <ArrowUpwardRoundedIcon
                  sx={{
                    fontSize: 14,
                    color: greenPrimary
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  Sender
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                sx={{ fontSize: 12, fontWeight: 500, letterSpacing: "-0.01em" }}
              >
                {order.sender?.city}, {order.sender?.code}
              </Typography>
            </Box>
          </Stack>
        ) : (
          <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mb: 1 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "rgba(3,205,140,0.15)" : "rgba(3,205,140,0.25)",
                fontSize: 13,
                fontWeight: 600,
                color: greenPrimary,
                mt: 0.25
              }}
            >
              <PersonRoundedIcon sx={{ fontSize: 18 }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.25 }}>
                <PersonRoundedIcon
                  sx={{
                    fontSize: 14,
                    color: (t) => t.palette.text.secondary
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  Sender
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  mb: 0.25,
                  color: (t) => t.palette.text.primary
                }}
              >
                {order.sender?.name || "Unknown Sender"}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: 10.5,
                  color: (t) => t.palette.text.secondary,
                  lineHeight: 1.4,
                  display: "block"
                }}
              >
                {order.sender?.address || `${order.sender?.city}, ${order.sender?.code}`}
              </Typography>
            </Box>
          </Stack>
        )}

        {/* Date and Day - Only for delivering variant */}
        {!isReceived && order.date && (
          <Box sx={{ mb: 1 }}>
            <Typography
              variant="caption"
              sx={{
                fontSize: 10.5,
                color: (t) => t.palette.text.secondary,
                "& .date-part": {
                  color: (t) => t.palette.text.secondary
                },
                "& .day-part": {
                  color: greenPrimary,
                  fontWeight: 600
                }
              }}
            >
              <span className="date-part">
                {formatDeliveryDateParts(order.date).datePart}
              </span>
              {" – "}
              <span className="day-part">
                {formatDeliveryDateParts(order.date).dayPart}
              </span>
            </Typography>
          </Box>
        )}

        {/* Receiver Section */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "rgba(247,127,0,0.15)" : "rgba(247,127,0,0.25)",
              fontSize: 12,
              fontWeight: 600,
              color: COLORS.orange.primary,
              position: "relative"
            }}
          >
            <Inventory2RoundedIcon sx={{ fontSize: 16 }} />
            <ArrowDownwardRoundedIcon
              sx={{
                fontSize: isReceived ? 12 : 10,
                position: "absolute",
                bottom: isReceived ? -4 : -2,
                right: isReceived ? -4 : -2,
                bgcolor: (t) => t.palette.background.paper,
                borderRadius: "50%",
                p: isReceived ? 0.25 : 0
              }}
            />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Receiver
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: 12, fontWeight: 500, letterSpacing: "-0.01em" }}
            >
              {order.receiver?.city}, {order.receiver?.code}
            </Typography>
          </Box>
          {isReceived && (
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ justifyContent: "flex-end" }}>
              <Box
                component="span"
                sx={{
                  width: 12,
                  height: 12,
                  minWidth: 12,
                  minHeight: 12,
                  borderRadius: "50%",
                  bgcolor: greenPrimary,
                  display: "inline-block",
                  flexShrink: 0,
                  boxShadow: `0 0 0 2px ${greenPrimary}30`
                }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary, whiteSpace: "nowrap" }}
              >
                {order.time}
              </Typography>
            </Stack>
          )}
          {!isReceived && (
            <Box sx={{ flex: 1, textAlign: "right" }}>
              <Typography
                variant="caption"
                sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
              >
                {order.time}
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Status and Progress */}
        <Stack spacing={1} sx={{ mb: showAcceptReject || order.needsPayment ? 1.5 : 0 }}>
          <Chip
            label={order.status}
            size="small"
            sx={{
              height: 22,
              fontSize: 10,
              fontWeight: 600,
              width: "fit-content",
              bgcolor:
                order.status === "Waiting to accept" || order.status === "Waiting to collect"
                  ? (t) => (t.palette.mode === "light" ? "#F3F4F6" : "#374151")
                  : order.status === "Request accepted" || order.status === "Delivered"
                  ? "#D1FAE5"
                  : "#F3F4F6",
              color:
                order.status === "Waiting to accept" || order.status === "Waiting to collect"
                  ? (t) => (t.palette.mode === "light" ? "#4B5563" : "#9CA3AF")
                  : order.status === "Request accepted" || order.status === "Delivered"
                  ? "#064E3B"
                  : "#4B5563"
            }}
          />
          {/* Progress Line with optional Delivery Truck Icon */}
          <Box sx={{ position: "relative", width: "100%" }}>
            <LinearProgress
              variant="determinate"
              value={order.progress || 0}
              sx={{
                height: 4,
                borderRadius: 999,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#E5E7EB" : "#374151",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 999,
                  bgcolor: greenPrimary
                }
              }}
            />
            {showTruckIcon && (
              <Box
                sx={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 20,
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: greenPrimary,
                  borderRadius: "50%",
                  boxShadow: `0 0 0 2px ${greenPrimary}20`
                }}
              >
                <LocalShippingRoundedIcon
                  sx={{
                    fontSize: 12,
                    color: "#FFFFFF"
                  }}
                />
              </Box>
            )}
          </Box>
        </Stack>

        {/* Accept/Reject Buttons - Only for delivering variant with "Waiting to accept" status */}
        {showAcceptReject && (
          <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => onAccept?.(order.id)}
              sx={{
                bgcolor: greenPrimary,
                color: "#FFFFFF",
                borderRadius: 2,
                py: 1,
                fontSize: 13,
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  bgcolor: greenSecondary
                }
              }}
            >
              Accept
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => onReject?.(order.id)}
              sx={{
                borderColor: "#EF4444",
                color: "#EF4444",
                borderRadius: 2,
                py: 1,
                fontSize: 13,
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  borderColor: "#DC2626",
                  bgcolor: "rgba(239,68,68,0.08)"
                }
              }}
            >
              Reject
            </Button>
          </Stack>
        )}

        {/* Make Payment Button - Only for received variant when payment is needed */}
        {order.needsPayment && isReceived && (
          <Button
            fullWidth
            variant="contained"
            onClick={() => onMakePayment?.(order.id)}
            sx={{
              bgcolor: greenPrimary,
              color: "#FFFFFF",
              borderRadius: 2,
              py: 1.2,
              fontSize: 13,
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                bgcolor: greenSecondary
              }
            }}
          >
            Make Payment
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

