import { brandImage } from "../brand";
export function BrandIcon({ className = "", image = "", position = "50% center" }: { className?: string; image?: string; position?: string | number }) {
  return (
    <span className={`marks-brand-icon ${className}`} aria-hidden="true">
      <img src={image || brandImage} alt="" draggable={false} style={image ? { objectFit: "cover", objectPosition: typeof position === "number" ? `${position}% center` : position } : undefined} />
    </span>
  );
}
