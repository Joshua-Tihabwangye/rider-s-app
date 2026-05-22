import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Typography,
  Button,
  Modal,
  Backdrop,
  Fade,
  Paper,
  Card,
  CardContent,
  Stack,
  Alert,
  TextField
} from "@mui/material";

import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";

interface TripTypeModalProps {
  open: boolean;
  onClose: () => void;
  currentTripType?: string;
  onSelect?: (data: {
    tripType: string;
    returnDate: string | null;
    returnTime: string | null;
    returnDateTime: string | null;
  }) => void;
  departureDate?: Date | string;
  departureTime?: string;
  existingReturnDate?: string;
  existingReturnTime?: string;
}

function toDateTimeLocalValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function getDefaultReturnDateTimeValue(): string {
  const next = new Date();
  next.setDate(next.getDate() + 1);
  const rounded = Math.ceil(next.getMinutes() / 5) * 5;
  if (rounded >= 60) {
    next.setHours(next.getHours() + 1, 0, 0, 0);
  } else {
    next.setMinutes(rounded, 0, 0);
  }
  return toDateTimeLocalValue(next);
}

function parseExistingReturnDateTime(existingReturnDate?: string, existingReturnTime?: string): string | null {
  if (!existingReturnDate || !existingReturnTime) {
    return null;
  }

  const dateMatch = existingReturnDate.match(/(\w+),\s*(\d{1,2})\s*(\w+)\s*(\d{4})/);
  const timeMatch = existingReturnTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!dateMatch || !timeMatch) {
    return null;
  }

  const monthMap: Record<string, number> = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11
  };

  const day = Number.parseInt(dateMatch[2] ?? "", 10);
  const monthIndex = monthMap[dateMatch[3] ?? ""];
  const year = Number.parseInt(dateMatch[4] ?? "", 10);
  const hour12 = Number.parseInt(timeMatch[1] ?? "", 10);
  const minute = Number.parseInt(timeMatch[2] ?? "", 10);
  const period = (timeMatch[3] ?? "").toUpperCase();

  if (!Number.isFinite(day) || !Number.isFinite(year) || !Number.isFinite(hour12) || !Number.isFinite(minute) || monthIndex === undefined) {
    return null;
  }

  const hour24 = period === "PM" && hour12 !== 12 ? hour12 + 12 : period === "AM" && hour12 === 12 ? 0 : hour12;
  const date = new Date(year, monthIndex, day, hour24, minute, 0, 0);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return toDateTimeLocalValue(date);
}

function parseDepartureDateTime(departureDate?: Date | string, departureTime?: string): Date {
  if (!departureDate) {
    return new Date();
  }

  const baseDate = departureDate instanceof Date ? new Date(departureDate) : new Date(departureDate);
  if (Number.isNaN(baseDate.getTime())) {
    return new Date();
  }

  if (!departureTime) {
    return baseDate;
  }

  const timeMatch = departureTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!timeMatch) {
    return baseDate;
  }

  const hour12 = Number.parseInt(timeMatch[1] ?? "", 10);
  const minute = Number.parseInt(timeMatch[2] ?? "", 10);
  const period = (timeMatch[3] ?? "").toUpperCase();
  if (!Number.isFinite(hour12) || !Number.isFinite(minute)) {
    return baseDate;
  }

  const hour24 = period === "PM" && hour12 !== 12 ? hour12 + 12 : period === "AM" && hour12 === 12 ? 0 : hour12;
  baseDate.setHours(hour24, minute, 0, 0);
  return baseDate;
}

function formatReturnDateLabel(date: Date): string {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${dayNames[date.getDay()]}, ${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

function formatReturnTimeLabel(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

function TripTypeModal({
  open,
  onClose,
  currentTripType,
  onSelect,
  departureDate,
  departureTime,
  existingReturnDate,
  existingReturnTime
}: TripTypeModalProps): React.JSX.Element {
  const theme = useTheme();

  const [selectedTripType, setSelectedTripType] = useState<string>(currentTripType || "One Way");
  const [returnDateTimeValue, setReturnDateTimeValue] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");

  useEffect(() => {
    if (!open) {
      setValidationError("");
      return;
    }

    const tripType = currentTripType || "One Way";
    setSelectedTripType(tripType);

    if (tripType === "Round Trip") {
      const restored = parseExistingReturnDateTime(existingReturnDate, existingReturnTime);
      setReturnDateTimeValue(restored ?? getDefaultReturnDateTimeValue());
      return;
    }

    setReturnDateTimeValue("");
  }, [currentTripType, existingReturnDate, existingReturnTime, open]);

  const accentGreen = "#03CD8C";
  const contentBg = theme.palette.mode === "light" ? "#FFFFFF" : theme.palette.background.paper;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const validateReturnDateTime = (): boolean => {
    if (selectedTripType !== "Round Trip") {
      return true;
    }

    if (!returnDateTimeValue) {
      setValidationError("Please select return date and time.");
      return false;
    }

    const returnDateTime = new Date(returnDateTimeValue);
    if (Number.isNaN(returnDateTime.getTime())) {
      setValidationError("Please enter a valid return date and time.");
      return false;
    }

    const departureDateTime = parseDepartureDateTime(departureDate, departureTime);
    if (returnDateTime <= departureDateTime) {
      setValidationError("Return date and time must be after departure.");
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleConfirm = (): void => {
    if (selectedTripType === "Round Trip") {
      if (!validateReturnDateTime()) {
        return;
      }

      const returnDateTime = new Date(returnDateTimeValue);
      if (Number.isNaN(returnDateTime.getTime())) {
        setValidationError("Please enter a valid return date and time.");
        return;
      }

      onSelect?.({
        tripType: selectedTripType,
        returnDate: formatReturnDateLabel(returnDateTime),
        returnTime: formatReturnTimeLabel(returnDateTime),
        returnDateTime: returnDateTime.toISOString()
      });
      onClose();
      return;
    }

    onSelect?.({
      tripType: selectedTripType,
      returnDate: null,
      returnTime: null,
      returnDateTime: null
    });
    onClose();
  };

  const canConfirm = selectedTripType === "One Way" || Boolean(returnDateTimeValue);
  const minimumReturnDateTime = toDateTimeLocalValue(parseDepartureDateTime(departureDate, departureTime));

  const tripTypeOptions = [
    { value: "One Way", label: "One Way" },
    { value: "Round Trip", label: "Round Trip" }
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 300,
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.5)"
        }
      }}
      onClick={handleBackdropClick}
    >
      <Fade in={open}>
        <Paper
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            bgcolor: contentBg,
            maxHeight: "90vh",
            overflow: "auto",
            outline: "none"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: theme.palette.text.primary,
                mb: 3,
                textAlign: "center"
              }}
            >
              Ride Type
            </Typography>

            <Stack spacing={2} sx={{ mb: 3 }}>
              {tripTypeOptions.map((option) => {
                const isSelected = selectedTripType === option.value;
                return (
                  <Card
                    key={option.value}
                    elevation={0}
                    onClick={() => {
                      setSelectedTripType(option.value);
                      setValidationError("");
                      if (option.value === "Round Trip" && !returnDateTimeValue) {
                        setReturnDateTimeValue(getDefaultReturnDateTimeValue());
                      }
                      if (option.value === "One Way") {
                        setReturnDateTimeValue("");
                      }
                    }}
                    sx={{
                      borderRadius: 2,
                      bgcolor: contentBg,
                      border: isSelected
                        ? "2px solid #03CD8C"
                        : theme.palette.mode === "light"
                          ? "1px solid rgba(0,0,0,0.15)"
                          : "1px solid rgba(255,255,255,0.2)",
                      cursor: "pointer",
                      opacity: isSelected ? 1 : 0.6,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: theme.palette.mode === "light" ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.02)",
                        borderColor: accentGreen
                      }
                    }}
                  >
                    <CardContent sx={{ px: 2, py: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <DirectionsCarRoundedIcon
                          sx={{
                            fontSize: 24,
                            color: isSelected ? accentGreen : theme.palette.text.secondary
                          }}
                        />
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: isSelected ? 600 : 500,
                            color: isSelected ? theme.palette.text.primary : theme.palette.text.secondary
                          }}
                        >
                          {option.label}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>

            {selectedTripType === "Round Trip" && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: theme.palette.text.primary
                  }}
                >
                  Return Trip
                </Typography>

                {validationError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {validationError}
                  </Alert>
                )}

                <Stack spacing={1.2}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarTodayRoundedIcon sx={{ fontSize: 18, color: accentGreen }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                      Return date & time
                    </Typography>
                  </Box>

                  <TextField
                    fullWidth
                    type="datetime-local"
                    value={returnDateTimeValue}
                    onChange={(event) => {
                      setReturnDateTimeValue(event.target.value);
                      setValidationError("");
                    }}
                    inputProps={{ min: minimumReturnDateTime }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2
                      }
                    }}
                    helperText="Pick when the return leg should start."
                  />

                  {returnDateTimeValue && !Number.isNaN(new Date(returnDateTimeValue).getTime()) && (
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      Return trip: {formatReturnDateLabel(new Date(returnDateTimeValue))} • {formatReturnTimeLabel(new Date(returnDateTimeValue))}
                    </Typography>
                  )}
                </Stack>
              </Box>
            )}

            <Button
              fullWidth
              variant="contained"
              onClick={handleConfirm}
              disabled={!canConfirm}
              sx={{
                borderRadius: 2,
                py: 1.5,
                fontSize: 16,
                fontWeight: 600,
                textTransform: "none",
                bgcolor: canConfirm ? "#000000" : "rgba(0,0,0,0.2)",
                color: "#FFFFFF",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: canConfirm ? "#333333" : "rgba(0,0,0,0.3)",
                  boxShadow: "none"
                },
                "&.Mui-disabled": {
                  bgcolor: "rgba(0,0,0,0.2)",
                  color: "#FFFFFF",
                  opacity: 1
                }
              }}
            >
              {selectedTripType === "Round Trip" ? "Confirm" : "Continue"}
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Modal>
  );
}

export default TripTypeModal;
