import { brandImage } from "../brand";
export function BrandIcon({ className = "" }: { className?: string }) {
  return (
    <span className={`marks-brand-icon ${className}`} aria-hidden="true">
      <img src={brandImage} alt="" draggable={false} />
    </span>
  );
}
