import {
  parseVolume,
  parseCountryToISO,
  parseDate,
  cleanStr,
  cleanDate
} from "../parser.mjs";

describe("in parser", () => {
  describe.each`
    volumeString                   | parsedVolume
    ${"10 000 pièces"}             | ${10000}
    ${"1004 pièces"}               | ${1004}
    ${"2 millions de pièces"}      | ${2000000}
    ${"1 million de pièces"}       | ${1000000}
    ${"1,04 million de pièces"}    | ${1040000}
    ${"123 456 789 pièces"}        | ${123456789}
    ${"83,056 millions de pièces"} | ${83056000}
    ${"1.5 million coins"}         | ${1500000}
    ${"90,146,867 coins"}          | ${90146867}
    ${"500,000 coins"}             | ${500000}
    ${"375.000 coins"}             | ${375000}
  `("parseVolume", ({ volumeString, parsedVolume }) => {
    it(`should return ${parsedVolume} from ${volumeString}`, () => {
      expect(parseVolume(volumeString)).toEqual(parsedVolume);
    });
  });

  describe.each`
    countryString    | countryCode
    ${"France"}      | ${"FR"}
    ${"Grèce"}       | ${"GR"}
    ${"Saint-Marin"} | ${"SM"}
  `("parseCountryToISO", ({ countryString, countryCode }) => {
    it(`should return ${countryCode} from ${countryString} in French locale`, () => {
      expect(parseCountryToISO(countryString, "fr")).toEqual(countryCode);
    });
  });

  describe.each`
    countryString   | countryCode
    ${"Finland"}    | ${"FI"}
    ${"Cyprus"}     | ${"CY"}
    ${"San Marino"} | ${"SM"}
  `("parseCountryToISO", ({ countryString, countryCode }) => {
    it(`should return ${countryCode} from ${countryString} in English locale`, () => {
      expect(parseCountryToISO(countryString, "en")).toEqual(countryCode);
    });
  });

  describe.each`
    dateString             | parsedDate
    ${"Février 2019"}      | ${"2019-02-01"}
    ${"23 août 2016"}      | ${"2016-08-23"}
    ${"Mi-2016"}           | ${"2016-07-01"}
    ${"Automne 2004"}      | ${"2004-10-01"}
    ${"1er semestre 2022"} | ${"2022-01-01"}
    ${"4e trimestre 2048"} | ${"2048-10-01"}
    ${"2e semestre 2000"}  | ${"2000-07-01"}
    ${"2e trimestre 2019"} | ${"2019-04-01"}
  `("parseDate", ({ dateString, parsedDate }) => {
    it(`should return ${parsedDate} from ${dateString} in French locale`, () => {
      expect(parseDate(dateString, "fr")).toEqual(new Date(parsedDate));
    });
  });

  describe.each`
    dateString           | parsedDate
    ${"12 january 2019"} | ${"2019-01-12"}
    ${"23 august 2016"}  | ${"2016-08-23"}
    ${"June 2020"}       | ${"2020-06-01"}
  `("parseDate", ({ dateString, parsedDate }) => {
    it(`should return ${parsedDate} from ${dateString} in English locale`, () => {
      expect(parseDate(dateString, "en")).toEqual(new Date(parsedDate));
    });
  });

  it("should clean string", () => {
    expect(cleanStr("2 February 2007[55]\n")).toEqual("2 February 2007");
  });

  describe("cleanStr", () => {
    it("should clean regular date with external reference", () => {
      expect(cleanDate("1 October 2007[59]\n")).toEqual("1 October 2007");
    });

    it("should clean date string with FDI and FDC", () => {
      expect(
        cleanDate("FDI:[13] 16 April 2007FDC:[14] 1 October 2007[59]\n")
      ).toEqual("16 April 2007");
    });

    it("should clean date string with sets and rolls", () => {
      expect(cleanDate("23 June 2015 (sets)3 October 2015 (rolls)\n")).toEqual(
        "3 October 2015"
      );
    });

    it("should clean date string with proof and rolls", () => {
      expect(cleanDate("29 April 2015 (proof)22 July 2015 (rolls)\n")).toEqual(
        "22 July 2015"
      );
    });

    it("should clean date string with a range", () => {
      expect(cleanDate("25 March – 2 April 2007\n")).toEqual("2 April 2007");
    });
  });
});
