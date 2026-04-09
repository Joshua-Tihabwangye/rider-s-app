import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography
} from "@mui/material";

import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ContactPhoneRoundedIcon from "@mui/icons-material/ContactPhoneRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import PageHeader from "../components/PageHeader";
import ScreenScaffold from "../components/ScreenScaffold";

function SwitchRiderChooserScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const initialState = location.state || {};
  const [riderType, setRiderType] = useState("personal");

  const handleContinue = () => {
    if (riderType === "contact") {
      navigate("/rides/switch-rider/contact", {
        state: {
          ...initialState,
          riderType
        }
      });
      return;
    }

    if (riderType === "manual") {
      navigate("/rides/enter/details", {
        state: {
          ...initialState,
          bookForSomeone: true,
          fromSwitchRider: true
        }
      });
      return;
    }

    navigate("/rides/options", {
      state: {
        ...initialState,
        riderType: "personal"
      }
    });
  };

  return (
    <ScreenScaffold header={<PageHeader title="Switch Rider" subtitle="Choose who this ride is for" />}>
      <Card
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
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Typography
            variant="caption"
            sx={{ display: "block", mb: 1.2, fontSize: 11, color: (t) => t.palette.text.secondary }}
          >
            Rider type
          </Typography>
          <RadioGroup
            value={riderType}
            onChange={(e) => setRiderType(e.target.value)}
            sx={{ gap: 1 }}
          >
            <FormControlLabel
              value="personal"
              control={
                <Radio
                  icon={<CircleOutlinedIcon />}
                  checkedIcon={<CheckCircleRoundedIcon />}
                />
              }
              label={
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <PersonRoundedIcon sx={{ fontSize: 22 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Personal
                    </Typography>
                    <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                      Book this ride for yourself
                    </Typography>
                  </Box>
                </Stack>
              }
              sx={optionSx(riderType === "personal")}
            />
            <FormControlLabel
              value="contact"
              control={
                <Radio
                  icon={<CircleOutlinedIcon />}
                  checkedIcon={<CheckCircleRoundedIcon />}
                />
              }
              label={
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <ContactPhoneRoundedIcon sx={{ fontSize: 22 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Saved contact
                    </Typography>
                    <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                      Use an existing contact in your account
                    </Typography>
                  </Box>
                </Stack>
              }
              sx={optionSx(riderType === "contact")}
            />
            <FormControlLabel
              value="manual"
              control={
                <Radio
                  icon={<CircleOutlinedIcon />}
                  checkedIcon={<CheckCircleRoundedIcon />}
                />
              }
              label={
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <EditRoundedIcon sx={{ fontSize: 22 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Enter details manually
                    </Typography>
                    <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                      Add rider name and phone number
                    </Typography>
                  </Box>
                </Stack>
              }
              sx={optionSx(riderType === "manual")}
            />
          </RadioGroup>
        </CardContent>
      </Card>

      <Button
        fullWidth
        variant="contained"
        onClick={handleContinue}
        sx={{
          borderRadius: 5,
          py: 1.1,
          fontSize: 15,
          fontWeight: 600,
          textTransform: "none",
          bgcolor: "primary.main",
          color: "#020617",
          "&:hover": {
            bgcolor: "#06e29a"
          }
        }}
      >
        Continue
      </Button>
    </ScreenScaffold>
  );
}

function optionSx(isActive: boolean) {
  return {
    m: 0,
    p: 1.25,
    borderRadius: 2,
    border: isActive ? "1px solid #03CD8C" : "1px solid rgba(209,213,219,0.9)",
    bgcolor: isActive ? "rgba(3,205,140,0.1)" : "transparent",
    alignItems: "flex-start",
    "&:hover": {
      bgcolor: isActive ? "rgba(3,205,140,0.1)" : "rgba(148,163,184,0.1)"
    }
  };
}

export default function RiderScreen10SwitchRiderChooserCanvas_v2() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: (theme) => theme.palette.background.default
      }}
    >
      <SwitchRiderChooserScreen />
    </Box>
  );
}
