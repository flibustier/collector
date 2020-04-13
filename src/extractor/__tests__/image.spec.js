import { getFileName } from "../image.mjs";

describe("in image", () => {
  describe("getFileName", () => {
    it("should extract filename from URL encoded", () => {
      expect(
        getFileName(
          "http://upload.wikimedia.org/wikipedia/fr/thumb/6/6f/DE_2%E2%82%AC_2019_Mur.png/150px-DE_2%E2%82%AC_2019_Mur.png"
        )
      ).toEqual("150px-DE_2€_2019_Mur.png");
    });
  });
});
