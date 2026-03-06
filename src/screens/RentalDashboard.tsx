import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Chip,
  Divider,
  TextField,
  InputAdornment,
  Collapse,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButton,
  ToggleButtonGroup,
  Rating,
  Checkbox,
  FormControlLabel,
  Tooltip,
  Snackbar
} from "@mui/material";

import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import ElectricCarRoundedIcon from "@mui/icons-material/ElectricCarRounded";
import LocalGasStationRoundedIcon from "@mui/icons-material/LocalGasStationRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import BatteryChargingFullRoundedIcon from "@mui/icons-material/BatteryChargingFullRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import AcUnitRoundedIcon from "@mui/icons-material/AcUnitRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import CorporateFareRoundedIcon from "@mui/icons-material/CorporateFareRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import LuggageRoundedIcon from "@mui/icons-material/LuggageRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import GpsFixedRoundedIcon from "@mui/icons-material/GpsFixedRounded";
import ChildCareRoundedIcon from "@mui/icons-material/ChildCareRounded";
import BluetoothRoundedIcon from "@mui/icons-material/BluetoothRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import LocalGasStationOutlinedIcon from "@mui/icons-material/LocalGasStationOutlined";
import CompareArrowsRoundedIcon from "@mui/icons-material/CompareArrowsRounded";
import TwoWheelerRoundedIcon from "@mui/icons-material/TwoWheelerRounded";
import SportsMotorsportsRoundedIcon from "@mui/icons-material/SportsMotorsportsRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import InventoryRoundedIcon from "@mui/icons-material/InventoryRounded";

import MobileShell from "../components/MobileShell";
import DarkModeToggle from "../components/DarkModeToggle";

/* ─────────────────── Vehicle Data ─────────────────── */

interface Vehicle {
  id: string;
  name: string;
  brand: string;
  category: "Sedan" | "SUV" | "Hatchback" | "Van" | "Pickup" | "Luxury";
  fuelType: "EV" | "Petrol" | "Diesel" | "Hybrid";
  image: string;
  seats: number;
  transmission: "Automatic" | "Manual";
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
  range: string;
  mileageLimit: string;
  year: number;
  rating: number;
  reviews: number;
  available: boolean;
  features: string[];
  luggage: string;
  ac: boolean;
  bluetooth: boolean;
  gps: boolean;
  ageRequirement: number;
  deposit: number;
  tag?: string;
}

const VEHICLES: Vehicle[] = [
  {
    id: "V-001",
    name: "Nissan Leaf",
    brand: "Nissan",
    category: "Hatchback",
    fuelType: "EV",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=250&fit=crop&auto=format",
    seats: 5,
    transmission: "Automatic",
    pricePerDay: 180000,
    pricePerWeek: 1080000,
    pricePerMonth: 3600000,
    range: "220 km",
    mileageLimit: "150 km/day",
    year: 2024,
    rating: 4.7,
    reviews: 42,
    available: true,
    features: ["Regenerative braking", "ProPILOT Assist", "Apple CarPlay", "360° camera"],
    luggage: "2–3 suitcases",
    ac: true,
    bluetooth: true,
    gps: true,
    ageRequirement: 21,
    deposit: 300000,
    tag: "Most popular"
  },
  {
    id: "V-002",
    name: "Toyota RAV4",
    brand: "Toyota",
    category: "SUV",
    fuelType: "Petrol",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=250&fit=crop&auto=format",
    seats: 5,
    transmission: "Automatic",
    pricePerDay: 200000,
    pricePerWeek: 1200000,
    pricePerMonth: 4000000,
    range: "600 km tank",
    mileageLimit: "200 km/day",
    year: 2023,
    rating: 4.5,
    reviews: 68,
    available: true,
    features: ["Lane departure alert", "Toyota Safety Sense", "Roof rails", "All-wheel drive"],
    luggage: "3–4 suitcases",
    ac: true,
    bluetooth: true,
    gps: true,
    ageRequirement: 23,
    deposit: 400000,
    tag: "Family favourite"
  },
  {
    id: "V-003",
    name: "Tesla Model 3",
    brand: "Tesla",
    category: "Sedan",
    fuelType: "EV",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=250&fit=crop&auto=format",
    seats: 5,
    transmission: "Automatic",
    pricePerDay: 320000,
    pricePerWeek: 1920000,
    pricePerMonth: 6400000,
    range: "400 km",
    mileageLimit: "200 km/day",
    year: 2025,
    rating: 4.9,
    reviews: 31,
    available: true,
    features: ["Autopilot", "Supercharger access", "15\" touchscreen", "OTA updates"],
    luggage: "2 suitcases",
    ac: true,
    bluetooth: true,
    gps: true,
    ageRequirement: 25,
    deposit: 500000,
    tag: "Premium"
  },
  {
    id: "V-004",
    name: "Hyundai Kona EV",
    brand: "Hyundai",
    category: "SUV",
    fuelType: "EV",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=250&fit=crop&auto=format",
    seats: 5,
    transmission: "Automatic",
    pricePerDay: 230000,
    pricePerWeek: 1380000,
    pricePerMonth: 4600000,
    range: "300 km",
    mileageLimit: "180 km/day",
    year: 2024,
    rating: 4.6,
    reviews: 27,
    available: true,
    features: ["Smart cruise control", "Heated seats", "Wireless charging pad", "Blind-spot monitor"],
    luggage: "2–3 suitcases",
    ac: true,
    bluetooth: true,
    gps: true,
    ageRequirement: 21,
    deposit: 350000
  },
  {
    id: "V-005",
    name: "Toyota Hilux",
    brand: "Toyota",
    category: "Pickup",
    fuelType: "Diesel",
    image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=400&h=250&fit=crop&auto=format",
    seats: 5,
    transmission: "Manual",
    pricePerDay: 250000,
    pricePerWeek: 1500000,
    pricePerMonth: 5000000,
    range: "700 km tank",
    mileageLimit: "250 km/day",
    year: 2023,
    rating: 4.4,
    reviews: 54,
    available: true,
    features: ["4WD", "Tow bar", "Heavy-duty suspension", "Bed liner"],
    luggage: "Open bed + cabin",
    ac: true,
    bluetooth: true,
    gps: false,
    ageRequirement: 25,
    deposit: 500000,
    tag: "Upcountry trips"
  },
  {
    id: "V-006",
    name: "Mercedes-Benz E-Class",
    brand: "Mercedes-Benz",
    category: "Luxury",
    fuelType: "Petrol",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=250&fit=crop&auto=format",
    seats: 5,
    transmission: "Automatic",
    pricePerDay: 450000,
    pricePerWeek: 2700000,
    pricePerMonth: 9000000,
    range: "550 km tank",
    mileageLimit: "150 km/day",
    year: 2024,
    rating: 4.8,
    reviews: 19,
    available: true,
    features: ["AMG styling", "MBUX infotainment", "Burmester sound", "Massage seats"],
    luggage: "3 suitcases",
    ac: true,
    bluetooth: true,
    gps: true,
    ageRequirement: 25,
    deposit: 800000,
    tag: "Executive"
  },
  {
    id: "V-007",
    name: "Toyota Wish",
    brand: "Toyota",
    category: "Van",
    fuelType: "Petrol",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=400&h=250&fit=crop&auto=format",
    seats: 7,
    transmission: "Automatic",
    pricePerDay: 160000,
    pricePerWeek: 960000,
    pricePerMonth: 3200000,
    range: "500 km tank",
    mileageLimit: "200 km/day",
    year: 2022,
    rating: 4.3,
    reviews: 87,
    available: true,
    features: ["Spacious interior", "Sliding rear doors", "Foldable 3rd row", "USB ports"],
    luggage: "4 suitcases",
    ac: true,
    bluetooth: true,
    gps: false,
    ageRequirement: 21,
    deposit: 250000,
    tag: "Budget friendly"
  },
  {
    id: "V-008",
    name: "BYD Atto 3",
    brand: "BYD",
    category: "SUV",
    fuelType: "EV",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=250&fit=crop&auto=format",
    seats: 5,
    transmission: "Automatic",
    pricePerDay: 210000,
    pricePerWeek: 1260000,
    pricePerMonth: 4200000,
    range: "345 km",
    mileageLimit: "180 km/day",
    year: 2025,
    rating: 4.5,
    reviews: 15,
    available: true,
    features: ["Rotating touchscreen", "NFC key", "V2L (vehicle-to-load)", "8 airbags"],
    luggage: "2–3 suitcases",
    ac: true,
    bluetooth: true,
    gps: true,
    ageRequirement: 21,
    deposit: 350000,
    tag: "New arrival"
  },
  {
    id: "V-009",
    name: "Toyota Corolla",
    brand: "Toyota",
    category: "Sedan",
    fuelType: "Hybrid",
    image: "https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=400&h=250&fit=crop&auto=format",
    seats: 5,
    transmission: "Automatic",
    pricePerDay: 170000,
    pricePerWeek: 1020000,
    pricePerMonth: 3400000,
    range: "800+ km tank",
    mileageLimit: "200 km/day",
    year: 2024,
    rating: 4.6,
    reviews: 73,
    available: true,
    features: ["Hybrid efficiency", "Toyota Safety Sense", "Wireless Apple CarPlay", "LED headlights"],
    luggage: "2 suitcases",
    ac: true,
    bluetooth: true,
    gps: true,
    ageRequirement: 21,
    deposit: 250000,
    tag: "Eco-friendly"
  }
];

/* ─────────────────── Motorbike Data ─────────────────── */

interface Motorbike {
  id: string;
  name: string;
  brand: string;
  bikeType: "Sport" | "Cruiser" | "Scooter" | "Adventure" | "Standard" | "Electric scooter";
  fuelType: "EV" | "Petrol";
  image: string;
  engineSize: string;
  transmission: "Automatic" | "Manual" | "Semi-automatic";
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
  range: string;
  mileageLimit: string;
  topSpeed: string;
  weight: string;
  year: number;
  rating: number;
  reviews: number;
  available: boolean;
  features: string[];
  abs: boolean;
  helmetIncluded: boolean;
  storageBox: boolean;
  usbCharging: boolean;
  ageRequirement: number;
  licenseClass: string;
  deposit: number;
  tag?: string;
}

const MOTORBIKES: Motorbike[] = [
  {
    id: "M-001",
    name: "Zembo Z1",
    brand: "Zembo",
    bikeType: "Electric scooter",
    fuelType: "EV",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=250&fit=crop&auto=format",
    engineSize: "3 kW motor",
    transmission: "Automatic",
    pricePerDay: 45000,
    pricePerWeek: 270000,
    pricePerMonth: 900000,
    range: "70 km",
    mileageLimit: "80 km/day",
    topSpeed: "60 km/h",
    weight: "95 kg",
    year: 2025,
    rating: 4.6,
    reviews: 128,
    available: true,
    features: ["Swappable battery", "Digital dash", "Regenerative braking", "Anti-theft alarm"],
    abs: false,
    helmetIncluded: true,
    storageBox: true,
    usbCharging: true,
    ageRequirement: 18,
    licenseClass: "A1",
    deposit: 100000,
    tag: "Most popular"
  },
  {
    id: "M-002",
    name: "Bajaj Boxer 150",
    brand: "Bajaj",
    bikeType: "Standard",
    fuelType: "Petrol",
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&h=250&fit=crop&auto=format",
    engineSize: "149 cc",
    transmission: "Manual",
    pricePerDay: 35000,
    pricePerWeek: 210000,
    pricePerMonth: 700000,
    range: "400 km tank",
    mileageLimit: "120 km/day",
    topSpeed: "100 km/h",
    weight: "118 kg",
    year: 2024,
    rating: 4.3,
    reviews: 245,
    available: true,
    features: ["Fuel efficient", "Rugged build", "Tubeless tyres", "Electric start + kick start"],
    abs: false,
    helmetIncluded: true,
    storageBox: false,
    usbCharging: false,
    ageRequirement: 18,
    licenseClass: "A1",
    deposit: 80000,
    tag: "Budget friendly"
  },
  {
    id: "M-003",
    name: "Super Soco TC Max",
    brand: "Super Soco",
    bikeType: "Electric scooter",
    fuelType: "EV",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=250&fit=crop&auto=format",
    engineSize: "5 kW motor",
    transmission: "Automatic",
    pricePerDay: 65000,
    pricePerWeek: 390000,
    pricePerMonth: 1300000,
    range: "110 km",
    mileageLimit: "120 km/day",
    topSpeed: "95 km/h",
    weight: "88 kg",
    year: 2025,
    rating: 4.7,
    reviews: 34,
    available: true,
    features: ["Removable battery", "CBS braking", "LED lights", "Smartphone app connectivity"],
    abs: false,
    helmetIncluded: true,
    storageBox: true,
    usbCharging: true,
    ageRequirement: 18,
    licenseClass: "A1",
    deposit: 150000,
    tag: "Premium EV"
  },
  {
    id: "M-004",
    name: "TVS Apache RTR 160",
    brand: "TVS",
    bikeType: "Sport",
    fuelType: "Petrol",
    image: "https://images.unsplash.com/photo-1558980394-4c7c9299fe96?w=400&h=250&fit=crop&auto=format",
    engineSize: "159.7 cc",
    transmission: "Manual",
    pricePerDay: 50000,
    pricePerWeek: 300000,
    pricePerMonth: 1000000,
    range: "350 km tank",
    mileageLimit: "150 km/day",
    topSpeed: "114 km/h",
    weight: "146 kg",
    year: 2024,
    rating: 4.5,
    reviews: 67,
    available: true,
    features: ["SmartXonnect Bluetooth", "Race-tuned FI", "Dual-channel ABS", "Split seat design"],
    abs: true,
    helmetIncluded: true,
    storageBox: false,
    usbCharging: false,
    ageRequirement: 18,
    licenseClass: "A2",
    deposit: 120000,
    tag: "Sporty ride"
  },
  {
    id: "M-005",
    name: "Honda CRF 250L",
    brand: "Honda",
    bikeType: "Adventure",
    fuelType: "Petrol",
    image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400&h=250&fit=crop&auto=format",
    engineSize: "249 cc",
    transmission: "Manual",
    pricePerDay: 85000,
    pricePerWeek: 510000,
    pricePerMonth: 1700000,
    range: "350 km tank",
    mileageLimit: "200 km/day",
    topSpeed: "130 km/h",
    weight: "144 kg",
    year: 2024,
    rating: 4.8,
    reviews: 29,
    available: true,
    features: ["On/off-road capable", "Long-travel suspension", "Pro-Link rear", "Skid plate"],
    abs: true,
    helmetIncluded: true,
    storageBox: false,
    usbCharging: false,
    ageRequirement: 21,
    licenseClass: "A2",
    deposit: 200000,
    tag: "Upcountry trips"
  },
  {
    id: "M-006",
    name: "NIU NQi GT",
    brand: "NIU",
    bikeType: "Electric scooter",
    fuelType: "EV",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=250&fit=crop&auto=format",
    engineSize: "3.5 kW motor",
    transmission: "Automatic",
    pricePerDay: 55000,
    pricePerWeek: 330000,
    pricePerMonth: 1100000,
    range: "100 km",
    mileageLimit: "100 km/day",
    topSpeed: "70 km/h",
    weight: "105 kg",
    year: 2025,
    rating: 4.5,
    reviews: 43,
    available: true,
    features: ["NIU app (GPS tracking)", "Dual battery option", "LED matrix headlight", "Regenerative braking"],
    abs: false,
    helmetIncluded: true,
    storageBox: true,
    usbCharging: true,
    ageRequirement: 18,
    licenseClass: "A1",
    deposit: 120000,
    tag: "City commuter"
  },
  {
    id: "M-007",
    name: "Royal Enfield Classic 350",
    brand: "Royal Enfield",
    bikeType: "Cruiser",
    fuelType: "Petrol",
    image: "https://images.unsplash.com/photo-1558980394-4c7c9299fe96?w=400&h=250&fit=crop&auto=format",
    engineSize: "349 cc",
    transmission: "Manual",
    pricePerDay: 95000,
    pricePerWeek: 570000,
    pricePerMonth: 1900000,
    range: "450 km tank",
    mileageLimit: "200 km/day",
    topSpeed: "120 km/h",
    weight: "195 kg",
    year: 2024,
    rating: 4.7,
    reviews: 52,
    available: true,
    features: ["Thumping exhaust note", "Tripper navigation", "Dual-channel ABS", "Retro styling"],
    abs: true,
    helmetIncluded: true,
    storageBox: false,
    usbCharging: true,
    ageRequirement: 21,
    licenseClass: "A2",
    deposit: 250000,
    tag: "Weekend cruiser"
  },
  {
    id: "M-008",
    name: "Piaggio Vespa 125",
    brand: "Piaggio",
    bikeType: "Scooter",
    fuelType: "Petrol",
    image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400&h=250&fit=crop&auto=format",
    engineSize: "124 cc",
    transmission: "Automatic",
    pricePerDay: 55000,
    pricePerWeek: 330000,
    pricePerMonth: 1100000,
    range: "300 km tank",
    mileageLimit: "100 km/day",
    topSpeed: "90 km/h",
    weight: "114 kg",
    year: 2024,
    rating: 4.4,
    reviews: 38,
    available: true,
    features: ["Iconic Italian design", "Under-seat storage", "USB charger", "Front glove box"],
    abs: true,
    helmetIncluded: true,
    storageBox: true,
    usbCharging: true,
    ageRequirement: 18,
    licenseClass: "A1",
    deposit: 150000,
    tag: "Stylish"
  },
  {
    id: "M-009",
    name: "Horwin CR6",
    brand: "Horwin",
    bikeType: "Sport",
    fuelType: "EV",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=250&fit=crop&auto=format",
    engineSize: "6.2 kW motor",
    transmission: "Automatic",
    pricePerDay: 80000,
    pricePerWeek: 480000,
    pricePerMonth: 1600000,
    range: "150 km",
    mileageLimit: "150 km/day",
    topSpeed: "95 km/h",
    weight: "115 kg",
    year: 2025,
    rating: 4.6,
    reviews: 18,
    available: true,
    features: ["Café racer styling", "TFT display", "Keyless start", "Dual disc brakes"],
    abs: true,
    helmetIncluded: true,
    storageBox: false,
    usbCharging: true,
    ageRequirement: 21,
    licenseClass: "A2",
    deposit: 200000,
    tag: "New arrival"
  }
];

type BikeCategory = Motorbike["bikeType"];
const BIKE_CATEGORIES: BikeCategory[] = ["Sport", "Cruiser", "Scooter", "Adventure", "Standard", "Electric scooter"];

const fuelTypeConfig: Record<Vehicle["fuelType"], { color: string; bgcolor: string; icon: React.ReactNode; label: string }> = {
  EV: { color: "#16A34A", bgcolor: "rgba(22,163,74,0.12)", icon: <BatteryChargingFullRoundedIcon sx={{ fontSize: 13 }} />, label: "Electric (EV)" },
  Petrol: { color: "#F59E0B", bgcolor: "rgba(245,158,11,0.12)", icon: <LocalGasStationRoundedIcon sx={{ fontSize: 13 }} />, label: "Petrol" },
  Diesel: { color: "#6366F1", bgcolor: "rgba(99,102,241,0.12)", icon: <LocalGasStationRoundedIcon sx={{ fontSize: 13 }} />, label: "Diesel" },
  Hybrid: { color: "#0EA5E9", bgcolor: "rgba(14,165,233,0.12)", icon: <ElectricCarRoundedIcon sx={{ fontSize: 13 }} />, label: "Hybrid" }
};

const formatPrice = (amount: number): string => {
  return `UGX ${amount.toLocaleString()}`;
};

/* ─────────────────── Booking Dialog ─────────────────── */

type AnyRentable = Vehicle | Motorbike;
const isMotorbike = (item: AnyRentable): item is Motorbike => "bikeType" in item;

interface BookingDialogProps {
  open: boolean;
  item: AnyRentable | null;
  onClose: () => void;
}

function BookingDialog({ open, item, onClose }: BookingDialogProps): React.JSX.Element {
  const navigate = useNavigate();
  const isBike = item ? isMotorbike(item) : false;
  const [bookerType, setBookerType] = useState<"individual" | "organization" | "business">("individual");
  const [driverOption, setDriverOption] = useState<"self" | "with-driver">("self");
  const [rentalPeriod, setRentalPeriod] = useState<"day" | "multi-day" | "week" | "month">("day");
  const [daysCount, setDaysCount] = useState("1");
  const [pickupLocation, setPickupLocation] = useState("");
  const [returnLocation, setReturnLocation] = useState("");
  const [addGps, setAddGps] = useState(false);
  const [addChildSeat, setAddChildSeat] = useState(false);
  const [addHelmet, setAddHelmet] = useState(false);
  const [addInsurancePlus, setAddInsurancePlus] = useState(false);
  const [addAdditionalDriver, setAddAdditionalDriver] = useState(false);
  const [deliveryToLocation, setDeliveryToLocation] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [fuelPolicy, setFuelPolicy] = useState<"full-to-full" | "prepaid">("full-to-full");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  if (!item) return <></>;

  const getDays = (): number => {
    switch (rentalPeriod) {
      case "day": return 1;
      case "multi-day": return Math.max(2, parseInt(daysCount) || 2);
      case "week": return 7;
      case "month": return 30;
    }
  };

  const getBasePrice = (): number => {
    switch (rentalPeriod) {
      case "day": return item.pricePerDay;
      case "multi-day": return item.pricePerDay * getDays();
      case "week": return item.pricePerWeek;
      case "month": return item.pricePerMonth;
    }
  };

  const riderDriverLabel = isBike ? "rider" : "driver";
  const driverCost = driverOption === "with-driver" ? (getDays() * (isBike ? 40000 : 80000)) : 0;
  const gpsCost = addGps ? 15000 : 0;
  const childSeatCost = addChildSeat ? 20000 : 0;
  const helmetCost = addHelmet ? 10000 : 0;
  const insurancePlusCost = addInsurancePlus ? (getDays() * (isBike ? 15000 : 25000)) : 0;
  const additionalDriverCost = addAdditionalDriver ? (getDays() * 30000) : 0;
  const deliveryCost = deliveryToLocation ? (isBike ? 25000 : 50000) : 0;
  const promoDiscount = promoApplied ? 50000 : 0;
  const totalCost = getBasePrice() + driverCost + gpsCost + childSeatCost + helmetCost + insurancePlusCost + additionalDriverCost + deliveryCost - promoDiscount;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "RIDER10" || promoCode.trim().toUpperCase() === "WELCOME") {
      setPromoApplied(true);
    }
  };

  const itemCategory = isBike ? (item as Motorbike).bikeType : (item as Vehicle).category;
  const itemDeposit = item.deposit;
  const itemAgeReq = item.ageRequirement;

  const handleConfirmBooking = () => {
    if (!agreedToTerms) return;
    onClose();
    navigate("/rental/summary", {
      state: {
        vehicle: item,
        isBike,
        bookerType,
        driverOption,
        rentalPeriod,
        days: getDays(),
        pickupLocation: deliveryToLocation ? deliveryAddress || "Delivery location" : pickupLocation || "Nsambya Hub",
        returnLocation: returnLocation || pickupLocation || "Nsambya Hub",
        extras: { addGps, addChildSeat, addHelmet, addInsurancePlus, addAdditionalDriver, deliveryToLocation },
        fuelPolicy,
        promoApplied,
        totalCost
      }
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: (t) => t.palette.background.paper,
          maxHeight: "88vh"
        }
      }}
    >
      <DialogTitle sx={{ pb: 0.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}>
            Book {item.name}
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 11, color: "text.secondary" }}>
            {itemCategory} • {fuelTypeConfig[item.fuelType].label}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <CloseRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 2.5 }}>
        {/* Booker Type */}
        <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700, display: "block", mt: 1, mb: 0.75 }}>
          Booking for
        </Typography>
        <ToggleButtonGroup
          value={bookerType}
          exclusive
          onChange={(_, v) => v && setBookerType(v)}
          fullWidth
          size="small"
          sx={{ mb: 1.5 }}
        >
          <ToggleButton value="individual" sx={{ borderRadius: "999px 0 0 999px", textTransform: "none", fontSize: 11, fontWeight: 600, py: 0.6 }}>
            <PersonRoundedIcon sx={{ fontSize: 16, mr: 0.5 }} /> Individual
          </ToggleButton>
          <ToggleButton value="organization" sx={{ textTransform: "none", fontSize: 11, fontWeight: 600, py: 0.6 }}>
            <CorporateFareRoundedIcon sx={{ fontSize: 16, mr: 0.5 }} /> Organization
          </ToggleButton>
          <ToggleButton value="business" sx={{ borderRadius: "0 999px 999px 0", textTransform: "none", fontSize: 11, fontWeight: 600, py: 0.6 }}>
            <BusinessRoundedIcon sx={{ fontSize: 16, mr: 0.5 }} /> Business
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Driver/rider option */}
        <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700, display: "block", mb: 0.75 }}>
          {isBike ? "Rider option" : "Driver option"}
        </Typography>
        <ToggleButtonGroup
          value={driverOption}
          exclusive
          onChange={(_, v) => v && setDriverOption(v)}
          fullWidth
          size="small"
          sx={{ mb: 1.5 }}
        >
          <ToggleButton value="self" sx={{ borderRadius: "999px 0 0 999px", textTransform: "none", fontSize: 11, fontWeight: 600, py: 0.6 }}>
            Self-{isBike ? "ride" : "drive"}
          </ToggleButton>
          <ToggleButton value="with-driver" sx={{ borderRadius: "0 999px 999px 0", textTransform: "none", fontSize: 11, fontWeight: 600, py: 0.6 }}>
            With {riderDriverLabel} (+{formatPrice(isBike ? 40000 : 80000)}/day)
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Rental period */}
        <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700, display: "block", mb: 0.75 }}>
          Rental period
        </Typography>
        <ToggleButtonGroup
          value={rentalPeriod}
          exclusive
          onChange={(_, v) => v && setRentalPeriod(v)}
          fullWidth
          size="small"
          sx={{ mb: 1 }}
        >
          <ToggleButton value="day" sx={{ borderRadius: "999px 0 0 999px", textTransform: "none", fontSize: 10.5, fontWeight: 600, py: 0.6 }}>
            1 Day
          </ToggleButton>
          <ToggleButton value="multi-day" sx={{ textTransform: "none", fontSize: 10.5, fontWeight: 600, py: 0.6 }}>
            Multi-day
          </ToggleButton>
          <ToggleButton value="week" sx={{ textTransform: "none", fontSize: 10.5, fontWeight: 600, py: 0.6 }}>
            1 Week
          </ToggleButton>
          <ToggleButton value="month" sx={{ borderRadius: "0 999px 999px 0", textTransform: "none", fontSize: 10.5, fontWeight: 600, py: 0.6 }}>
            1 Month
          </ToggleButton>
        </ToggleButtonGroup>

        {rentalPeriod === "multi-day" && (
          <TextField
            fullWidth
            size="small"
            type="number"
            label="Number of days"
            value={daysCount}
            onChange={(e) => setDaysCount(e.target.value)}
            inputProps={{ min: 2, max: 29 }}
            sx={{
              mb: 1.5,
              "& .MuiOutlinedInput-root": { borderRadius: 2 }
            }}
          />
        )}

        {/* Pickup & Return */}
        <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700, display: "block", mb: 0.75, mt: rentalPeriod !== "multi-day" ? 0.5 : 0 }}>
          Pickup & return location
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Pickup location (e.g. Nsambya Hub)"
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PlaceRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              </InputAdornment>
            )
          }}
          sx={{
            mb: 1,
            "& .MuiOutlinedInput-root": { borderRadius: 2 }
          }}
        />
        <TextField
          fullWidth
          size="small"
          placeholder="Return location (same as pickup if empty)"
          value={returnLocation}
          onChange={(e) => setReturnLocation(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PlaceRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              </InputAdornment>
            )
          }}
          sx={{
            mb: 1.5,
            "& .MuiOutlinedInput-root": { borderRadius: 2 }
          }}
        />

        {/* Extras / Add-ons */}
        <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700, display: "block", mb: 0.75 }}>
          Optional extras
        </Typography>
        <Stack spacing={0.75} sx={{ mb: 1.5 }}>
          {[
            ...(isBike
              ? [
                  { key: "helmet", label: "Extra helmet (passenger)", price: formatPrice(10000), icon: <SportsMotorsportsRoundedIcon sx={{ fontSize: 16 }} />, checked: addHelmet, toggle: () => setAddHelmet(!addHelmet) },
                ]
              : [
                  { key: "gps", label: "GPS navigation", price: formatPrice(15000), icon: <GpsFixedRoundedIcon sx={{ fontSize: 16 }} />, checked: addGps, toggle: () => setAddGps(!addGps) },
                  { key: "child", label: "Child seat", price: formatPrice(20000), icon: <ChildCareRoundedIcon sx={{ fontSize: 16 }} />, checked: addChildSeat, toggle: () => setAddChildSeat(!addChildSeat) },
                ]),
            { key: "ins", label: "Premium insurance", price: `${formatPrice(isBike ? 15000 : 25000)}/day`, icon: <ShieldRoundedIcon sx={{ fontSize: 16 }} />, checked: addInsurancePlus, toggle: () => setAddInsurancePlus(!addInsurancePlus) },
            ...(!isBike
              ? [{ key: "adddriver", label: "Additional driver", price: `${formatPrice(30000)}/day`, icon: <PersonAddAltRoundedIcon sx={{ fontSize: 16 }} />, checked: addAdditionalDriver, toggle: () => setAddAdditionalDriver(!addAdditionalDriver) }]
              : [])
          ].map((extra) => (
            <Card
              key={extra.key}
              elevation={0}
              onClick={extra.toggle}
              sx={{
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: extra.checked ? "rgba(3,205,140,0.1)" : (t) => t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                border: extra.checked ? "1px solid #03CD8C" : (t) => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)",
                transition: "all 0.15s ease"
              }}
            >
              <CardContent sx={{ px: 1.4, py: 0.8, "&:last-child": { pb: 0.8 } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    {extra.icon}
                    <Typography variant="caption" sx={{ fontSize: 11.5, fontWeight: 600 }}>{extra.label}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Typography variant="caption" sx={{ fontSize: 10.5, color: "text.secondary" }}>{extra.price}</Typography>
                    {extra.checked && <CheckCircleRoundedIcon sx={{ fontSize: 16, color: "#03CD8C" }} />}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>

        {/* Fuel policy — only for non-EV */}
        {item.fuelType !== "EV" && (
          <>
            <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700, display: "block", mb: 0.75 }}>
              Fuel policy
            </Typography>
            <ToggleButtonGroup
              value={fuelPolicy}
              exclusive
              onChange={(_, v) => v && setFuelPolicy(v)}
              fullWidth
              size="small"
              sx={{ mb: 1.5 }}
            >
              <ToggleButton value="full-to-full" sx={{ borderRadius: "999px 0 0 999px", textTransform: "none", fontSize: 10.5, fontWeight: 600, py: 0.6 }}>
                <LocalGasStationOutlinedIcon sx={{ fontSize: 15, mr: 0.4 }} /> Full-to-full
              </ToggleButton>
              <ToggleButton value="prepaid" sx={{ borderRadius: "0 999px 999px 0", textTransform: "none", fontSize: 10.5, fontWeight: 600, py: 0.6 }}>
                <LocalGasStationOutlinedIcon sx={{ fontSize: 15, mr: 0.4 }} /> Pre-paid fuel
              </ToggleButton>
            </ToggleButtonGroup>
          </>
        )}

        {/* Delivery to location */}
        <Card
          elevation={0}
          onClick={() => setDeliveryToLocation(!deliveryToLocation)}
          sx={{
            borderRadius: 2,
            cursor: "pointer",
            mb: deliveryToLocation ? 1 : 1.5,
            bgcolor: deliveryToLocation ? "rgba(3,205,140,0.1)" : (t) => t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
            border: deliveryToLocation ? "1px solid #03CD8C" : (t) => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)",
            transition: "all 0.15s ease"
          }}
        >
          <CardContent sx={{ px: 1.4, py: 0.8, "&:last-child": { pb: 0.8 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={0.75} alignItems="center">
                <LocalShippingRoundedIcon sx={{ fontSize: 16 }} />
                <Box>
                  <Typography variant="caption" sx={{ fontSize: 11.5, fontWeight: 600, display: "block" }}>Deliver {isBike ? "bike" : "car"} to me</Typography>
                  <Typography variant="caption" sx={{ fontSize: 10, color: "text.secondary" }}>{isBike ? "Bike" : "Car"} delivered to your location</Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography variant="caption" sx={{ fontSize: 10.5, color: "text.secondary" }}>{formatPrice(isBike ? 25000 : 50000)}</Typography>
                {deliveryToLocation && <CheckCircleRoundedIcon sx={{ fontSize: 16, color: "#03CD8C" }} />}
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {deliveryToLocation && (
          <TextField
            fullWidth
            size="small"
            placeholder="Delivery address"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PlaceRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                </InputAdornment>
              )
            }}
            sx={{
              mb: 1.5,
              "& .MuiOutlinedInput-root": { borderRadius: 2 }
            }}
          />
        )}

        {/* Promo code */}
        <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700, display: "block", mb: 0.75 }}>
          Promo code
        </Typography>
        <Stack direction="row" spacing={0.75} sx={{ mb: 1.5 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => { setPromoCode(e.target.value); setPromoApplied(false); }}
            disabled={promoApplied}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocalOfferRoundedIcon sx={{ fontSize: 16, color: promoApplied ? "#03CD8C" : "text.secondary" }} />
                </InputAdornment>
              )
            }}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: 2 }
            }}
          />
          <Button
            size="small"
            variant="outlined"
            onClick={handleApplyPromo}
            disabled={!promoCode.trim() || promoApplied}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontSize: 11,
              fontWeight: 600,
              minWidth: 60,
              borderColor: promoApplied ? "#03CD8C" : undefined,
              color: promoApplied ? "#03CD8C" : undefined
            }}
          >
            {promoApplied ? "Applied" : "Apply"}
          </Button>
        </Stack>
        {promoApplied && (
          <Typography variant="caption" sx={{ fontSize: 10.5, color: "#03CD8C", fontWeight: 600, display: "block", mt: -1, mb: 1.5 }}>
            🎉 Promo applied! {formatPrice(50000)} off
          </Typography>
        )}

        {/* Price summary */}
        <Divider sx={{ mb: 1.2 }} />
        <Stack spacing={0.35}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="caption" sx={{ fontSize: 11 }}>Vehicle rental ({getDays()} {getDays() === 1 ? "day" : "days"})</Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>{formatPrice(getBasePrice())}</Typography>
          </Stack>
          {driverCost > 0 && (
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" sx={{ fontSize: 11 }}>{isBike ? "Rider" : "Driver"} ({getDays()} {getDays() === 1 ? "day" : "days"})</Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>{formatPrice(driverCost)}</Typography>
            </Stack>
          )}
          {helmetCost > 0 && (
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" sx={{ fontSize: 11 }}>Extra helmet</Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>{formatPrice(helmetCost)}</Typography>
            </Stack>
          )}
          {gpsCost > 0 && (
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" sx={{ fontSize: 11 }}>GPS navigation</Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>{formatPrice(gpsCost)}</Typography>
            </Stack>
          )}
          {childSeatCost > 0 && (
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" sx={{ fontSize: 11 }}>Child seat</Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>{formatPrice(childSeatCost)}</Typography>
            </Stack>
          )}
          {insurancePlusCost > 0 && (
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" sx={{ fontSize: 11 }}>Premium insurance</Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>{formatPrice(insurancePlusCost)}</Typography>
            </Stack>
          )}
          {additionalDriverCost > 0 && (
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" sx={{ fontSize: 11 }}>Additional driver</Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>{formatPrice(additionalDriverCost)}</Typography>
            </Stack>
          )}
          {deliveryCost > 0 && (
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" sx={{ fontSize: 11 }}>{isBike ? "Bike" : "Car"} delivery</Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>{formatPrice(deliveryCost)}</Typography>
            </Stack>
          )}
          {promoDiscount > 0 && (
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" sx={{ fontSize: 11, color: "#03CD8C" }}>Promo discount</Typography>
              <Typography variant="caption" sx={{ fontSize: 11, color: "#03CD8C" }}>-{formatPrice(promoDiscount)}</Typography>
            </Stack>
          )}
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="caption" sx={{ fontSize: 11 }}>Refundable deposit</Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>{formatPrice(itemDeposit)}</Typography>
          </Stack>
          {item.fuelType !== "EV" && (
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" sx={{ fontSize: 10, color: "text.secondary" }}>
                Fuel policy: {fuelPolicy === "full-to-full" ? "Full-to-full" : "Pre-paid fuel"}
              </Typography>
            </Stack>
          )}
          {item.fuelType === "EV" && (
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" sx={{ fontSize: 10, color: "text.secondary" }}>
                {isBike ? "Battery" : "Charge"}: Returned fully charged or charge fee applies
              </Typography>
            </Stack>
          )}
          <Divider sx={{ my: 0.5 }} />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 700 }}>Total</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.main" }}>{formatPrice(totalCost + itemDeposit)}</Typography>
          </Stack>
        </Stack>

        {/* Terms and conditions */}
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              sx={{ p: 0.3, mr: 0.5, "& .MuiSvgIcon-root": { fontSize: 16 } }}
            />
          }
          label={
            <Typography variant="caption" sx={{ fontSize: 10.5, color: "text.secondary" }}>
              I agree to the <Typography component="span" sx={{ fontSize: 10.5, color: "primary.main", cursor: "pointer", fontWeight: 600 }}>rental terms & conditions</Typography>, <Typography component="span" sx={{ fontSize: 10.5, color: "primary.main", cursor: "pointer", fontWeight: 600 }}>cancellation policy</Typography> and confirm I meet the age requirement ({itemAgeReq}+ years){isBike ? ` with a valid ${(item as Motorbike).licenseClass} license` : ""}.
            </Typography>
          }
          sx={{ mt: 1.25, mx: 0, alignItems: "flex-start" }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 2.5, pb: 2 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleConfirmBooking}
          disabled={!agreedToTerms}
          sx={{
            borderRadius: 999,
            py: 1,
            fontSize: 14,
            fontWeight: 700,
            textTransform: "none",
            bgcolor: agreedToTerms ? "primary.main" : undefined,
            color: agreedToTerms ? "#020617" : undefined,
            "&:hover": { bgcolor: "#06e29a" }
          }}
        >
          Continue to payment
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ─────────────────── Vehicle Card ─────────────────── */

interface VehicleCardProps {
  vehicle: Vehicle;
  onBook: (v: AnyRentable) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  isCompare: boolean;
  onToggleCompare: (id: string) => void;
}

function VehicleCard({ vehicle, onBook, isFavorite, onToggleFavorite, isCompare, onToggleCompare }: VehicleCardProps): React.JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const fc = fuelTypeConfig[vehicle.fuelType];

  return (
    <Card
      elevation={0}
      sx={{
        mb: 1.75,
        borderRadius: 2.5,
        overflow: "hidden",
        bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
        border: (t) =>
          expanded
            ? `1px solid ${fc.color}`
            : t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)",
        transition: "border-color 0.2s ease"
      }}
    >
      {/* Car image */}
      <Box
        sx={{
          height: 150,
          overflow: "hidden",
          position: "relative",
          bgcolor: (t) => t.palette.mode === "light" ? "#F3F4F6" : "#0F172A"
        }}
      >
        <Box
          component="img"
          src={vehicle.image}
          alt={vehicle.name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />
        {/* Fuel type badge */}
        <Chip
          size="small"
          icon={fc.icon as React.ReactElement}
          label={fc.label}
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            borderRadius: 999,
            fontSize: 10,
            height: 22,
            bgcolor: "rgba(15,23,42,0.8)",
            color: fc.color,
            fontWeight: 600,
            backdropFilter: "blur(8px)",
            "& .MuiChip-icon": { color: fc.color }
          }}
        />
        {vehicle.tag && (
          <Chip
            size="small"
            label={vehicle.tag}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              borderRadius: 999,
              fontSize: 10,
              height: 22,
              bgcolor: "rgba(3,205,140,0.9)",
              color: "#020617",
              fontWeight: 700,
              backdropFilter: "blur(8px)"
            }}
          />
        )}
        {/* Action icons on image */}
        <Stack direction="row" spacing={0.5} sx={{ position: "absolute", bottom: 8, right: 8 }}>
          <Tooltip title={isCompare ? "Remove from compare" : "Compare"} arrow>
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); onToggleCompare(vehicle.id); }}
              sx={{
                width: 28,
                height: 28,
                bgcolor: isCompare ? "rgba(3,205,140,0.9)" : "rgba(15,23,42,0.7)",
                color: isCompare ? "#020617" : "#FFF",
                backdropFilter: "blur(6px)",
                "&:hover": { bgcolor: isCompare ? "rgba(3,205,140,1)" : "rgba(15,23,42,0.85)" }
              }}
            >
              <CompareArrowsRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share" arrow>
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); navigator.clipboard?.writeText(`Check out ${vehicle.name} on Rider Rentals!`); }}
              sx={{
                width: 28,
                height: 28,
                bgcolor: "rgba(15,23,42,0.7)",
                color: "#FFF",
                backdropFilter: "blur(6px)",
                "&:hover": { bgcolor: "rgba(15,23,42,0.85)" }
              }}
            >
              <ShareRoundedIcon sx={{ fontSize: 15 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title={isFavorite ? "Remove from wishlist" : "Add to wishlist"} arrow>
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(vehicle.id); }}
              sx={{
                width: 28,
                height: 28,
                bgcolor: isFavorite ? "rgba(239,68,68,0.9)" : "rgba(15,23,42,0.7)",
                color: "#FFF",
                backdropFilter: "blur(6px)",
                "&:hover": { bgcolor: isFavorite ? "rgba(239,68,68,1)" : "rgba(15,23,42,0.85)" }
              }}
            >
              {isFavorite ? <FavoriteRoundedIcon sx={{ fontSize: 15 }} /> : <FavoriteBorderRoundedIcon sx={{ fontSize: 15 }} />}
            </IconButton>
          </Tooltip>
        </Stack>

        {!vehicle.available && (
          <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="body2" sx={{ color: "#FFF", fontWeight: 700 }}>Currently unavailable</Typography>
          </Box>
        )}
      </Box>

      <CardContent sx={{ px: 1.75, py: 1.5, "&:last-child": { pb: 1.5 } }}>
        {/* Title + rating */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 0.5 }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.01em" }}>
              {vehicle.name}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11, color: "text.secondary" }}>
              {vehicle.brand} • {vehicle.category} • {vehicle.year}
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.3} alignItems="center">
            <StarRoundedIcon sx={{ fontSize: 14, color: "#F59E0B" }} />
            <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600 }}>{vehicle.rating}</Typography>
            <Typography variant="caption" sx={{ fontSize: 10, color: "text.secondary" }}>({vehicle.reviews})</Typography>
          </Stack>
        </Stack>

        {/* Quick specs */}
        <Stack direction="row" spacing={1.25} sx={{ mb: 1 }} flexWrap="wrap">
          <Stack direction="row" spacing={0.3} alignItems="center">
            <PeopleAltRoundedIcon sx={{ fontSize: 14, color: "text.secondary" }} />
            <Typography variant="caption" sx={{ fontSize: 10.5, color: "text.secondary" }}>{vehicle.seats} seats</Typography>
          </Stack>
          <Stack direction="row" spacing={0.3} alignItems="center">
            <SettingsRoundedIcon sx={{ fontSize: 14, color: "text.secondary" }} />
            <Typography variant="caption" sx={{ fontSize: 10.5, color: "text.secondary" }}>{vehicle.transmission}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.3} alignItems="center">
            <SpeedRoundedIcon sx={{ fontSize: 14, color: "text.secondary" }} />
            <Typography variant="caption" sx={{ fontSize: 10.5, color: "text.secondary" }}>{vehicle.range}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.3} alignItems="center">
            <LuggageRoundedIcon sx={{ fontSize: 14, color: "text.secondary" }} />
            <Typography variant="caption" sx={{ fontSize: 10.5, color: "text.secondary" }}>{vehicle.luggage}</Typography>
          </Stack>
        </Stack>

        {/* Price + book button */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.02em" }}>
              {formatPrice(vehicle.pricePerDay)}
              <Typography component="span" variant="caption" sx={{ fontSize: 10.5, fontWeight: 400, color: "text.secondary" }}> /day</Typography>
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 10, color: "text.secondary" }}>
              {formatPrice(vehicle.pricePerWeek)}/week • {formatPrice(vehicle.pricePerMonth)}/month
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.6} alignItems="center">
            <Button
              size="small"
              variant="contained"
              onClick={() => vehicle.available && onBook(vehicle)}
              disabled={!vehicle.available}
              sx={{
                borderRadius: 999,
                px: 1.3,
                py: 0.3,
                fontSize: 10.5,
                fontWeight: 700,
                textTransform: "none",
                minWidth: "auto",
                bgcolor: "primary.main",
                color: "#020617",
                "&:hover": { bgcolor: "#06e29a" }
              }}
            >
              Book now
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={() => setExpanded(!expanded)}
              startIcon={expanded ? <ExpandLessRoundedIcon sx={{ fontSize: 15 }} /> : <ExpandMoreRoundedIcon sx={{ fontSize: 15 }} />}
              sx={{
                borderRadius: 999,
                px: 1.3,
                py: 0.3,
                fontSize: 10.5,
                fontWeight: 600,
                textTransform: "none",
                minWidth: "auto",
                bgcolor: "rgba(251,146,60,0.2)",
                color: "#EA580C",
                boxShadow: "none",
                "&:hover": { bgcolor: "rgba(251,146,60,0.35)", boxShadow: "none" },
                "& .MuiButton-startIcon": { mr: 0.3 }
              }}
            >
              Details
            </Button>
          </Stack>
        </Stack>

        {/* Expanded details */}
        <Collapse in={expanded} timeout={250}>
          <Divider sx={{ my: 1 }} />

          {/* Amenities row */}
          <Stack direction="row" spacing={1.25} sx={{ mb: 1 }}>
            {vehicle.ac && (
              <Chip size="small" icon={<AcUnitRoundedIcon sx={{ fontSize: 13 }} />} label="A/C" sx={{ borderRadius: 999, fontSize: 10, height: 22, bgcolor: (t) => t.palette.mode === "light" ? "#F3F4F6" : "rgba(51,65,85,0.5)" }} />
            )}
            {vehicle.bluetooth && (
              <Chip size="small" icon={<BluetoothRoundedIcon sx={{ fontSize: 13 }} />} label="Bluetooth" sx={{ borderRadius: 999, fontSize: 10, height: 22, bgcolor: (t) => t.palette.mode === "light" ? "#F3F4F6" : "rgba(51,65,85,0.5)" }} />
            )}
            {vehicle.gps && (
              <Chip size="small" icon={<GpsFixedRoundedIcon sx={{ fontSize: 13 }} />} label="GPS" sx={{ borderRadius: 999, fontSize: 10, height: 22, bgcolor: (t) => t.palette.mode === "light" ? "#F3F4F6" : "rgba(51,65,85,0.5)" }} />
            )}
          </Stack>

          {/* Features list */}
          <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700, display: "block", mb: 0.5 }}>
            Key features
          </Typography>
          <Stack spacing={0.3} sx={{ mb: 1 }}>
            {vehicle.features.map((f, i) => (
              <Stack key={i} direction="row" spacing={0.5} alignItems="center">
                <CheckCircleRoundedIcon sx={{ fontSize: 12, color: "#03CD8C" }} />
                <Typography variant="caption" sx={{ fontSize: 11 }}>{f}</Typography>
              </Stack>
            ))}
          </Stack>

          {/* Terms row */}
          <Stack spacing={0.4}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <SpeedRoundedIcon sx={{ fontSize: 13, color: "text.secondary" }} />
              <Typography variant="caption" sx={{ fontSize: 10.5, color: "text.secondary" }}>Mileage limit: {vehicle.mileageLimit}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <PersonRoundedIcon sx={{ fontSize: 13, color: "text.secondary" }} />
              <Typography variant="caption" sx={{ fontSize: 10.5, color: "text.secondary" }}>Min. age: {vehicle.ageRequirement} years</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <ShieldRoundedIcon sx={{ fontSize: 13, color: "text.secondary" }} />
              <Typography variant="caption" sx={{ fontSize: 10.5, color: "text.secondary" }}>Insurance & roadside support included</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <CalendarMonthRoundedIcon sx={{ fontSize: 13, color: "text.secondary" }} />
              <Typography variant="caption" sx={{ fontSize: 10.5, color: "text.secondary" }}>Free cancellation up to 24h before pickup</Typography>
            </Stack>
          </Stack>

          {/* Rating */}
          <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 0.75 }}>
            <Rating value={vehicle.rating} precision={0.1} readOnly size="small" />
            <Typography variant="caption" sx={{ fontSize: 11, color: "text.secondary" }}>
              {vehicle.rating}/5 ({vehicle.reviews} reviews)
            </Typography>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}

/* ─────────────────── Motorbike Card ─────────────────── */

interface MotorbikeCardProps {
  bike: Motorbike;
  onBook: (b: AnyRentable) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  isCompare: boolean;
  onToggleCompare: (id: string) => void;
}

function MotorbikeCard({ bike, onBook, isFavorite, onToggleFavorite, isCompare, onToggleCompare }: MotorbikeCardProps): React.JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const fc = fuelTypeConfig[bike.fuelType];

  return (
    <Card
      elevation={0}
      sx={{
        mb: 1.75,
        borderRadius: 2.5,
        overflow: "hidden",
        bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
        border: (t) =>
          expanded
            ? `1px solid ${fc.color}`
            : t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)",
        transition: "border-color 0.2s ease"
      }}
    >
      {/* Bike image */}
      <Box
        sx={{
          height: 150,
          overflow: "hidden",
          position: "relative",
          bgcolor: (t) => t.palette.mode === "light" ? "#F3F4F6" : "#0F172A"
        }}
      >
        <Box
          component="img"
          src={bike.image}
          alt={bike.name}
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {/* Fuel type badge */}
        <Chip
          size="small"
          icon={fc.icon as React.ReactElement}
          label={fc.label}
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            borderRadius: 999,
            fontSize: 10,
            height: 22,
            bgcolor: "rgba(15,23,42,0.8)",
            color: fc.color,
            fontWeight: 600,
            backdropFilter: "blur(8px)",
            "& .MuiChip-icon": { color: fc.color }
          }}
        />
        {/* Bike type badge */}
        <Chip
          size="small"
          icon={<TwoWheelerRoundedIcon sx={{ fontSize: 12 }} />}
          label={bike.bikeType}
          sx={{
            position: "absolute",
            top: 34,
            left: 8,
            borderRadius: 999,
            fontSize: 10,
            height: 22,
            bgcolor: "rgba(15,23,42,0.8)",
            color: "#A78BFA",
            fontWeight: 600,
            backdropFilter: "blur(8px)",
            "& .MuiChip-icon": { color: "#A78BFA" }
          }}
        />
        {bike.tag && (
          <Chip
            size="small"
            label={bike.tag}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              borderRadius: 999,
              fontSize: 10,
              height: 22,
              bgcolor: "rgba(3,205,140,0.9)",
              color: "#020617",
              fontWeight: 700,
              backdropFilter: "blur(8px)"
            }}
          />
        )}
        {/* Action icons */}
        <Stack direction="row" spacing={0.5} sx={{ position: "absolute", bottom: 8, right: 8 }}>
          <Tooltip title={isCompare ? "Remove from compare" : "Compare"} arrow>
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); onToggleCompare(bike.id); }}
              sx={{
                width: 28,
                height: 28,
                bgcolor: isCompare ? "rgba(3,205,140,0.9)" : "rgba(15,23,42,0.7)",
                color: isCompare ? "#020617" : "#FFF",
                backdropFilter: "blur(6px)",
                "&:hover": { bgcolor: isCompare ? "rgba(3,205,140,1)" : "rgba(15,23,42,0.85)" }
              }}
            >
              <CompareArrowsRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share" arrow>
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); navigator.clipboard?.writeText(`Check out ${bike.name} on Rider Rentals!`); }}
              sx={{
                width: 28,
                height: 28,
                bgcolor: "rgba(15,23,42,0.7)",
                color: "#FFF",
                backdropFilter: "blur(6px)",
                "&:hover": { bgcolor: "rgba(15,23,42,0.85)" }
              }}
            >
              <ShareRoundedIcon sx={{ fontSize: 15 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title={isFavorite ? "Remove from wishlist" : "Add to wishlist"} arrow>
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(bike.id); }}
              sx={{
                width: 28,
                height: 28,
                bgcolor: isFavorite ? "rgba(239,68,68,0.9)" : "rgba(15,23,42,0.7)",
                color: "#FFF",
                backdropFilter: "blur(6px)",
                "&:hover": { bgcolor: isFavorite ? "rgba(239,68,68,1)" : "rgba(15,23,42,0.85)" }
              }}
            >
              {isFavorite ? <FavoriteRoundedIcon sx={{ fontSize: 15 }} /> : <FavoriteBorderRoundedIcon sx={{ fontSize: 15 }} />}
            </IconButton>
          </Tooltip>
        </Stack>

        {!bike.available && (
          <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="body2" sx={{ color: "#FFF", fontWeight: 700 }}>Currently unavailable</Typography>
          </Box>
        )}
      </Box>

      <CardContent sx={{ px: 1.75, py: 1.5, "&:last-child": { pb: 1.5 } }}>
        {/* Title + rating */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 0.5 }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.01em" }}>
              {bike.name}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11, color: "text.secondary" }}>
              {bike.brand} • {bike.engineSize} • {bike.year}
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.3} alignItems="center">
            <StarRoundedIcon sx={{ fontSize: 14, color: "#F59E0B" }} />
            <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600 }}>{bike.rating}</Typography>
            <Typography variant="caption" sx={{ fontSize: 10, color: "text.secondary" }}>({bike.reviews})</Typography>
          </Stack>
        </Stack>

        {/* Quick specs */}
        <Stack direction="row" spacing={1.25} sx={{ mb: 1 }} flexWrap="wrap">
          <Stack direction="row" spacing={0.3} alignItems="center">
            <SpeedRoundedIcon sx={{ fontSize: 14, color: "text.secondary" }} />
            <Typography variant="caption" sx={{ fontSize: 10.5, color: "text.secondary" }}>{bike.topSpeed}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.3} alignItems="center">
            <SettingsRoundedIcon sx={{ fontSize: 14, color: "text.secondary" }} />
            <Typography variant="caption" sx={{ fontSize: 10.5, color: "text.secondary" }}>{bike.transmission}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.3} alignItems="center">
            {bike.fuelType === "EV" ? <BatteryChargingFullRoundedIcon sx={{ fontSize: 14, color: "text.secondary" }} /> : <LocalGasStationRoundedIcon sx={{ fontSize: 14, color: "text.secondary" }} />}
            <Typography variant="caption" sx={{ fontSize: 10.5, color: "text.secondary" }}>{bike.range}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.3} alignItems="center">
            <FitnessCenterRoundedIcon sx={{ fontSize: 14, color: "text.secondary" }} />
            <Typography variant="caption" sx={{ fontSize: 10.5, color: "text.secondary" }}>{bike.weight}</Typography>
          </Stack>
        </Stack>

        {/* Price + book button */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.02em" }}>
              {formatPrice(bike.pricePerDay)}
              <Typography component="span" variant="caption" sx={{ fontSize: 10.5, fontWeight: 400, color: "text.secondary" }}> /day</Typography>
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 10, color: "text.secondary" }}>
              {formatPrice(bike.pricePerWeek)}/week • {formatPrice(bike.pricePerMonth)}/month
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.6} alignItems="center">
            <Button
              size="small"
              variant="contained"
              onClick={() => bike.available && onBook(bike)}
              disabled={!bike.available}
              sx={{
                borderRadius: 999,
                px: 1.3,
                py: 0.3,
                fontSize: 10.5,
                fontWeight: 700,
                textTransform: "none",
                minWidth: "auto",
                bgcolor: "primary.main",
                color: "#020617",
                "&:hover": { bgcolor: "#06e29a" }
              }}
            >
              Book now
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={() => setExpanded(!expanded)}
              startIcon={expanded ? <ExpandLessRoundedIcon sx={{ fontSize: 15 }} /> : <ExpandMoreRoundedIcon sx={{ fontSize: 15 }} />}
              sx={{
                borderRadius: 999,
                px: 1.3,
                py: 0.3,
                fontSize: 10.5,
                fontWeight: 600,
                textTransform: "none",
                minWidth: "auto",
                bgcolor: "rgba(251,146,60,0.2)",
                color: "#EA580C",
                boxShadow: "none",
                "&:hover": { bgcolor: "rgba(251,146,60,0.35)", boxShadow: "none" },
                "& .MuiButton-startIcon": { mr: 0.3 }
              }}
            >
              Details
            </Button>
          </Stack>
        </Stack>

        {/* Expanded details */}
        <Collapse in={expanded} timeout={250}>
          <Divider sx={{ my: 1 }} />

          {/* Included items */}
          <Stack direction="row" spacing={1} sx={{ mb: 1 }} flexWrap="wrap">
            {bike.helmetIncluded && (
              <Chip size="small" icon={<SportsMotorsportsRoundedIcon sx={{ fontSize: 13 }} />} label="Helmet incl." sx={{ borderRadius: 999, fontSize: 10, height: 22, bgcolor: (t) => t.palette.mode === "light" ? "#F3F4F6" : "rgba(51,65,85,0.5)" }} />
            )}
            {bike.abs && (
              <Chip size="small" icon={<ShieldRoundedIcon sx={{ fontSize: 13 }} />} label="ABS" sx={{ borderRadius: 999, fontSize: 10, height: 22, bgcolor: (t) => t.palette.mode === "light" ? "#F3F4F6" : "rgba(51,65,85,0.5)" }} />
            )}
            {bike.storageBox && (
              <Chip size="small" icon={<InventoryRoundedIcon sx={{ fontSize: 13 }} />} label="Storage box" sx={{ borderRadius: 999, fontSize: 10, height: 22, bgcolor: (t) => t.palette.mode === "light" ? "#F3F4F6" : "rgba(51,65,85,0.5)" }} />
            )}
            {bike.usbCharging && (
              <Chip size="small" icon={<BatteryChargingFullRoundedIcon sx={{ fontSize: 13 }} />} label="USB charge" sx={{ borderRadius: 999, fontSize: 10, height: 22, bgcolor: (t) => t.palette.mode === "light" ? "#F3F4F6" : "rgba(51,65,85,0.5)" }} />
            )}
          </Stack>

          {/* Features list */}
          <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700, display: "block", mb: 0.5 }}>
            Key features
          </Typography>
          <Stack spacing={0.3} sx={{ mb: 1 }}>
            {bike.features.map((f, i) => (
              <Stack key={i} direction="row" spacing={0.5} alignItems="center">
                <CheckCircleRoundedIcon sx={{ fontSize: 12, color: "#03CD8C" }} />
                <Typography variant="caption" sx={{ fontSize: 11 }}>{f}</Typography>
              </Stack>
            ))}
          </Stack>

          {/* Specs row */}
          <Stack spacing={0.4}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <SpeedRoundedIcon sx={{ fontSize: 13, color: "text.secondary" }} />
              <Typography variant="caption" sx={{ fontSize: 10.5, color: "text.secondary" }}>Mileage limit: {bike.mileageLimit}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <PersonRoundedIcon sx={{ fontSize: 13, color: "text.secondary" }} />
              <Typography variant="caption" sx={{ fontSize: 10.5, color: "text.secondary" }}>Min. age: {bike.ageRequirement} years • License: {bike.licenseClass}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <ShieldRoundedIcon sx={{ fontSize: 13, color: "text.secondary" }} />
              <Typography variant="caption" sx={{ fontSize: 10.5, color: "text.secondary" }}>Basic insurance & roadside assistance included</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <CalendarMonthRoundedIcon sx={{ fontSize: 13, color: "text.secondary" }} />
              <Typography variant="caption" sx={{ fontSize: 10.5, color: "text.secondary" }}>Free cancellation up to 24h before pickup</Typography>
            </Stack>
          </Stack>

          {/* Rating */}
          <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 0.75 }}>
            <Rating value={bike.rating} precision={0.1} readOnly size="small" />
            <Typography variant="caption" sx={{ fontSize: 11, color: "text.secondary" }}>
              {bike.rating}/5 ({bike.reviews} reviews)
            </Typography>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}

/* ─────────────────── Main Dashboard ─────────────────── */

function RentalDashboardHomeScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [rentalMode, setRentalMode] = useState<"cars" | "bikes">("cars");
  const [searchQuery, setSearchQuery] = useState("");
  const [fuelFilter, setFuelFilter] = useState<"all" | "EV" | "Petrol" | "Diesel" | "Hybrid">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [bikeCategoryFilter, setBikeCategoryFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"price" | "rating" | "name">("price");
  const [bookingItem, setBookingItem] = useState<AnyRentable | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const [showCompare, setShowCompare] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");

  const handleToggleFavorite = (id: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); setSnackMsg("Removed from wishlist"); }
      else { next.add(id); setSnackMsg("Added to wishlist ❤️"); }
      return next;
    });
  };

  const handleToggleCompare = (id: string) => {
    setCompareIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); }
      else if (next.size < 3) { next.add(id); setSnackMsg(`${next.size + 1} in compare`); }
      else { setSnackMsg("Max 3 to compare"); return prev; }
      return next;
    });
  };

  const handleSwitchMode = (newMode: "cars" | "bikes") => {
    setRentalMode(newMode);
    setSearchQuery("");
    setFuelFilter("all");
    setCategoryFilter("all");
    setBikeCategoryFilter("all");
    setCompareIds(new Set());
    setShowCompare(false);
  };

  /* ── Cars filtering ── */
  let filteredCars = VEHICLES.filter((v) => {
    const matchSearch =
      !searchQuery ||
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFuel = fuelFilter === "all" || v.fuelType === fuelFilter;
    const matchCategory = categoryFilter === "all" || v.category === categoryFilter;
    return matchSearch && matchFuel && matchCategory;
  });
  filteredCars = [...filteredCars].sort((a, b) => {
    if (sortBy === "price") return a.pricePerDay - b.pricePerDay;
    if (sortBy === "rating") return b.rating - a.rating;
    return a.name.localeCompare(b.name);
  });

  /* ── Bikes filtering ── */
  let filteredBikes = MOTORBIKES.filter((b) => {
    const matchSearch =
      !searchQuery ||
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bikeType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFuel = fuelFilter === "all" || b.fuelType === fuelFilter;
    const matchBikeCat = bikeCategoryFilter === "all" || b.bikeType === bikeCategoryFilter;
    return matchSearch && matchFuel && matchBikeCat;
  });
  filteredBikes = [...filteredBikes].sort((a, b) => {
    if (sortBy === "price") return a.pricePerDay - b.pricePerDay;
    if (sortBy === "rating") return b.rating - a.rating;
    return a.name.localeCompare(b.name);
  });

  const carEvCount = VEHICLES.filter((v) => v.fuelType === "EV").length;
  const carFuelCount = VEHICLES.filter((v) => v.fuelType !== "EV").length;
  const bikeEvCount = MOTORBIKES.filter((b) => b.fuelType === "EV").length;
  const bikeFuelCount = MOTORBIKES.filter((b) => b.fuelType !== "EV").length;

  const evCount = rentalMode === "cars" ? carEvCount : bikeEvCount;
  const nonEvCount = rentalMode === "cars" ? carFuelCount : bikeFuelCount;
  const totalCount = rentalMode === "cars" ? VEHICLES.length : MOTORBIKES.length;

  return (
    <Box>
      {/* Green Header */}
      <Box sx={{ bgcolor: "#03CD8C", px: 2, pt: 2, pb: 2, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <IconButton
          size="small"
          aria-label="Back"
          onClick={() => navigate(-1)}
          sx={{
            position: "absolute",
            left: 20,
            borderRadius: 999,
            bgcolor: "rgba(255,255,255,0.2)",
            color: "#FFFFFF",
            "&:hover": { bgcolor: "rgba(255,255,255,0.3)" }
          }}
        >
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 999,
              bgcolor: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {rentalMode === "cars"
              ? <DirectionsCarRoundedIcon sx={{ fontSize: 20, color: "#FFFFFF" }} />
              : <TwoWheelerRoundedIcon sx={{ fontSize: 20, color: "#FFFFFF" }} />
            }
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: "-0.01em", color: "#FFFFFF", lineHeight: 1.2 }}>
              {rentalMode === "cars" ? "Car rentals" : "Motorbike rentals"}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 10, color: "rgba(255,255,255,0.85)", display: "block" }}>
              {totalCount} {rentalMode === "cars" ? "vehicles" : "bikes"} • {evCount} EV • {nonEvCount} fuel
            </Typography>
          </Box>
        </Stack>
      </Box>

    <Box sx={{ px: 2.5, pt: 2, pb: 3 }}>

        {/* Cars / Bikes toggle */}
        <Stack direction="row" spacing={2} sx={{ mb: 2.5 }}>
          <Button
            size="small"
            variant={rentalMode === "cars" ? "contained" : "outlined"}
            startIcon={<DirectionsCarRoundedIcon sx={{ fontSize: 16 }} />}
            onClick={() => handleSwitchMode("cars")}
            sx={{
              borderRadius: 999,
              px: 2,
              py: 0.6,
              fontSize: 12,
              fontWeight: 700,
              textTransform: "none",
              flex: 1,
              bgcolor: rentalMode === "cars" ? "primary.main" : "transparent",
              color: rentalMode === "cars" ? "#020617" : (t) => t.palette.text.primary,
              borderColor: rentalMode === "cars" ? "primary.main" : (t) => t.palette.mode === "light" ? "rgba(209,213,219,0.9)" : "rgba(51,65,85,0.9)",
              "&:hover": {
                bgcolor: rentalMode === "cars" ? "#06e29a" : (t) => t.palette.mode === "light" ? "rgba(209,213,219,0.2)" : "rgba(51,65,85,0.3)",
                borderColor: rentalMode === "cars" ? "#06e29a" : "primary.main"
              }
            }}
          >
            Cars ({VEHICLES.length})
          </Button>
          <Button
            size="small"
            variant={rentalMode === "bikes" ? "contained" : "outlined"}
            startIcon={<TwoWheelerRoundedIcon sx={{ fontSize: 16 }} />}
            onClick={() => handleSwitchMode("bikes")}
            sx={{
              borderRadius: 999,
              px: 2,
              py: 0.6,
              fontSize: 12,
              fontWeight: 700,
              textTransform: "none",
              flex: 1,
              bgcolor: rentalMode === "bikes" ? "primary.main" : "transparent",
              color: rentalMode === "bikes" ? "#020617" : (t) => t.palette.text.primary,
              borderColor: rentalMode === "bikes" ? "primary.main" : (t) => t.palette.mode === "light" ? "rgba(209,213,219,0.9)" : "rgba(51,65,85,0.9)",
              "&:hover": {
                bgcolor: rentalMode === "bikes" ? "#06e29a" : (t) => t.palette.mode === "light" ? "rgba(209,213,219,0.2)" : "rgba(51,65,85,0.3)",
                borderColor: rentalMode === "bikes" ? "#06e29a" : "primary.main"
              }
            }}
          >
            Motorbikes ({MOTORBIKES.length})
          </Button>
        </Stack>

      {/* Search bar */}
      <TextField
        fullWidth
        size="small"
        placeholder={rentalMode === "cars" ? "Search cars by name, brand, or category..." : "Search bikes by name, brand, or type..."}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon sx={{ fontSize: 20, color: "text.secondary" }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setShowFilters(!showFilters)}>
                <FilterListRoundedIcon sx={{ fontSize: 20, color: showFilters ? "primary.main" : "text.secondary" }} />
              </IconButton>
            </InputAdornment>
          )
        }}
        sx={{
          mb: 1.5,
          "& .MuiOutlinedInput-root": {
            borderRadius: 999,
            bgcolor: (t) => t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
            "& fieldset": {
              borderColor: (t) => t.palette.mode === "light" ? "rgba(209,213,219,0.9)" : "rgba(51,65,85,0.9)"
            },
            "&:hover fieldset": { borderColor: "primary.main" }
          }
        }}
      />

      {/* Filters panel */}
      <Collapse in={showFilters} timeout={200}>
        <Card
          elevation={0}
          sx={{
            mb: 1.5,
            borderRadius: 2,
            bgcolor: (t) => t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
            border: (t) => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)"
          }}
        >
          <CardContent sx={{ px: 1.5, py: 1.25, "&:last-child": { pb: 1.25 } }}>
            {/* Fuel type filter */}
            <Typography variant="caption" sx={{ fontSize: 10.5, fontWeight: 700, display: "block", mb: 0.5 }}>Fuel type</Typography>
            <Stack direction="row" spacing={0.5} sx={{ mb: 1, flexWrap: "wrap" }}>
              {(rentalMode === "cars"
                ? ["all", "EV", "Petrol", "Diesel", "Hybrid"] as const
                : ["all", "EV", "Petrol"] as const
              ).map((ft) => (
                <Chip
                  key={ft}
                  label={ft === "all" ? "All types" : ft}
                  size="small"
                  onClick={() => setFuelFilter(ft as typeof fuelFilter)}
                  sx={{
                    borderRadius: 999,
                    fontSize: 10.5,
                    height: 24,
                    fontWeight: 600,
                    bgcolor: fuelFilter === ft ? "primary.main" : (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(51,65,85,0.5)",
                    color: fuelFilter === ft ? "#020617" : (t) => t.palette.text.primary,
                    border: (t) => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.7)" : "1px solid rgba(51,65,85,0.7)"
                  }}
                />
              ))}
            </Stack>

            {/* Category filter */}
            <Typography variant="caption" sx={{ fontSize: 10.5, fontWeight: 700, display: "block", mb: 0.5 }}>
              {rentalMode === "cars" ? "Category" : "Bike type"}
            </Typography>
            <Stack direction="row" spacing={0.5} sx={{ mb: 1, flexWrap: "wrap" }}>
              {rentalMode === "cars" ? (
                (["all", "Sedan", "SUV", "Hatchback", "Van", "Pickup", "Luxury"] as const).map((cat) => (
                  <Chip
                    key={cat}
                    label={cat === "all" ? "All" : cat}
                    size="small"
                    onClick={() => setCategoryFilter(cat)}
                    sx={{
                      borderRadius: 999,
                      fontSize: 10.5,
                      height: 24,
                      fontWeight: 600,
                      bgcolor: categoryFilter === cat ? "primary.main" : (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(51,65,85,0.5)",
                      color: categoryFilter === cat ? "#020617" : (t) => t.palette.text.primary,
                      border: (t) => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.7)" : "1px solid rgba(51,65,85,0.7)"
                    }}
                  />
                ))
              ) : (
                (["all", ...BIKE_CATEGORIES] as string[]).map((cat) => (
                  <Chip
                    key={cat}
                    label={cat === "all" ? "All" : cat}
                    size="small"
                    onClick={() => setBikeCategoryFilter(cat)}
                    sx={{
                      borderRadius: 999,
                      fontSize: 10.5,
                      height: 24,
                      fontWeight: 600,
                      bgcolor: bikeCategoryFilter === cat ? "primary.main" : (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(51,65,85,0.5)",
                      color: bikeCategoryFilter === cat ? "#020617" : (t) => t.palette.text.primary,
                      border: (t) => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.7)" : "1px solid rgba(51,65,85,0.7)"
                    }}
                  />
                ))
              )}
            </Stack>

            {/* Sort */}
            <Typography variant="caption" sx={{ fontSize: 10.5, fontWeight: 700, display: "block", mb: 0.5 }}>Sort by</Typography>
            <Stack direction="row" spacing={0.5}>
              {([["price", "Price (low–high)"], ["rating", "Rating (high–low)"], ["name", "Name (A–Z)"]] as [string, string][]).map(([key, label]) => (
                <Chip
                  key={key}
                  label={label}
                  size="small"
                  onClick={() => setSortBy(key as "price" | "rating" | "name")}
                  sx={{
                    borderRadius: 999,
                    fontSize: 10.5,
                    height: 24,
                    fontWeight: 600,
                    bgcolor: sortBy === key ? "primary.main" : (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(51,65,85,0.5)",
                    color: sortBy === key ? "#020617" : (t) => t.palette.text.primary,
                    border: (t) => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.7)" : "1px solid rgba(51,65,85,0.7)"
                  }}
                />
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Collapse>

      {/* Results count */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.25 }}>
        <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600 }}>
          {rentalMode === "cars" ? filteredCars.length : filteredBikes.length}{" "}
          {rentalMode === "cars"
            ? (filteredCars.length === 1 ? "vehicle" : "vehicles")
            : (filteredBikes.length === 1 ? "bike" : "bikes")
          } available
        </Typography>
        <Stack direction="row" spacing={0.5}>
          <Chip
            size="small"
            icon={<BatteryChargingFullRoundedIcon sx={{ fontSize: 12 }} />}
            label={`${evCount} EV`}
            sx={{ borderRadius: 999, fontSize: 10, height: 20, bgcolor: "rgba(22,163,74,0.12)", color: "#16A34A", fontWeight: 600, "& .MuiChip-icon": { color: "#16A34A" } }}
          />
          <Chip
            size="small"
            icon={<LocalGasStationRoundedIcon sx={{ fontSize: 12 }} />}
            label={`${nonEvCount} Fuel`}
            sx={{ borderRadius: 999, fontSize: 10, height: 20, bgcolor: "rgba(245,158,11,0.12)", color: "#F59E0B", fontWeight: 600, "& .MuiChip-icon": { color: "#F59E0B" } }}
          />
        </Stack>
      </Stack>

      {/* === CARS LIST === */}
      {rentalMode === "cars" && (
        <>
          {filteredCars.length === 0 ? (
            <Box sx={{ mx: 7, textAlign: "center", py: 4 }}>
              <DirectionsCarRoundedIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
              <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
                No vehicles match your filters
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11, color: "text.secondary" }}>
                Try adjusting your search or filter criteria
              </Typography>
            </Box>
          ) : (
            filteredCars.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onBook={setBookingItem}
                isFavorite={favoriteIds.has(vehicle.id)}
                onToggleFavorite={handleToggleFavorite}
                isCompare={compareIds.has(vehicle.id)}
                onToggleCompare={handleToggleCompare}
              />
            ))
          )}
        </>
      )}

      {/* === BIKES LIST === */}
      {rentalMode === "bikes" && (
        <>
          {filteredBikes.length === 0 ? (
            <Box sx={{ mx: 7, textAlign: "center", py: 4 }}>
              <TwoWheelerRoundedIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
              <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
                No bikes match your filters
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11, color: "text.secondary" }}>
                Try adjusting your search or filter criteria
              </Typography>
            </Box>
          ) : (
            filteredBikes.map((bike) => (
              <MotorbikeCard
                key={bike.id}
                bike={bike}
                onBook={setBookingItem}
                isFavorite={favoriteIds.has(bike.id)}
                onToggleFavorite={handleToggleFavorite}
                isCompare={compareIds.has(bike.id)}
                onToggleCompare={handleToggleCompare}
              />
            ))
          )}
        </>
      )}

      {/* Terms footer */}
      <Stack spacing={0.3} sx={{ mt: 1 }}>
        {rentalMode === "cars" ? (
          <>
            <Typography variant="caption" sx={{ fontSize: 10.5, color: "text.secondary" }}>
              • A valid driver's license is required for self-drive. International drivers may need an IDP.
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 10.5, color: "text.secondary" }}>
              • Refundable deposit is charged at pickup and returned after vehicle inspection.
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 10.5, color: "text.secondary" }}>
              • Free cancellation up to 24 hours before the scheduled pickup time.
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="caption" sx={{ fontSize: 10.5, color: "text.secondary" }}>
              • A valid motorcycle license (A1/A2/A) is required. Helmet is included with every rental.
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 10.5, color: "text.secondary" }}>
              • EV bikes must be returned with at least 20% charge. Charging stations are available at all hubs.
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 10.5, color: "text.secondary" }}>
              • Refundable deposit is charged at pickup. Free cancellation up to 24h before.
            </Typography>
          </>
        )}
      </Stack>

      {/* Compare floating bar */}
      {compareIds.size > 0 && (
        <Card
          elevation={4}
          sx={{
            position: "sticky",
            bottom: 8,
            borderRadius: 2.5,
            bgcolor: (t) => t.palette.mode === "light" ? "#1E293B" : "#0F172A",
            border: "1px solid rgba(51,65,85,0.6)",
            mt: 1.5
          }}
        >
          <CardContent sx={{ px: 1.5, py: 1, "&:last-child": { pb: 1 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={0.75} alignItems="center">
                <CompareArrowsRoundedIcon sx={{ fontSize: 18, color: "#03CD8C" }} />
                <Typography variant="caption" sx={{ fontSize: 11.5, fontWeight: 600, color: "#FFF" }}>
                  {compareIds.size} {rentalMode === "cars" ? "vehicle" : "bike"}{compareIds.size > 1 ? "s" : ""} selected
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.75}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => setShowCompare(!showCompare)}
                  sx={{
                    borderRadius: 999,
                    px: 1.5,
                    py: 0.3,
                    fontSize: 10.5,
                    fontWeight: 700,
                    textTransform: "none",
                    bgcolor: "#03CD8C",
                    color: "#020617",
                    "&:hover": { bgcolor: "#06e29a" }
                  }}
                >
                  {showCompare ? "Hide" : "Compare"}
                </Button>
                <Button
                  size="small"
                  onClick={() => { setCompareIds(new Set()); setShowCompare(false); }}
                  sx={{
                    borderRadius: 999,
                    px: 1,
                    py: 0.3,
                    fontSize: 10.5,
                    fontWeight: 600,
                    textTransform: "none",
                    color: "#94A3B8",
                    minWidth: "auto"
                  }}
                >
                  Clear
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Compare panel */}
      <Collapse in={showCompare && compareIds.size > 1} timeout={250}>
        <Card
          elevation={0}
          sx={{
            mt: 1.5,
            borderRadius: 2.5,
            bgcolor: (t) => t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
            border: (t) => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)"
          }}
        >
          <CardContent sx={{ px: 1.5, py: 1.25, "&:last-child": { pb: 1.25 } }}>
            <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 700, display: "block", mb: 1 }}>
              {rentalMode === "cars" ? "Vehicle" : "Bike"} comparison
            </Typography>
            <Box sx={{ overflowX: "auto" }}>
              <Box sx={{ display: "grid", gridTemplateColumns: `100px repeat(${compareIds.size}, 1fr)`, gap: 0.5, minWidth: compareIds.size * 130 + 100 }}>
                {/* Headers */}
                <Box />
                {Array.from(compareIds).map((id) => {
                  const item = rentalMode === "cars"
                    ? VEHICLES.find((vv) => vv.id === id)
                    : MOTORBIKES.find((bb) => bb.id === id);
                  return item ? (
                    <Box key={id} sx={{ mx: 7, textAlign: "center" }}>
                      <Typography variant="caption" sx={{ fontSize: 10.5, fontWeight: 700 }}>{item.name}</Typography>
                    </Box>
                  ) : null;
                })}

                {/* Rows — differ by mode */}
                {(rentalMode === "cars"
                  ? ([
                      ["Price/day", (v: AnyRentable) => formatPrice(v.pricePerDay)],
                      ["Price/week", (v: AnyRentable) => formatPrice(v.pricePerWeek)],
                      ["Fuel", (v: AnyRentable) => v.fuelType],
                      ["Seats", (v: AnyRentable) => `${(v as Vehicle).seats}`],
                      ["Transmission", (v: AnyRentable) => (v as Vehicle).transmission],
                      ["Range", (v: AnyRentable) => (v as Vehicle).range],
                      ["Rating", (v: AnyRentable) => `${v.rating} ★`],
                      ["Deposit", (v: AnyRentable) => formatPrice(v.deposit)],
                      ["Min. age", (v: AnyRentable) => `${v.ageRequirement}+`],
                      ["Luggage", (v: AnyRentable) => (v as Vehicle).luggage]
                    ] as [string, (v: AnyRentable) => string][])
                  : ([
                      ["Price/day", (v: AnyRentable) => formatPrice(v.pricePerDay)],
                      ["Price/week", (v: AnyRentable) => formatPrice(v.pricePerWeek)],
                      ["Fuel", (v: AnyRentable) => v.fuelType],
                      ["Engine", (v: AnyRentable) => (v as Motorbike).engineSize],
                      ["Top speed", (v: AnyRentable) => (v as Motorbike).topSpeed],
                      ["Transmission", (v: AnyRentable) => (v as Motorbike).transmission],
                      ["Range", (v: AnyRentable) => (v as Motorbike).range],
                      ["Weight", (v: AnyRentable) => (v as Motorbike).weight],
                      ["Rating", (v: AnyRentable) => `${v.rating} ★`],
                      ["Deposit", (v: AnyRentable) => formatPrice(v.deposit)],
                      ["License", (v: AnyRentable) => (v as Motorbike).licenseClass],
                      ["ABS", (v: AnyRentable) => (v as Motorbike).abs ? "Yes" : "No"]
                    ] as [string, (v: AnyRentable) => string][])
                ).map(([label, getter]) => (
                  <React.Fragment key={label}>
                    <Typography variant="caption" sx={{ fontSize: 10, fontWeight: 600, color: "text.secondary", display: "flex", alignItems: "center" }}>{label}</Typography>
                    {Array.from(compareIds).map((id) => {
                      const item = rentalMode === "cars"
                        ? VEHICLES.find((vv) => vv.id === id)
                        : MOTORBIKES.find((bb) => bb.id === id);
                      return item ? (
                        <Typography key={id} variant="caption" sx={{ mx: 7, fontSize: 10, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>{getter(item)}</Typography>
                      ) : null;
                    })}
                  </React.Fragment>
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Collapse>

      {/* Booking dialog */}
      <BookingDialog
        open={!!bookingItem}
        item={bookingItem}
        onClose={() => setBookingItem(null)}
      />

      {/* Snackbar notifications */}
      <Snackbar
        open={!!snackMsg}
        autoHideDuration={2000}
        onClose={() => setSnackMsg("")}
        message={snackMsg}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        ContentProps={{
          sx: {
            borderRadius: 2,
            fontSize: 12,
            fontWeight: 600,
            minWidth: "auto",
            bgcolor: (t) => t.palette.mode === "light" ? "#1E293B" : "#334155"
          }
        }}
      />
      </Box>
    </Box>
  );
}

export default function RentalDashboard(): React.JSX.Element {
  return (
    <>
      <DarkModeToggle />
      <MobileShell>
        <RentalDashboardHomeScreen />
      </MobileShell>
    </>
  );
}
