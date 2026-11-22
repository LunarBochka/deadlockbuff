import type { HeroAsset } from '../PlayerStats';
import { getHeroInitials } from './formatters';

type HeroIconProps = {
  hero?: HeroAsset;
};

function HeroIcon({ hero }: HeroIconProps) {
  const image = hero?.images?.icon_image_small_webp || hero?.images?.icon_image_small;

  if (!image) {
    return <span className="hero-fallback">{getHeroInitials(hero?.name)}</span>;
  }

  return <img src={image} alt="" />;
}

export default HeroIcon;
