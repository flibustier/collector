import { parseMonth } from "../parser.french.mjs";

describe("in parser", () => {
  describe.each`
    dateString                  | parsedMonth
    ${"Février 2019"}           | ${1}
    ${"23 août 2016"}           | ${7}
    ${"Mi-2016"}                | ${6}
    ${"Automne 2004"}           | ${9}
    ${"1er semestre 2022"}      | ${0}
    ${"4e trimestre 1990"}      | ${9}
    ${"2e semestre 2000"}       | ${6}
    ${"2e trimestre 1810"}      | ${3}
    ${"dernier trimestre 2002"} | ${9}
  `("parseMonth", ({ dateString, parsedMonth }) => {
    it(`should return ${parsedMonth} from ${dateString}`, () => {
      expect(parseMonth(dateString)).toEqual(parsedMonth);
    });
  });

  it("should log a warning when no month found in a date", () => {
    expect(parseMonth("this is not a date")).toEqual(0);
  });
});
