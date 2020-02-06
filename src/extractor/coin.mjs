import { getFileName, getImageURLForQuality } from "./image.mjs";
import { IMAGE_QUALITY } from "../constants.mjs";

export default class Coin {
  constructor({ id, date, volume, image, fr, en, collection } = {}) {
    this.id = id;
    this.date = date;
    this.volume = volume;
    this.image = image
      ? getFileName(getImageURLForQuality(image, IMAGE_QUALITY.MAXIMAL))
      : "";
    if (fr) {
      this.fr = {
        title: fr.title,
        date: fr.date,
        volume: fr.volume
      };
    }
    if (en) {
      this.en = {
        title: en.title,
        date: en.date,
        volume: en.volume
      };
    }
    if (Number.isInteger(collection)) {
      this.collection = collection;
    }
  }
}
