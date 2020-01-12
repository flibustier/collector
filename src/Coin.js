import { IMAGE_QUALITY, IMAGE_QUALITY_WIDTH } from './constants.mjs'

const imageNameForQuality = (imageFileName, quality) => {
    switch (quality) {
        case IMAGE_QUALITY.LOW:
            return `${IMAGE_QUALITY_WIDTH.LOW}-${imageFileName}`
        case IMAGE_QUALITY.MEDIUM:
            return `${IMAGE_QUALITY_WIDTH.MEDIUM}-${imageFileName}`
        default:
            return imageFileName
    }
}

export default class Coin {
    constructor({
        id,
        volume,
        date,
        image,
        fr
    } = {}) {
        this.id = id;
        this.volume = volume;
        this.date = new Date(date);
        this.imageSource = image;
        this.fr = fr;
    }

    get country() {
        return this.id.slice(0, 2);
    }

    get countryFlag() {
        return `flag-icon-${this.country.toLowerCase()}`
    }

    get year() {
        return this.date.getFullYear()
    }

    image(quality = IMAGE_QUALITY.MAXIMAL) {
        return `/images/${quality}/${imageNameForQuality(this.imageSource, quality)}`
    }
}
