import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  IconButton,
  Select,
  MenuItem,
  Stack,
  TextField,
  Typography,
  InputAdornment
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import BusinessCenterRoundedIcon from "@mui/icons-material/BusinessCenterRounded";
import FamilyRestroomRoundedIcon from "@mui/icons-material/FamilyRestroomRounded";
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import LuggageRoundedIcon from "@mui/icons-material/LuggageRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import AcUnitRoundedIcon from "@mui/icons-material/AcUnitRounded";
import ChildCareRoundedIcon from "@mui/icons-material/ChildCareRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import { useAppData } from "../contexts/AppDataContext";
import { GradientActionButton, cardSx, rentalUi, screenShellSx } from "../components/rental/RentalRedesignUI";

const purposes = [
  { key: "business", label: "Business", icon: <BusinessCenterRoundedIcon /> },
  { key: "family", label: "Family", icon: <FamilyRestroomRoundedIcon /> },
  { key: "airport", label: "Airport", icon: <FlightTakeoffRoundedIcon /> },
  { key: "wedding", label: "Wedding", icon: <FavoriteBorderRoundedIcon /> },
  { key: "tour", label: "Tour", icon: <MapRoundedIcon /> }
] as const;

interface PreferenceRowProps {
  label: string;
  helper: string;
  icon: React.ReactNode;
  checked: boolean;
  onToggle: () => void;
}

function PreferenceRow({ label, helper, icon, checked, onToggle }: PreferenceRowProps): React.JSX.Element {
  return (
    <Card sx={{ ...cardSx, borderRadius: 1.9 }}>
      <CardContent sx={{ p: 1.05, pr: 1.2, "&:last-child": { pb: 1.05 } }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={0.9}>
          <Stack direction="row" spacing={0.8} alignItems="flex-start" sx={{ minWidth: 0, flex: 1 }}>
            <Box sx={{ color: checked ? rentalUi.green : rentalUi.muted, mt: 0.05 }}>
              {icon}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  lineHeight: 1.2,
                  whiteSpace: "normal",
                  wordBreak: "normal",
                  overflowWrap: "normal"
                }}
              >
                {label}
              </Typography>
              <Typography sx={{ fontSize: 10, color: rentalUi.muted, mt: 0.35 }}>{helper}</Typography>
            </Box>
          </Stack>
          <Checkbox
            checked={checked}
            onChange={onToggle}
            sx={{
              color: rentalUi.green,
              p: 0,
              mt: 0.1,
              ml: 0.6,
              flexShrink: 0,
              width: 20,
              height: 20,
              "& .MuiSvgIcon-root": { fontSize: 18 }
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function RentalCustom(): React.JSX.Element {
  const navigate = useNavigate();
  const { actions } = useAppData();

  const [mode, setMode] = useState<"self_drive" | "chauffeur">("self_drive");
  const [purpose, setPurpose] = useState("family");
  const [passengers, setPassengers] = useState("4");
  const [luggageKg, setLuggageKg] = useState("20");
  const [duration, setDuration] = useState("1");
  const [instructions, setInstructions] = useState("");
  const [budgetMin, setBudgetMin] = useState("2000");
  const [budgetMax, setBudgetMax] = useState("5000");
  const [budgetUnit, setBudgetUnit] = useState<"per day" | "per trip">("per day");

  const [ac, setAc] = useState(true);
  const [childSeat, setChildSeat] = useState(false);
  const [extraLuggage, setExtraLuggage] = useState(false);
  const [premium, setPremium] = useState(false);
  const [driverLanguage, setDriverLanguage] = useState(false);

  const safetyText = useMemo(
    () => "Best matching vehicles  •  Transparent pricing  •  No hidden charges",
    []
  );

  return (
    <Box sx={screenShellSx}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.4 }}>
        <Stack direction="row" spacing={1.4} alignItems="center">
          <IconButton
            onClick={() => navigate(-1)}
            sx={{ border: `1px solid ${rentalUi.border}`, bgcolor: "#fff", width: 50, height: 50 }}
          >
            <ArrowBackRoundedIcon />
          </IconButton>
          <Box>
            <Typography sx={{ fontSize: 52/2, fontWeight: 800, lineHeight: 1.08 }}>Custom rental</Typography>
            <Typography sx={{ fontSize: 17, color: rentalUi.muted }}>Build your perfect trip</Typography>
          </Box>
        </Stack>
        <Typography sx={{ color: rentalUi.green, fontWeight: 800, fontSize: 25 }}>EVzone</Typography>
      </Stack>

      <Card sx={{ ...cardSx, mb: 2.1 }}>
        <CardContent sx={{ p: 1.15, "&:last-child": { pb: 1.15 } }}>
          <Stack direction="row" spacing={1}>
            <Chip
              icon={<DirectionsCarRoundedIcon />}
              label="Self-drive"
              onClick={() => setMode("self_drive")}
              sx={{
                flex: 1,
                borderRadius: 2.3,
                height: 58,
                fontSize: 18,
                bgcolor: mode === "self_drive" ? rentalUi.greenSoft : "#fff",
                color: mode === "self_drive" ? rentalUi.greenDeep : rentalUi.title,
                border: `1px solid ${mode === "self_drive" ? rentalUi.green : rentalUi.border}`
              }}
            />
            <Chip
              icon={<SupportAgentRoundedIcon />}
              label="Chauffeur"
              onClick={() => setMode("chauffeur")}
              sx={{
                flex: 1,
                borderRadius: 2.3,
                height: 58,
                fontSize: 18,
                bgcolor: mode === "chauffeur" ? rentalUi.greenSoft : "#fff",
                color: mode === "chauffeur" ? rentalUi.greenDeep : rentalUi.title,
                border: `1px solid ${mode === "chauffeur" ? rentalUi.green : rentalUi.border}`
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 1 }}>Trip purpose</Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 0.8, mb: 1.8 }}>
        {purposes.map((item) => {
          const selected = item.key === purpose;
          return (
            <Card
              key={item.key}
              onClick={() => setPurpose(item.key)}
              sx={{
                ...cardSx,
                cursor: "pointer",
                bgcolor: selected ? rentalUi.greenSoft : "#fff",
                borderColor: selected ? "rgba(17,184,106,0.45)" : rentalUi.border
              }}
            >
              <CardContent sx={{ p: 0.85, textAlign: "center", "&:last-child": { pb: 0.85 } }}>
                <Box
                  sx={{
                    color: selected ? rentalUi.green : rentalUi.muted,
                    display: "grid",
                    placeItems: "center",
                    "& .MuiSvgIcon-root": { fontSize: 21 }
                  }}
                >
                  {item.icon}
                </Box>
                <Typography
                  sx={{
                    fontSize: "10.5px !important",
                    fontWeight: 600,
                    mt: 0.25,
                    lineHeight: 1.1,
                    whiteSpace: "nowrap"
                  }}
                >
                  {item.label}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <Card sx={{ ...cardSx, mb: 2.1 }}>
        <CardContent sx={{ p: 1.3, "&:last-child": { pb: 1.3 } }}>
          <Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
            <Box sx={{ flex: 1, px: 1.05 }}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <PersonOutlineRoundedIcon sx={{ color: rentalUi.green, fontSize: 18 }} />
                <Typography sx={{ color: rentalUi.muted, fontSize: 12.5, fontWeight: 500 }}>Passengers</Typography>
              </Stack>
              <TextField
                select
                value={passengers}
                onChange={(event) => setPassengers(event.target.value)}
                variant="standard"
                sx={{
                  mt: 0.45,
                  width: "100%",
                  "& .MuiInputBase-input": { fontSize: 15.5, fontWeight: 600, lineHeight: 1.2, py: 0.25 }
                }}
              >
                {["2", "3", "4", "5", "6", "7"].map((value) => (
                  <MenuItem key={value} value={value}>{value} people</MenuItem>
                ))}
              </TextField>
            </Box>

            <Box sx={{ flex: 1, px: 1.05 }}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <LuggageRoundedIcon sx={{ color: rentalUi.green, fontSize: 18 }} />
                <Typography sx={{ color: rentalUi.muted, fontSize: 12.5, fontWeight: 500 }}>Luggage</Typography>
              </Stack>
              <TextField
                type="number"
                value={luggageKg}
                onChange={(event) => setLuggageKg(event.target.value.replace(/[^\d]/g, ""))}
                variant="standard"
                inputProps={{ min: 1, max: 200 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" sx={{ color: rentalUi.muted, fontSize: 12 }}>
                      kg
                    </InputAdornment>
                  )
                }}
                sx={{
                  mt: 0.45,
                  width: "100%",
                  "& .MuiInputBase-input": { fontSize: 15.5, fontWeight: 600, lineHeight: 1.2, py: 0.25 }
                }}
              />
            </Box>

            <Box sx={{ flex: 1, px: 1.05 }}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <CalendarTodayRoundedIcon sx={{ color: rentalUi.green, fontSize: 18 }} />
                <Typography sx={{ color: rentalUi.muted, fontSize: 12.5, fontWeight: 500 }}>Duration</Typography>
              </Stack>
              <TextField
                type="number"
                value={duration}
                onChange={(event) => setDuration(event.target.value.replace(/[^\d]/g, ""))}
                variant="standard"
                inputProps={{ min: 1, max: 365 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" sx={{ color: rentalUi.muted, fontSize: 12 }}>
                      day(s)
                    </InputAdornment>
                  )
                }}
                sx={{
                  mt: 0.45,
                  width: "100%",
                  "& .MuiInputBase-input": { fontSize: 15.5, fontWeight: 600, lineHeight: 1.2, py: 0.25 }
                }}
              />
              <Typography sx={{ mt: 0.8, fontSize: 12, color: rentalUi.muted, fontWeight: 500, whiteSpace: "nowrap" }}>
                Pick-up  →  Drop-off
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 1 }}>
        Preferences <Typography component="span" sx={{ color: rentalUi.muted, fontSize: 11, fontWeight: 500 }}>(optional)</Typography>
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 0.8, mb: 0.8 }}>
        <PreferenceRow label="AC" helper="Required" icon={<AcUnitRoundedIcon sx={{ fontSize: 20 }} />} checked={ac} onToggle={() => setAc((prev) => !prev)} />
        <PreferenceRow label="Child seat" helper="Add if needed" icon={<ChildCareRoundedIcon sx={{ fontSize: 20 }} />} checked={childSeat} onToggle={() => setChildSeat((prev) => !prev)} />
        <PreferenceRow label="Extra luggage" helper="More space" icon={<LuggageRoundedIcon sx={{ fontSize: 20 }} />} checked={extraLuggage} onToggle={() => setExtraLuggage((prev) => !prev)} />
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 0.8, mb: 2 }}>
        <PreferenceRow label="Premium" helper="Luxury vehicles" icon={<StarBorderRoundedIcon sx={{ fontSize: 20 }} />} checked={premium} onToggle={() => setPremium((prev) => !prev)} />
        <PreferenceRow label="Driver language" helper="Select language" icon={<TranslateRoundedIcon sx={{ fontSize: 20 }} />} checked={driverLanguage} onToggle={() => setDriverLanguage((prev) => !prev)} />
      </Box>

      <Card sx={{ ...cardSx, mb: 1.7 }}>
        <CardContent sx={{ p: 1.4, "&:last-child": { pb: 1.4 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
            <Typography sx={{ fontSize: 21/1.2, fontWeight: 700 }}>
              Special instructions <Box component="span" sx={{ color: rentalUi.muted, fontWeight: 500 }}>(optional)</Box>
            </Typography>
            <EditRoundedIcon sx={{ color: rentalUi.muted }} />
          </Stack>
          <TextField
            value={instructions}
            onChange={(event) => setInstructions(event.target.value)}
            placeholder="Any special requests or notes for your trip..."
            multiline
            minRows={2.5}
            fullWidth
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.1 } }}
          />
        </CardContent>
      </Card>

      <Card sx={{ ...cardSx, borderColor: "#F6D8BA", bgcolor: "#FFFBF5", mb: 1.6 }}>
        <CardContent sx={{ p: 1.4, "&:last-child": { pb: 1.4 } }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 44, height: 44, borderRadius: "50%", bgcolor: rentalUi.orangeSoft, display: "grid", placeItems: "center", color: rentalUi.orange }}>
                <CurrencyRupeeRoundedIcon />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 13 }}>
                  Budget / Price range <Box component="span" sx={{ color: rentalUi.muted, fontWeight: 500 }}>(optional)</Box>
                </Typography>
                <Typography sx={{ color: rentalUi.muted, fontSize: 11 }}>Set your preferred price range</Typography>
              </Box>
            </Stack>

            <Stack spacing={0.7} alignItems="flex-end">
              <Typography sx={{ color: rentalUi.greenDeep, fontWeight: 800, fontSize: 16, lineHeight: 1.1 }}>
                ₹ {(Number(budgetMin || 0)).toLocaleString("en-IN")} - ₹ {(Number(budgetMax || 0)).toLocaleString("en-IN")}
              </Typography>
              <FormControl size="small" sx={{ minWidth: 88 }}>
                <Select
                  value={budgetUnit}
                  onChange={(event) => setBudgetUnit(event.target.value as "per day" | "per trip")}
                  sx={{
                    height: 28,
                    borderRadius: 99,
                    bgcolor: "#EFF8F2",
                    color: rentalUi.greenDeep,
                    fontSize: 11.5,
                    fontWeight: 600,
                    "& .MuiSelect-select": { py: 0.35, px: 1.15 },
                    "& fieldset": { borderColor: "#D3EADB" }
                  }}
                >
                  <MenuItem value="per day">per day</MenuItem>
                  <MenuItem value="per trip">per trip</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ ...cardSx, borderRadius: 99, bgcolor: "#EEF8F1", mb: 1.85 }}>
        <CardContent sx={{ py: 0.75, px: 1.3, "&:last-child": { pb: 0.75 } }}>
          <Stack direction="row" spacing={0.7} alignItems="center" justifyContent="center">
            <CheckCircleRoundedIcon sx={{ color: rentalUi.green, fontSize: 20 }} />
            <Typography sx={{ fontSize: 16, color: rentalUi.muted }}>{safetyText}</Typography>
          </Stack>
        </CardContent>
      </Card>

      <GradientActionButton
        label="Find vehicles"
        onClick={() => {
          const durationDays = Math.max(1, Number(duration) || 1);
          actions.updateRentalBooking({
            rentalMode: mode,
            startDate: "2025-05-14 10:00",
            endDate: `2025-05-${String(14 + durationDays).padStart(2, "0")} 10:00`
          });
          navigate("/rental/list", { state: { mode: mode === "self_drive" ? "self" : "chauffeur" } });
        }}
      />
    </Box>
  );
}
