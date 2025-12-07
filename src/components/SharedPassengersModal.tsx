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
  rideData?: RideData | null;
}

function SharedPassengersModal({ open, onClose, rideData }: SharedPassengersModalProps): React.JSX.Element | null {
  if (!rideData) return null;

  // Separate main passenger from sharing passengers
  const mainPassenger = rideData.passengers?.find(p => p.isMain) || rideData.mainPassenger;
  const sharingPassengers = rideData.passengers?.filter(p => !p.isMain) || rideData.sharingPassengers || [];

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          maxHeight: "85vh",
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"
        }
      }}
      ModalProps={{
        keepMounted: false
      }}
    >
      <Box sx={{ px: 2.5, pt: 1.5, pb: 3 }}>
        {/* Drag handle indicator - at the top */}
        <Box
          sx={{
            width: 40,
            height: 4,
            borderRadius: 2,
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "#D1D5DB" : "#4B5563",
            mx: "auto",
            mb: 2.5
          }}
        />

        {/* Header with centered title and close button */}
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2.5
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
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                mb: 1.5,
                fontSize: 13,
                color: (theme) => theme.palette.text.primary
              }}
            >
              Main Passenger
            </Typography>
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                bgcolor: (theme) =>
                  theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
                border: (theme) =>
                  theme.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
              }}
            >
              <CardContent sx={{ px: 2, py: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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
                        mb: 0.5,
                        color: (theme) => theme.palette.text.primary
                      }}
                    >
                      {mainPassenger.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
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
                mb: 1.5,
                fontSize: 13,
                color: (theme) => theme.palette.text.primary
              }}
            >
              Sharing Passengers
            </Typography>
            <Stack spacing={1.5}>
              {sharingPassengers.map((passenger) => (
                <Card
                  key={passenger.id || passenger.name}
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    bgcolor: (theme) =>
                      theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
                    border: (theme) =>
                      theme.palette.mode === "light"
                        ? "1px solid rgba(209,213,219,0.9)"
                        : "1px solid rgba(51,65,85,0.9)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                  }}
                >
                  <CardContent sx={{ px: 2, py: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.5 }}>
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
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
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
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
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
              py: 4
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

