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
  onClick?: (rideId: string) => void;
  interactive?: boolean;
  showMeta?: boolean;
}

export default function RideTypeCard({
  ride,
  selected,
  onClick,
  interactive = true,
  showMeta = true
}: RideTypeCardProps): React.JSX.Element {
  const isInteractive = interactive && typeof onClick === "function";

  return (
    <button
      type="button"
      className={`ride-card${selected && isInteractive ? " selected" : ""}${isInteractive ? "" : " static"}`}
      onClick={isInteractive ? () => onClick(ride.id) : undefined}
      aria-pressed={isInteractive ? selected : undefined}
      tabIndex={isInteractive ? 0 : -1}
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
      {selected && isInteractive ? <div className="ride-card-check" aria-hidden="true">✓</div> : null}
      <div className="ride-card-content">
        <h3>{ride.name}</h3>
        {showMeta ? (
          <>
            <p>{ride.capacity} seats</p>
            <span>{ride.price || "Set destination"}</span>
          </>
        ) : null}
      </div>
    </button>
  );
}
