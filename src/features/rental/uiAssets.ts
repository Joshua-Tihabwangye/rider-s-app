export const RENTAL_UI_ASSETS = {
  cars: {
    city: "/rental-ui/car-city.svg",
    suv: "/rental-ui/car-suv.svg",
    sedan: "/rental-ui/car-sedan.svg",
    van: "/rental-ui/car-van.svg"
  },
  banners: {
    eco: "/rental-ui/eco-banner.svg",
    branchMap: "/rental-ui/branch-map.svg",
    successHero: "/rental-ui/success-hero.svg",
    walletHero: "/rental-ui/wallet-hero.svg",
    cardHero: "/rental-ui/card-hero.svg"
  }
} as const;

export function getVehicleImageFromName(vehicleName: string): string {
  const lower = vehicleName.toLowerCase();
  if (lower.includes("van")) {
    return RENTAL_UI_ASSETS.cars.van;
  }
  if (lower.includes("kona") || lower.includes("suv")) {
    return RENTAL_UI_ASSETS.cars.suv;
  }
  if (lower.includes("tesla") || lower.includes("sedan")) {
    return RENTAL_UI_ASSETS.cars.sedan;
  }
  return RENTAL_UI_ASSETS.cars.city;
}
