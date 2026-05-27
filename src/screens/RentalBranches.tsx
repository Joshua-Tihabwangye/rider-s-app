import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  TextField,
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
import {
  EVZONE_RENTAL_LOCATIONS,
  RentalLocationOption,
  getPickupLocations,
  getRentalCountries,
  getRentalRegionsByCountry,
  getReturnLocationsByCountryAndRegion
} from "../features/rental/locations";

function deriveHours(location: RentalLocationOption): string {
  if (location.id.includes("airport")) {
    return "24x7";
  }
  return "7:00 AM - 10:00 PM";
}

function deriveVehicleCount(location: RentalLocationOption): number {
  const index = EVZONE_RENTAL_LOCATIONS.findIndex((item) => item.id === location.id);
  return 12 + ((index >= 0 ? index : 0) % 12);
}

function normalizeBranchLabel(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function BranchCard({
  branch,
  selected,
  onSelect
}: {
  branch: RentalLocationOption;
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
      <CardContent sx={{ p: 1.25, "&:last-child": { pb: 1.25 } }}>
        <Stack direction="row" spacing={0.95}>
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              border: `2px solid ${selected ? rentalUi.green : "#C8D0DC"}`,
              display: "grid",
              placeItems: "center",
              mt: 0.15
            }}
          >
            {selected ? <Box sx={{ width: 16, height: 16, borderRadius: "50%", bgcolor: rentalUi.green }} /> : null}
          </Box>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={0.6}>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: "13px !important", fontWeight: 800, lineHeight: 1.2 }}>
                  {branch.displayName}
                </Typography>
                <Typography sx={{ fontSize: "11px !important", color: rentalUi.muted, lineHeight: 1.32 }}>
                  {branch.address}
                </Typography>
              </Box>

              <Stack spacing={0.4}>
                <Stack direction="row" spacing={0.45} alignItems="center">
                  <AccessTimeRoundedIcon sx={{ fontSize: 14, color: rentalUi.muted }} />
                  <Typography sx={{ color: rentalUi.muted, fontSize: "11px !important" }}>{deriveHours(branch)}</Typography>
                </Stack>
                <Stack direction="row" spacing={0.45} alignItems="center">
                  <LocalTaxiOutlinedIcon sx={{ fontSize: 14, color: rentalUi.muted }} />
                  <Typography sx={{ color: rentalUi.muted, fontSize: "11px !important" }}>
                    {deriveVehicleCount(branch)} vehicles
                  </Typography>
                </Stack>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={0.45} alignItems="center" sx={{ mt: 0.55 }}>
              <LocationOnRoundedIcon sx={{ color: rentalUi.green, fontSize: 15 }} />
              <Typography sx={{ color: rentalUi.muted, fontSize: "11px !important" }}>
                {branch.region}, {branch.country}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function RentalBranches(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { actions } = useAppData();
  const routeState = location.state as { focusPickupBranchLabel?: string } | null;

  const countries = useMemo(() => getRentalCountries(), []);
  const pickupLocations = useMemo(() => getPickupLocations(), []);
  const defaultCountryCode = countries.find((country) => country.code === "UG")?.code ?? countries[0]?.code ?? "UG";
  const preferredPickupLocation = useMemo(() => {
    const label = routeState?.focusPickupBranchLabel;
    if (!label?.trim()) {
      return null;
    }
    const normalizedLabel = normalizeBranchLabel(label);

    return (
      pickupLocations.find((entry) => normalizeBranchLabel(entry.displayName) === normalizedLabel) ??
      pickupLocations.find(
        (entry) => normalizeBranchLabel(`${entry.displayName} ${entry.country}`) === normalizedLabel
      ) ??
      pickupLocations.find((entry) => normalizedLabel.includes(normalizeBranchLabel(entry.displayName))) ??
      pickupLocations.find((entry) => normalizeBranchLabel(entry.displayName).includes(normalizedLabel)) ??
      null
    );
  }, [pickupLocations, routeState?.focusPickupBranchLabel]);

  const [tab, setTab] = useState<"pickup" | "return">("pickup");
  const [pickupCountryCode, setPickupCountryCode] = useState(
    preferredPickupLocation?.countryCode ?? defaultCountryCode
  );
  const [pickupRegion, setPickupRegion] = useState(preferredPickupLocation?.region ?? "");
  const [pickupLocationId, setPickupLocationId] = useState(preferredPickupLocation?.id ?? "");

  const [returnInAnotherCountry, setReturnInAnotherCountry] = useState(false);
  const [returnCountryCode, setReturnCountryCode] = useState(
    preferredPickupLocation?.countryCode ?? defaultCountryCode
  );
  const [returnRegion, setReturnRegion] = useState(preferredPickupLocation?.region ?? "");
  const [returnLocationId, setReturnLocationId] = useState(preferredPickupLocation?.id ?? "");

  useEffect(() => {
    if (!preferredPickupLocation) {
      return;
    }
    setPickupCountryCode(preferredPickupLocation.countryCode);
    setPickupRegion(preferredPickupLocation.region);
    setPickupLocationId(preferredPickupLocation.id);
    setReturnCountryCode(preferredPickupLocation.countryCode);
    setReturnRegion(preferredPickupLocation.region);
    setReturnLocationId(preferredPickupLocation.id);
  }, [preferredPickupLocation]);

  const pickupRegions = useMemo(() => getRentalRegionsByCountry(pickupCountryCode), [pickupCountryCode]);

  useEffect(() => {
    if (!pickupRegions.length) {
      setPickupRegion("");
      return;
    }
    if (!pickupRegions.some((region) => region.name === pickupRegion)) {
      const kampalaRegion = pickupRegions.find((region) => region.name.toLowerCase() === "kampala");
      setPickupRegion(kampalaRegion?.name ?? pickupRegions[0]!.name);
    }
  }, [pickupRegion, pickupRegions]);

  const pickupOptions = useMemo(() => {
    return pickupLocations.filter((location) => {
      if (location.countryCode !== pickupCountryCode) return false;
      if (pickupRegion && location.region !== pickupRegion) return false;
      return true;
    });
  }, [pickupCountryCode, pickupLocations, pickupRegion]);

  useEffect(() => {
    if (!pickupOptions.length) {
      setPickupLocationId("");
      return;
    }
    if (!pickupOptions.some((location) => location.id === pickupLocationId)) {
      setPickupLocationId(pickupOptions[0]!.id);
    }
  }, [pickupLocationId, pickupOptions]);

  const effectiveReturnCountryCode = returnInAnotherCountry ? returnCountryCode : pickupCountryCode;
  const effectiveReturnRegion = returnInAnotherCountry ? returnRegion : pickupRegion;
  const returnRegions = useMemo(
    () => getRentalRegionsByCountry(effectiveReturnCountryCode),
    [effectiveReturnCountryCode]
  );

  useEffect(() => {
    if (!returnRegions.length) {
      setReturnRegion("");
      return;
    }
    if (!returnRegions.some((region) => region.name === returnRegion)) {
      const kampalaRegion = returnRegions.find((region) => region.name.toLowerCase() === "kampala");
      setReturnRegion(kampalaRegion?.name ?? returnRegions[0]!.name);
    }
  }, [returnRegion, returnRegions]);

  const returnOptions = useMemo(() => {
    const resolved = getReturnLocationsByCountryAndRegion({
      countryCode: effectiveReturnCountryCode,
      region: effectiveReturnRegion,
      pickupCountryCode
    });

    if (resolved.length > 0) {
      return resolved;
    }

    return EVZONE_RENTAL_LOCATIONS.filter((location) => {
      if (!location.returnAllowed) return false;
      if (location.countryCode !== effectiveReturnCountryCode) return false;
      if (effectiveReturnRegion && location.region !== effectiveReturnRegion) return false;
      return true;
    });
  }, [effectiveReturnCountryCode, effectiveReturnRegion, pickupCountryCode]);

  useEffect(() => {
    if (!returnOptions.length) {
      setReturnLocationId("");
      return;
    }
    if (!returnOptions.some((location) => location.id === returnLocationId)) {
      setReturnLocationId(returnOptions[0]!.id);
    }
  }, [returnLocationId, returnOptions]);

  const selectedPickup = pickupOptions.find((location) => location.id === pickupLocationId) ?? pickupOptions[0] ?? null;
  const selectedReturn = returnOptions.find((location) => location.id === returnLocationId) ?? returnOptions[0] ?? null;

  const mapCenter = selectedPickup
    ? { lat: selectedPickup.latitude, lng: selectedPickup.longitude }
    : { lat: 0.3136, lng: 32.5811 };

  const mapMarkers = [
    selectedPickup
      ? {
          id: "pickup",
          position: { lat: selectedPickup.latitude, lng: selectedPickup.longitude },
          label: "Pickup",
          color: "#11B86A"
        }
      : null,
    selectedReturn
      ? {
          id: "return",
          position: { lat: selectedReturn.latitude, lng: selectedReturn.longitude },
          label: "Return",
          color: "#FF8A00"
        }
      : null
  ].filter((item): item is { id: string; position: { lat: number; lng: number }; label: string; color: string } => Boolean(item));

  const routePolyline =
    selectedPickup && selectedReturn
      ? [
          { lat: selectedPickup.latitude, lng: selectedPickup.longitude },
          { lat: selectedReturn.latitude, lng: selectedReturn.longitude }
        ]
      : [];

  const branchList = tab === "pickup" ? pickupOptions : returnOptions;
  const selectedId = tab === "pickup" ? pickupLocationId : returnLocationId;

  return (
    <Box sx={screenShellSx}>
      <Stack direction="row" alignItems="center" spacing={1.2} sx={{ mb: 1.6 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: rentalUi.title }}>
          <ArrowBackRoundedIcon />
        </IconButton>
        <Typography sx={{ fontSize: 22, fontWeight: 800 }}>Branches</Typography>
      </Stack>

      <ExpandableMapPanel
        mapHeight={{ xs: "32dvh", md: "40vh" }}
        expandedMapHeight={{ xs: "calc(100dvh - 126px)", md: "calc(100vh - 170px)" }}
        minMapHeight={300}
        buttonOffsetCollapsed={-10}
        buttonOffsetExpanded={4}
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
            routePolyline={routePolyline}
            initialZoom={6}
            showRouteInfo={false}
          />
        }
        details={
          <Box sx={{ pt: 1.45 }}>
            <Card sx={{ ...cardSx, mb: 1.2 }}>
              <CardContent sx={{ p: 1.1, "&:last-child": { pb: 1.1 } }}>
                <Stack spacing={1}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={0.9}>
                    <TextField
                      select
                      fullWidth
                      label="Pickup country"
                      value={pickupCountryCode}
                      onChange={(event) => {
                        const value = event.target.value;
                        setPickupCountryCode(value);
                        if (!returnInAnotherCountry) {
                          setReturnCountryCode(value);
                        }
                      }}
                    >
                      {countries.map((country) => (
                        <MenuItem key={`pickup-country-${country.code}`} value={country.code}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      select
                      fullWidth
                      label="Pickup region"
                      value={pickupRegion}
                      onChange={(event) => setPickupRegion(event.target.value)}
                      disabled={!pickupRegions.length}
                    >
                      {pickupRegions.map((region) => (
                        <MenuItem key={`pickup-region-${region.name}`} value={region.name}>
                          {region.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Stack>

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={returnInAnotherCountry}
                        onChange={(event) => {
                          const checked = event.target.checked;
                          setReturnInAnotherCountry(checked);
                          if (!checked) {
                            setReturnCountryCode(pickupCountryCode);
                          }
                        }}
                      />
                    }
                    label="Return vehicle in another country"
                    sx={{ m: 0 }}
                  />

                  {returnInAnotherCountry ? (
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={0.9}>
                      <TextField
                        select
                        fullWidth
                        label="Return country"
                        value={returnCountryCode}
                        onChange={(event) => setReturnCountryCode(event.target.value)}
                      >
                        {countries.map((country) => (
                          <MenuItem key={`return-country-${country.code}`} value={country.code}>
                            {country.name}
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        select
                        fullWidth
                        label="Return region"
                        value={returnRegion}
                        onChange={(event) => setReturnRegion(event.target.value)}
                        disabled={!returnRegions.length}
                      >
                        {returnRegions.map((region) => (
                          <MenuItem key={`return-region-${region.name}`} value={region.name}>
                            {region.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Stack>
                  ) : null}
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ ...cardSx, p: 0.4, mb: 1.2 }}>
              <Stack direction="row" spacing={0.6}>
                <Box
                  role="button"
                  onClick={() => setTab("pickup")}
                  sx={{
                    flex: 1,
                    borderRadius: 2.2,
                    py: 0.95,
                    px: 1,
                    bgcolor: tab === "pickup" ? "#fff" : "transparent",
                    borderBottom: tab === "pickup" ? `3px solid ${rentalUi.green}` : "3px solid transparent",
                    cursor: "pointer"
                  }}
                >
                  <Stack direction="row" justifyContent="center" spacing={0.55} alignItems="center">
                    <DirectionsCarRoundedIcon sx={{ color: rentalUi.green, fontSize: 20 }} />
                    <Typography sx={{ fontWeight: 800, color: tab === "pickup" ? rentalUi.greenDeep : rentalUi.muted }}>
                      Pickup
                    </Typography>
                  </Stack>
                </Box>

                <Box
                  role="button"
                  onClick={() => setTab("return")}
                  sx={{
                    flex: 1,
                    borderRadius: 2.2,
                    py: 0.95,
                    px: 1,
                    bgcolor: tab === "return" ? "#fff" : "transparent",
                    borderBottom: tab === "return" ? `3px solid ${rentalUi.orange}` : "3px solid transparent",
                    cursor: "pointer"
                  }}
                >
                  <Stack direction="row" justifyContent="center" spacing={0.55} alignItems="center">
                    <LocationOnRoundedIcon sx={{ color: rentalUi.orange, fontSize: 20 }} />
                    <Typography sx={{ fontWeight: 800, color: tab === "return" ? rentalUi.orange : rentalUi.muted }}>
                      Return
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Card>

            <Stack spacing={1.05} sx={{ mb: 1.25 }}>
              {branchList.map((branch) => (
                <BranchCard
                  key={`${tab}-${branch.id}`}
                  branch={branch}
                  selected={selectedId === branch.id}
                  onSelect={() => {
                    if (tab === "pickup") {
                      setPickupLocationId(branch.id);
                    } else {
                      setReturnLocationId(branch.id);
                    }
                  }}
                />
              ))}
            </Stack>

            <Card sx={{ ...cardSx, bgcolor: "#F1FAF6", mb: 1.35 }}>
              <CardContent sx={{ p: 1.2, "&:last-child": { pb: 1.2 } }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={0.9}>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <FlightTakeoffRoundedIcon sx={{ color: rentalUi.green, fontSize: 18 }} />
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: "12.8px !important" }}>
                        Airport pickup surcharge
                      </Typography>
                      <Typography sx={{ color: rentalUi.muted, fontSize: "11px !important" }}>
                        A surcharge applies for airport pickups and cross-border returns.
                      </Typography>
                    </Box>
                  </Stack>
                  <Typography sx={{ color: rentalUi.green, fontWeight: 700, fontSize: "11.5px !important" }}>
                    Learn more
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

            <GradientActionButton
              label="Continue"
              disabled={!selectedPickup || !selectedReturn}
              onClick={() => {
                if (!selectedPickup || !selectedReturn) {
                  return;
                }

                actions.updateRentalBooking({
                  pickupBranch: `${selectedPickup.displayName}, ${selectedPickup.country}`,
                  dropoffBranch: `${selectedReturn.displayName}, ${selectedReturn.country}`
                });
                navigate("/rental/summary");
              }}
            />
          </Box>
        }
      />
    </Box>
  );
}
