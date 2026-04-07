import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Avatar,
  Stack,
  Drawer
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

import { uiTokens } from "../design/tokens";

interface Passenger {
  id?: string | number;
  name?: string;
  initials?: string;
  dropOff?: string;
  dropoff?: string;
  fare?: string | number;
  fareContribution?: string | number;
  isMain?: boolean;
  rating?: number;
}

interface RideData {
  passengers?: Passenger[];
  mainPassenger?: Passenger;
  sharingPassengers?: Passenger[];
}

interface SharedPassengersModalProps {
  open: boolean;
  onClose: () => void;
  selectedRideData?: RideData | null;
}

function SharedPassengersModal({ open, onClose, selectedRideData }: SharedPassengersModalProps): React.JSX.Element | null {
  if (!selectedRideData) return null;

  // Separate main passenger from sharing passengers
  const mainPassenger = selectedRideData.passengers?.find(p => p.isMain) || selectedRideData.mainPassenger;
  const sharingPassengers = selectedRideData.passengers?.filter(p => !p.isMain) || selectedRideData.sharingPassengers || [];

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: uiTokens.radius.xl,
          borderTopRightRadius: uiTokens.radius.xl,
          maxHeight: "85vh",
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"
        }
      }}
      ModalProps={{
        keepMounted: false
      }}
    >
      <Box sx={{ px: uiTokens.spacing.xl, pt: uiTokens.spacing.md, pb: uiTokens.spacing.xxl }}>
        {/* Drag handle indicator - at the top */}
        <Box
          sx={{
            width: 40,
            height: 4,
            borderRadius: uiTokens.radius.pill,
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "#D1D5DB" : "#4B5563",
            mx: "auto",
            mb: uiTokens.spacing.xl
          }}
        />

        {/* Header with centered title and close button */}
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: uiTokens.spacing.xl
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              letterSpacing: "-0.01em",
              color: (theme) => theme.palette.text.primary,
              textAlign: "center"
            }}
          >
            Shared Passengers
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 0,
              bgcolor: (theme) =>
                theme.palette.mode === "light" ? "#F3F4F6" : "rgba(51,65,85,0.9)",
              "&:hover": {
                bgcolor: (theme) =>
                  theme.palette.mode === "light" ? "#E5E7EB" : "rgba(51,65,85,1)"
              }
            }}
          >
            <CloseRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        {/* Main Passenger Section */}
        {mainPassenger && (
          <Box sx={{ mb: uiTokens.spacing.xxl }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                mb: uiTokens.spacing.md,
                fontSize: 13,
                color: (theme) => theme.palette.text.primary
              }}
            >
              Main Passenger
            </Typography>
            <Card
              elevation={0}
              sx={{
                borderRadius: uiTokens.radius.xl,
                bgcolor: (theme) =>
                  theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
                border: (theme) =>
                  theme.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)",
                boxShadow: uiTokens.elevation.card
              }}
            >
              <CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.mdPlus }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.md }}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: "#2196F3",
                      fontSize: 18,
                      fontWeight: 600,
                      color: "#FFFFFF"
                    }}
                  >
                    {mainPassenger.initials || mainPassenger.name?.substring(0, 2).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        letterSpacing: "-0.01em",
                        mb: uiTokens.spacing.xxs,
                        color: (theme) => theme.palette.text.primary
                      }}
                    >
                      {mainPassenger.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.xxs, mb: uiTokens.spacing.xxs }}>
                      <PlaceRoundedIcon
                        sx={{ fontSize: 14, color: (theme) => theme.palette.text.secondary }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: 12,
                          color: (theme) => theme.palette.text.secondary
                        }}
                      >
                        {mainPassenger.dropOff || mainPassenger.dropoff}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: "#22c55e"
                      }}
                    >
                      UGX {mainPassenger.fare || mainPassenger.fareContribution}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Sharing Passengers Section */}
        {sharingPassengers.length > 0 && (
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                mb: uiTokens.spacing.md,
                fontSize: 13,
                color: (theme) => theme.palette.text.primary
              }}
            >
              Sharing Passengers
            </Typography>
            <Stack spacing={uiTokens.spacing.mdPlus}>
              {sharingPassengers.map((passenger) => (
                <Card
                  key={passenger.id || passenger.name}
                  elevation={0}
                  sx={{
                    borderRadius: uiTokens.radius.xl,
                    bgcolor: (theme) =>
                      theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
                    border: (theme) =>
                      theme.palette.mode === "light"
                        ? "1px solid rgba(209,213,219,0.9)"
                        : "1px solid rgba(51,65,85,0.9)",
                    boxShadow: uiTokens.elevation.card
                  }}
                >
                  <CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.mdPlus }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.md }}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: "rgba(15,23,42,0.9)",
                          fontSize: 18,
                          fontWeight: 600,
                          color: "#FFFFFF"
                        }}
                      >
                        {passenger.initials || passenger.name?.substring(0, 2).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.xs, mb: uiTokens.spacing.xxs }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              letterSpacing: "-0.01em",
                              color: (theme) => theme.palette.text.primary
                            }}
                          >
                            {passenger.name}
                          </Typography>
                          {passenger.rating && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.xxs }}>
                              <StarRoundedIcon sx={{ fontSize: 14, color: "#FFC107" }} />
                              <Typography
                                variant="caption"
                                sx={{
                                  fontSize: 11,
                                  fontWeight: 600,
                                  color: (theme) => theme.palette.text.primary
                                }}
                              >
                                {passenger.rating}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.xxs, mb: uiTokens.spacing.xxs }}>
                          <PlaceRoundedIcon
                            sx={{ fontSize: 14, color: (theme) => theme.palette.text.secondary }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: 12,
                              color: (theme) => theme.palette.text.secondary
                            }}
                          >
                            {passenger.dropOff || passenger.dropoff}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            fontSize: 14,
                            color: "#22c55e"
                          }}
                        >
                          UGX {passenger.fare || passenger.fareContribution}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        )}

        {sharingPassengers.length === 0 && !mainPassenger && (
          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              color: (theme) => theme.palette.text.secondary,
              py: uiTokens.spacing.xxl
            }}
          >
            No shared passengers for this ride
          </Typography>
        )}
      </Box>
    </Drawer>
  );
}

export default SharedPassengersModal;

