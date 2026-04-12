import React from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  LinearProgress,
  Stack,
  Typography
} from "@mui/material";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import AppCard from "../primitives/AppCard";
import { uiTokens } from "../../design/tokens";
import { formatDeliveryDateParts } from "../../utils/dateUtils";
import { getDeliveryStatusLabel } from "../../features/delivery/stateMachine";
import {
  getDeliveryOrderModeLabel,
  getDeliveryOrderModeTone
} from "../../features/delivery/orderMode";
import type { DeliveryOrderMode, DeliveryStatus } from "../../store/types";

interface SenderInfo {
  name?: string;
  city?: string;
  code?: string;
  address?: string;
  profileImage?: string | null;
  avatar?: string;
}

interface ReceiverInfo {
  city?: string;
  code?: string;
}

interface DeliveryOrder {
  id: string;
  packageName: string;
  status: string;
  orderMode?: DeliveryOrderMode;
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
  onClick?: (orderId: string) => void;
}

function statusStyles(status: string): { bg: string | ((theme: any) => string); fg: string | ((theme: any) => string) } {
  if (status === "accepted" || status === "delivered") {
    return { bg: uiTokens.colors.successBg, fg: uiTokens.colors.successText };
  }
  if (status === "cancelled" || status === "failed") {
    return { bg: uiTokens.surfaces.dangerTintSoft, fg: uiTokens.colors.danger };
  }
  return {
    bg: (theme: any) =>
      theme.palette.mode === "light" ? uiTokens.colors.neutral100 : uiTokens.colors.slate700,
    fg: (theme: any) =>
      theme.palette.mode === "light" ? uiTokens.colors.neutral600 : uiTokens.colors.slate300
  };
}

export default function DeliveryCard({
  order,
  variant = "delivering",
  onMenuClick,
  onAccept,
  onReject,
  onMakePayment,
  showTruckIcon = false,
  onClick
}: DeliveryCardProps): React.JSX.Element {
  const isReceived = variant === "received";
  const showAcceptReject = Boolean(onAccept && onReject) && isReceived && order.status === "requested";
  const statusTone = statusStyles(order.status);
  const statusLabel = getDeliveryStatusLabel(order.status as DeliveryStatus);
  const progressValue = order.progress ?? 0;

  return (
    <AppCard onClick={() => onClick?.(order.id)} sx={{ mb: uiTokens.spacing.lg }}>
      <Stack spacing={1.35}>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Box
            sx={{
              width: 40,
              height: 40,
              bgcolor: (t) =>
                uiTokens.surfaces.brandTintSoft(t),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: uiTokens.colors.brand
            }}
          >
            <Inventory2RoundedIcon sx={{ fontSize: 20 }} />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ ...uiTokens.text.itemTitle, mb: 0.2 }}>
              {order.packageName}
            </Typography>
            <Stack direction="row" spacing={0.7} alignItems="center" useFlexGap flexWrap="wrap">
              <Typography variant="caption" sx={{ ...uiTokens.text.itemBody, color: (t) => t.palette.text.secondary }}>
                Tracking ID: {order.id}
              </Typography>
              {order.orderMode && (
                <Chip
                  size="small"
                  label={getDeliveryOrderModeLabel(order.orderMode)}
                  sx={{
                    height: 20,
                    fontSize: 10,
                    fontWeight: 700,
                    bgcolor: getDeliveryOrderModeTone(order.orderMode).bg,
                    color: getDeliveryOrderModeTone(order.orderMode).fg,
                    border: `1px solid ${getDeliveryOrderModeTone(order.orderMode).border}`
                  }}
                />
              )}
            </Stack>
          </Box>

          {onMenuClick && (
            <IconButton
              size="small"
              onClick={(e) => onMenuClick(e, order.id)}
              aria-label={`Open actions for ${order.id}`}
              sx={{ color: (t) => t.palette.text.secondary }}
            >
              <MoreVertRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          )}
        </Stack>

        {isReceived ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar
              src={order.sender?.profileImage || undefined}
              sx={{
                width: 32,
                height: 32,
                bgcolor: uiTokens.colors.brand,
                color: uiTokens.colors.white,
                fontSize: 13,
                fontWeight: 700
              }}
            >
              {order.sender?.avatar || order.sender?.name?.charAt(0) || "U"}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <ArrowUpwardRoundedIcon sx={{ fontSize: 14, color: uiTokens.colors.brand }} />
                <Typography variant="caption" sx={{ ...uiTokens.text.itemBody, color: (t) => t.palette.text.secondary }}>
                  Sender
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ fontSize: 12.5, fontWeight: 600 }}>
                {order.sender?.city}, {order.sender?.code}
              </Typography>
            </Box>
          </Stack>
        ) : (
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <Avatar
              sx={{
                width: 32,
                height: 32,
              bgcolor: (t) =>
                  uiTokens.surfaces.brandTintMedium(t),
                color: uiTokens.colors.brand
              }}
            >
              <PersonRoundedIcon sx={{ fontSize: 17 }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.25 }}>
                <PersonRoundedIcon sx={{ fontSize: 14, color: (t) => t.palette.text.secondary }} />
                <Typography variant="caption" sx={{ ...uiTokens.text.itemBody, color: (t) => t.palette.text.secondary }}>
                  Sender
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 700, mb: 0.25 }}>
                {order.sender?.name || "Unknown Sender"}
              </Typography>
              <Typography variant="caption" sx={{ ...uiTokens.text.itemBody, color: (t) => t.palette.text.secondary }}>
                {order.sender?.address || `${order.sender?.city}, ${order.sender?.code}`}
              </Typography>
            </Box>
          </Stack>
        )}

        {!isReceived && order.date && (
          <Typography
            variant="caption"
            sx={{
              ...uiTokens.text.itemBody,
              color: (t) => t.palette.text.secondary,
              "& .day-part": { color: uiTokens.colors.brand, fontWeight: 700 }
            }}
          >
            {formatDeliveryDateParts(order.date).datePart} –{" "}
            <span className="day-part">{formatDeliveryDateParts(order.date).dayPart}</span>
          </Typography>
        )}

        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: (t) =>
                uiTokens.surfaces.accentTintSoft(t),
              color: uiTokens.colors.accent
            }}
          >
            <Inventory2RoundedIcon sx={{ fontSize: 15 }} />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ ...uiTokens.text.itemBody, color: (t) => t.palette.text.secondary }}>
              Receiver
            </Typography>
            <Typography variant="body2" sx={{ fontSize: 12.5, fontWeight: 600 }}>
              {order.receiver?.city}, {order.receiver?.code}
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ ...uiTokens.text.itemBody, color: (t) => t.palette.text.secondary }}>
            {order.time}
          </Typography>
        </Stack>

        <Stack spacing={1}>
          <Chip
            label={statusLabel}
            size="small"
            sx={{
              width: "fit-content",
              height: 22,
              fontSize: 10,
              fontWeight: 700,
              bgcolor: statusTone.bg,
              color: statusTone.fg
            }}
          />
          <Box sx={{ position: "relative" }}>
            <LinearProgress
              variant="determinate"
              value={progressValue}
              sx={{
                height: 4,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? uiTokens.colors.neutral200 : uiTokens.colors.slate700,
                "& .MuiLinearProgress-bar": { bgcolor: uiTokens.colors.brand }
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
                  bgcolor: uiTokens.colors.brand,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <LocalShippingRoundedIcon sx={{ fontSize: 12, color: uiTokens.colors.white }} />
              </Box>
            )}
          </Box>
        </Stack>

        {showAcceptReject && (
          <Stack direction="row" spacing={1.25}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => onAccept?.(order.id)}
              sx={{
                bgcolor: uiTokens.colors.brand,
                color: uiTokens.colors.white,
                py: uiTokens.spacing.sm,
                fontSize: 13,
                fontWeight: 700,
                textTransform: "none",
                "&:hover": { bgcolor: uiTokens.colors.brandHover }
              }}
            >
              Accept
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => onReject?.(order.id)}
              sx={{
                borderColor: uiTokens.colors.danger,
                color: uiTokens.colors.danger,
                py: uiTokens.spacing.sm,
                fontSize: 13,
                fontWeight: 700,
                textTransform: "none",
                "&:hover": {
                  borderColor: uiTokens.colors.dangerHover,
                  bgcolor: uiTokens.surfaces.dangerTintSoft
                }
              }}
            >
              Reject
            </Button>
          </Stack>
        )}

        {order.needsPayment && isReceived && (
          <Button
            fullWidth
            variant="contained"
            onClick={() => onMakePayment?.(order.id)}
            sx={{
              bgcolor: uiTokens.colors.brand,
              color: uiTokens.colors.white,
              py: uiTokens.spacing.smPlus,
              fontSize: 13,
              fontWeight: 700,
              textTransform: "none",
              "&:hover": { bgcolor: uiTokens.colors.brandHover }
            }}
          >
            Make Payment
          </Button>
        )}
      </Stack>
    </AppCard>
  );
}
