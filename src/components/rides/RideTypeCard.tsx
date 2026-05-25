import React from "react";
import "./RideTypeCard.css";

export interface RideTypeCardData {
  id: string;
  name: string;
  capacity: number;
  image: string;
  price: string;
  objectPosition?: string;
  objectFit?: "cover" | "contain";
  foregroundPosition?: string;
}

interface RideTypeCardProps {
  ride: RideTypeCardData;
  selected: boolean;
  onClick: (rideId: string) => void;
}

export default function RideTypeCard({
  ride,
  selected,
  onClick
}: RideTypeCardProps): React.JSX.Element {
  return (
    <button
      type="button"
      className={`ride-card${selected ? " selected" : ""}`}
      onClick={() => onClick(ride.id)}
      aria-pressed={selected}
    >
      <img
        src={ride.image}
        alt={ride.name}
        className="ride-card-image"
        style={{
          objectPosition: ride.foregroundPosition || ride.objectPosition || "center center",
          objectFit: ride.objectFit || "contain"
        }}
      />
      <div className="ride-card-overlay" />
      <div className="ride-card-content">
        <h3>{ride.name}</h3>
        <p>{ride.capacity} seats</p>
        <span>{ride.price || "Set destination"}</span>
      </div>
    </button>
  );
}
