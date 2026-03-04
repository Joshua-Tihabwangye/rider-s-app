import React from "react";
import { Box, Typography, IconButton, List, ListItem, ListItemAvatar, ListItemText, Avatar, Divider } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "../components/DarkModeToggle";
import MobileShell from "../components/MobileShell";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";

const MOCK_TRANSACTIONS = [
  {
    id: "TX-1001",
    title: "Ride to Ndeeba",
    date: "Today, 14:32",
    amount: "-12,500",
    type: "out",
    category: "ride"
  },
  {
    id: "TX-1002",
    title: "Wallet Recharge",
    date: "Today, 10:00",
    amount: "+50,000",
    type: "in",
    category: "topup"
  },
  {
    id: "TX-1003",
    title: "Grocery Delivery",
    date: "Yesterday",
    amount: "-8,200",
    type: "out",
    category: "delivery"
  },
  {
    id: "TX-1004",
    title: "Refund: Trip Cancelled",
    date: "Yesterday",
    amount: "+15,000",
    type: "in",
    category: "refund"
  }
];

function WalletTransactionsScreen(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 0 }}>
      <Box sx={{ p: 2.5, display: "flex", alignItems: "center", gap: 1.5 }}>
        <IconButton
          size="small"
          onClick={() => navigate(-1)}
          sx={{
            bgcolor: "rgba(0,0,0,0.05)",
            "&:hover": { bgcolor: "rgba(0,0,0,0.1)" }
          }}
        >
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Transactions
        </Typography>
      </Box>

      <List sx={{ p: 0 }}>
        {MOCK_TRANSACTIONS.map((tx, index) => (
          <React.Fragment key={tx.id}>
            <ListItem
              sx={{
                py: 2.2,
                px: 2.5,
                "&:hover": { bgcolor: "rgba(0,0,0,0.02)" }
              }}
            >
              <ListItemAvatar sx={{ minWidth: 56 }}>
                <Avatar sx={{ bgcolor: tx.type === "in" ? "rgba(34,197,94,0.1)" : "rgba(244,63,94,0.1)" }}>
                  {tx.type === "in" ? (
                    <AddRoundedIcon sx={{ color: "#16A34A", fontSize: 20 }} />
                  ) : (
                    <RemoveRoundedIcon sx={{ color: "#DC2626", fontSize: 20 }} />
                  )}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      {tx.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 700, 
                        color: tx.type === "in" ? "#16A34A" : "text.primary" 
                      }}
                    >
                      {tx.type === "in" ? "+" : ""}{tx.amount}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {tx.date}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontSize: 10 }}>
                      ID: {tx.id}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            {index < MOCK_TRANSACTIONS.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>

      <Box sx={{ p: 4, textAlign: "center" }}>
        <ReceiptRoundedIcon sx={{ fontSize: 48, color: "rgba(0,0,0,0.1)", mb: 1 }} />
        <Typography variant="caption" color="text.secondary">
          Showing transactions for the last 30 days
        </Typography>
      </Box>
    </Box>
  );
}

export default function WalletTransactions() {
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <DarkModeToggle />
      <MobileShell>
        <WalletTransactionsScreen />
      </MobileShell>
    </Box>
  );
}
