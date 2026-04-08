import React from "react";
import {
  Avatar,
  Box,
  Dialog,
  IconButton,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { uiTokens } from "../design/tokens";

interface DriverChatRoomProps {
  open: boolean;
  onClose: () => void;
  driverName?: string;
  driverAvatar?: string;
}

interface DriverChatMessage {
  id: string;
  sender: "driver" | "rider";
  text: string;
}

const DEFAULT_MESSAGES: DriverChatMessage[] = [
  {
    id: "msg-driver-1",
    sender: "driver",
    text: "Hi, I am on my way. Please keep your phone nearby."
  }
];

function getDriverInitials(driverName?: string, driverAvatar?: string): string {
  if (driverAvatar?.trim()) {
    return driverAvatar.trim().slice(0, 2).toUpperCase();
  }

  if (!driverName?.trim()) {
    return "DR";
  }

  return driverName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function DriverChatRoom({
  open,
  onClose,
  driverName,
  driverAvatar
}: DriverChatRoomProps): React.JSX.Element {
  const [draftMessage, setDraftMessage] = React.useState("");
  const [messages, setMessages] = React.useState<DriverChatMessage[]>(DEFAULT_MESSAGES);

  const resolvedDriverName = driverName?.trim() || "Driver";
  const driverInitials = React.useMemo(
    () => getDriverInitials(driverName, driverAvatar),
    [driverAvatar, driverName]
  );

  const handleSend = () => {
    const trimmed = draftMessage.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-rider-${Date.now()}`,
        sender: "rider",
        text: trimmed
      }
    ]);
    setDraftMessage("");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{
        sx: {
          bgcolor: (theme) => theme.palette.background.default
        }
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            px: uiTokens.spacing.lg,
            py: uiTokens.spacing.mdPlus,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: (theme) => theme.palette.background.paper
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={uiTokens.spacing.md}>
              <IconButton onClick={onClose} size="small" aria-label="Close chat">
                <CloseRoundedIcon />
              </IconButton>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "#03CD8C",
                  color: "#FFFFFF",
                  fontSize: 13,
                  fontWeight: 700
                }}
              >
                {driverInitials}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {resolvedDriverName}
                </Typography>
                <Typography variant="caption" sx={{ color: "#22c55e", fontWeight: 600 }}>
                  Online
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Box>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: uiTokens.spacing.lg,
            py: uiTokens.spacing.lg,
            display: "flex",
            flexDirection: "column",
            gap: uiTokens.spacing.md
          }}
        >
          {messages.map((message) => {
            const isDriver = message.sender === "driver";
            return (
              <Box
                key={message.id}
                sx={{
                  alignSelf: isDriver ? "flex-start" : "flex-end",
                  maxWidth: "82%",
                  px: uiTokens.spacing.mdPlus,
                  py: uiTokens.spacing.sm,
                  borderRadius: isDriver ? "14px 14px 14px 4px" : "14px 14px 4px 14px",
                  bgcolor: (theme) =>
                    isDriver
                      ? theme.palette.mode === "light"
                        ? "#F3F4F6"
                        : "rgba(255,255,255,0.06)"
                      : "#03CD8C",
                  color: isDriver ? "text.primary" : "#FFFFFF"
                }}
              >
                <Typography variant="body2">{message.text}</Typography>
              </Box>
            );
          })}
        </Box>

        <Box
          sx={{
            p: uiTokens.spacing.lg,
            borderTop: "1px solid",
            borderColor: "divider",
            bgcolor: (theme) => theme.palette.background.paper
          }}
        >
          <Stack direction="row" spacing={uiTokens.spacing.sm}>
            <TextField
              fullWidth
              size="small"
              value={draftMessage}
              onChange={(event) => setDraftMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`Message ${resolvedDriverName}`}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: uiTokens.radius.xl,
                  bgcolor: (theme) =>
                    theme.palette.mode === "light" ? "#F9FAFB" : "rgba(255,255,255,0.03)"
                }
              }}
            />
            <IconButton
              onClick={handleSend}
              aria-label="Send message"
              sx={{
                width: 40,
                height: 40,
                bgcolor: "#03CD8C",
                color: "#FFFFFF",
                "&:hover": {
                  bgcolor: "#16A34A"
                }
              }}
            >
              <SendRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Stack>
        </Box>
      </Box>
    </Dialog>
  );
}
