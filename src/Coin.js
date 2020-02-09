import {
  IMAGE_QUALITY, IMAGE_QUALITY_WIDTH, UNCOMMON_CAP,
  RARE_CAP,
  EPIC_CAP,
  LEGENDARY_CAP
} from "./constants.mjs";

const imageNameForQuality = (imageFileName, quality) => {
  switch (quality) {
    case IMAGE_QUALITY.LOW:
      return `${IMAGE_QUALITY_WIDTH.LOW}-${imageFileName}`;
    case IMAGE_QUALITY.MEDIUM:
      return `${IMAGE_QUALITY_WIDTH.MEDIUM}-${imageFileName}`;
    default:
      return imageFileName;
  }
};

export default class Coin {
  constructor({ id, volume, date, image, collection, fr, en } = {}) {
    this.id = id;
    this.volume = volume;
    this.date = new Date(date);
    this.imageSource = image;
    this.fr = fr;
    this.en = en;
    this.collection = collection;
  }

  get country() {
    return this.id.slice(0, 2);
  }

  get countryFlag() {
    return `flag-icon-${this.country.toLowerCase()}`;
  }

  get year() {
    return this.date.getFullYear();
  }

  get rarity() {
    if (this.volume < LEGENDARY_CAP) return 'legendary';
    if (this.volume < EPIC_CAP) return 'epic';
    if (this.volume < RARE_CAP) return 'rare';
    if (this.volume < UNCOMMON_CAP) return 'uncommon';
    return 'common';
  }

  title(lang) {
    return this[lang] ? this[lang].title : '';
  }

  isInYearRange(startYear, endYear) {
    return (this.year >= startYear || !startYear) && (this.year <= endYear || !endYear);
  }

  isInVolumeRange(minVolume, maxVolume) {
    return (this.volume >= minVolume || !minVolume) && (this.volume < maxVolume || !maxVolume);
  }

  isMatchingSearchString(searchString) {
    return this.title('fr').toLowerCase().includes(searchString) ||
      this.title('en').toLowerCase().includes(searchString) ||
      this.id.toLowerCase().includes(searchString)
  }

  image(quality = IMAGE_QUALITY.MAXIMAL) {
    return this.imageSource
      ? `/images/${quality}/${imageNameForQuality(this.imageSource, quality)}`
      : "";
  }
}
