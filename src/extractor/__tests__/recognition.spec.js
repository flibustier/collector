import { formatID, coinsWithSameCountryAndYear } from "../recognition.mjs";

describe("in recognition", () => {
  it("should format ID correctly", () => {
    expect(formatID("FR", 2020, 1)).toEqual("FR-2020-01");
  });

  it("should filters coins with same country and year", () => {
    const coins = [
      {
        country: "FR",
        date: new Date("3 september 2019")
      },
      {
        country: "BE",
        date: new Date("5 september 2019")
      },
      {
        country: "FR",
        date: new Date("5 november 1605")
      }
    ];

    expect(coinsWithSameCountryAndYear(coins, "FR", 2019)).toEqual(
      coins.slice(0, 1)
    );
  });
});
