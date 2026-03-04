import React, { useState } from "react";
import { Box, Typography, IconButton, Avatar, TextField, InputAdornment, Paper } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "../components/DarkModeToggle";
import MobileShell from "../components/MobileShell";

const INITIAL_MESSAGES = [
  { id: 1, text: "Hello! I am near the pickup point.", sender: "driver", time: "14:05" },
  { id: 2, text: "Okay, I'll be there in 2 minutes.", sender: "user", time: "14:06" },
  { id: 3, text: "Great, I'm in a Silver Tesla.", sender: "driver", time: "14:06" }
];

function ChatScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
    setInputValue("");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5, borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
        <IconButton size="small" onClick={() => navigate(-1)}>
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <Avatar sx={{ bgcolor: "primary.main", color: "#020617", width: 36, height: 36, fontWeight: 700 }}>TS</Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Tim Smith</Typography>
          <Typography variant="caption" color="text.secondary">Typical reply: 1 min</Typography>
        </Box>
        <IconButton size="small" sx={{ color: "primary.main" }}>
          <PhoneRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      {/* Messages */}
      <Box sx={{ flex: 1, p: 2, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%"
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                borderRadius: msg.sender === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                bgcolor: msg.sender === "user" ? "primary.main" : (theme) => 
                  theme.palette.mode === "light" ? "#F3F4F6" : "#1E293B",
                color: msg.sender === "user" ? "#020617" : "text.primary"
              }}
            >
              <Typography variant="body2">{msg.text}</Typography>
            </Paper>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block", textAlign: msg.sender === "user" ? "right" : "left" }}>
              {msg.time}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Input */}
      <Box sx={{ p: 2, borderTop: "1px solid rgba(0,0,0,0.05)" }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleSend} disabled={!inputValue.trim()}>
                  <SendRoundedIcon sx={{ color: inputValue.trim() ? "primary.main" : "text.disabled" }} />
                </IconButton>
              </InputAdornment>
            ),
            sx: { borderRadius: 999 }
          }}
        />
      </Box>
    </Box>
  );
}

export default function Chat() {
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <DarkModeToggle />
      <MobileShell>
        <ChatScreen />
      </MobileShell>
    </Box>
  );
}
