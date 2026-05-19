import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import LocalTaxiOutlinedIcon from "@mui/icons-material/LocalTaxiOutlined";
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";

import { useAppData } from "../contexts/AppDataContext";
import {
  GradientActionButton,
  cardSx,
  rentalUi,
  screenShellSx
} from "../components/rental/RentalRedesignUI";
import MapShell from "../components/maps/MapShell";
import ExpandableMapPanel from "../components/maps/ExpandableMapPanel";

interface BranchOption {
  id: string;
  name: string;
  address: string;
  distance: string;
  hours: string;
  vehicles: number;
  mapPoint: { lat: number; lng: number };
}

const branches: BranchOption[] = [
  {
    id: "koramangala",
    name: "EVzone Koramangala",
    address: "16, 5th Cross, 80 Feet Road, Koramangala, Bengaluru 560095",
    distance: "1.8 km away",
    hours: "7:00 AM - 10:00 PM",
    vehicles: 18,
    mapPoint: { lat: 12.9352, lng: 77.6245 }
  },
  {
    id: "airport_t1",
    name: "EVzone Airport T1",
    address: "Kempegowda International Airport, Terminal 1, Bengaluru 562300",
    distance: "22.4 km away",
    hours: "24x7",
    vehicles: 22,
    mapPoint: { lat: 13.1986, lng: 77.7066 }
  },
  {
    id: "mg_road",
    name: "EVzone MG Road",
    address: "45, MG Road, Near Trinity Circle, Bengaluru 560001",
    distance: "4.2 km away",
    hours: "7:00 AM - 10:00 PM",
    vehicles: 12,
    mapPoint: { lat: 12.9757, lng: 77.6069 }
  },
  {
    id: "whitefield",
    name: "EVzone Whitefield",
    address: "Ground Floor, VR Bengaluru, Whitefield Main Road, Bengaluru 560066",
    distance: "17.6 km away",
    hours: "7:00 AM - 10:00 PM",
    vehicles: 16,
    mapPoint: { lat: 12.9698, lng: 77.7499 }
  }
];

function BranchCard({
  branch,
  selected,
  onSelect
}: {
  branch: BranchOption;
  selected: boolean;
  onSelect: () => void;
}): React.JSX.Element {
  return (
    <Card
      onClick={onSelect}
      sx={{
        ...cardSx,
        cursor: "pointer",
        borderColor: selected ? rentalUi.green : rentalUi.border,
        borderWidth: selected ? 2 : 1
      }}
    >
      <CardContent sx={{ p: 1.45, "&:last-child": { pb: 1.45 } }}>
        <Stack direction="row" spacing={1.1}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              border: `2px solid ${selected ? rentalUi.green : "#C8D0DC"}`,
              display: "grid",
              placeItems: "center",
              mt: 0.25
            }}
          >
            {selected ? <Box sx={{ width: 20, height: 20, borderRadius: "50%", bgcolor: rentalUi.green }} /> : null}
          </Box>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={0.6}>
              <Box>
                <Typography sx={{ fontSize: 36/2, fontWeight: 800 }}>{branch.name}</Typography>
                <Typography sx={{ fontSize: 16.5, color: rentalUi.muted, lineHeight: 1.3 }}>{branch.address}</Typography>
              </Box>

              <Stack spacing={0.45}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <AccessTimeRoundedIcon sx={{ fontSize: 18, color: rentalUi.muted }} />
                  <Typography sx={{ color: rentalUi.muted, fontSize: 16.5 }}>{branch.hours}</Typography>
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <LocalTaxiOutlinedIcon sx={{ fontSize: 18, color: rentalUi.muted }} />
                  <Typography sx={{ color: rentalUi.muted, fontSize: 16.5 }}>{branch.vehicles} vehicles</Typography>
                </Stack>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.65 }}>
              <LocationOnRoundedIcon sx={{ color: rentalUi.green, fontSize: 20 }} />
              <Typography sx={{ color: rentalUi.muted, fontSize: 18 }}>{branch.distance}</Typography>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function RentalBranches(): React.JSX.Element {
  const navigate = useNavigate();
  const { actions } = useAppData();

  const [tab, setTab] = useState<"pickup" | "return">("pickup");
  const defaultBranch = branches[0]?.name ?? "";
  const [pickupBranch, setPickupBranch] = useState(defaultBranch);
  const [returnBranch, setReturnBranch] = useState(defaultBranch);

  const pickupBranchData = branches.find((branch) => branch.name === pickupBranch) ?? branches[0];
  const returnBranchData = branches.find((branch) => branch.name === returnBranch) ?? branches[1] ?? branches[0];
  const mapCenter = pickupBranchData?.mapPoint ?? { lat: 12.9716, lng: 77.5946 };
  const mapMarkers = [
    { id: "pickup", position: pickupBranchData?.mapPoint ?? mapCenter, label: "Pickup", color: "#11B86A" },
    { id: "return", position: returnBranchData?.mapPoint ?? mapCenter, label: "Return", color: "#FF8A00" }
  ];
  return (
    <Box sx={screenShellSx}>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: rentalUi.title }}>
          <ArrowBackRoundedIcon />
        </IconButton>
        <Typography sx={{ fontSize: 22, fontWeight: 800 }}>Branches</Typography>
      </Stack>

      <ExpandableMapPanel
        mapHeight={{ xs: "40dvh", md: "46vh" }}
        expandedMapHeight={{ xs: "72dvh", md: "78vh" }}
        minMapHeight={290}
        mapWrapperSx={{
          mx: { xs: -2, sm: -2.5 },
          width: { xs: "calc(100% + 32px)", sm: "calc(100% + 40px)" }
        }}
        map={
          <MapShell
            preset="full"
            height="100%"
            rounded={false}
            showControls
            showBackButton={false}
            fullBleed={false}
            interactive
            mapCenter={mapCenter}
            mapMarkers={mapMarkers}
            routePolyline={[]}
            initialZoom={10}
            routeDistanceKm={null}
            showRouteInfo={false}
          />
        }
        details={
          <Box sx={{ pt: 1.35 }}>
            <Card sx={{ ...cardSx, p: 0.4, mb: 1.5 }}>
              <Stack direction="row" spacing={0.6}>
                <Box
                  role="button"
                  onClick={() => setTab("pickup")}
                  sx={{
                    flex: 1,
                    borderRadius: 2.2,
                    py: 1.1,
                    px: 1,
                    bgcolor: tab === "pickup" ? "#fff" : "transparent",
                    borderBottom: tab === "pickup" ? `3px solid ${rentalUi.green}` : "3px solid transparent",
                    cursor: "pointer"
                  }}
                >
                  <Stack direction="row" justifyContent="center" spacing={0.6} alignItems="center">
                    <DirectionsCarRoundedIcon sx={{ color: rentalUi.green }} />
                    <Typography sx={{ fontSize: 24/1.4, fontWeight: 800, color: tab === "pickup" ? rentalUi.greenDeep : rentalUi.muted }}>Pickup</Typography>
                  </Stack>
                </Box>

                <Box
                  role="button"
                  onClick={() => setTab("return")}
                  sx={{
                    flex: 1,
                    borderRadius: 2.2,
                    py: 1.1,
                    px: 1,
                    bgcolor: tab === "return" ? "#fff" : "transparent",
                    borderBottom: tab === "return" ? `3px solid ${rentalUi.orange}` : "3px solid transparent",
                    cursor: "pointer"
                  }}
                >
                  <Stack direction="row" justifyContent="center" spacing={0.6} alignItems="center">
                    <LocationOnRoundedIcon sx={{ color: rentalUi.orange }} />
                    <Typography sx={{ fontSize: 24/1.4, fontWeight: 800, color: tab === "return" ? rentalUi.orange : rentalUi.muted }}>Return</Typography>
                  </Stack>
                </Box>
              </Stack>
            </Card>

            <Stack spacing={1.2} sx={{ mb: 1.4 }}>
              {branches.map((branch) => {
                const selected = tab === "pickup" ? pickupBranch === branch.name : returnBranch === branch.name;
                return (
                  <BranchCard
                    key={branch.id}
                    branch={branch}
                    selected={selected}
                    onSelect={() => {
                      if (tab === "pickup") {
                        setPickupBranch(branch.name);
                      } else {
                        setReturnBranch(branch.name);
                      }
                    }}
                  />
                );
              })}
            </Stack>

            <Card sx={{ ...cardSx, bgcolor: "#F1FAF6", mb: 1.55 }}>
              <CardContent sx={{ p: 1.35, "&:last-child": { pb: 1.35 } }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.1}>
                  <Stack direction="row" spacing={0.95} alignItems="center">
                    <FlightTakeoffRoundedIcon sx={{ color: rentalUi.green }} />
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 34/2 }}>Airport pickup surcharge</Typography>
                      <Typography sx={{ color: rentalUi.muted, fontSize: 17 }}>
                        A surcharge of ₹499 applies for pickups from Airport branches.
                      </Typography>
                    </Box>
                  </Stack>
                  <Typography sx={{ color: rentalUi.green, fontWeight: 700, fontSize: 17 }}>Learn more</Typography>
                </Stack>
              </CardContent>
            </Card>

            <GradientActionButton
              label="Continue"
              onClick={() => {
                actions.updateRentalBooking({
                  pickupBranch,
                  dropoffBranch: returnBranch
                });
                navigate("/rental/summary");
              }}
              sx={{
                "& .MuiButton-endIcon": {
                  marginLeft: 6
                }
              }}
            />
          </Box>
        }
      />
    </Box>
  );
}
