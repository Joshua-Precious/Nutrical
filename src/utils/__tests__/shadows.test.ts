import { getShadowStyle } from "../shadows";

describe("Shadow Utility", () => {
  describe("getShadowStyle", () => {
    it("should return small shadow configuration", () => {
      const style = getShadowStyle("sm", "#000000");
      expect(style).toHaveProperty("shadowOffset");
      expect(style).toHaveProperty("shadowOpacity");
      expect(style).toHaveProperty("shadowRadius");
    });

    it("should return medium shadow configuration", () => {
      const style = getShadowStyle("md", "#000000");
      expect(style.shadowOpacity).toBe(0.1);
      expect(style.shadowRadius).toBe(8);
    });

    it("should return large shadow configuration", () => {
      const style = getShadowStyle("lg", "#000000");
      expect(style.shadowOpacity).toBe(0.15);
      expect(style.shadowRadius).toBe(12);
    });

    it("should return extra large shadow configuration", () => {
      const style = getShadowStyle("xl", "#000000");
      expect(style.shadowOpacity).toBe(0.2);
      expect(style.shadowRadius).toBe(16);
    });

    it("should use provided shadow color", () => {
      const color = "#FF0000";
      const style = getShadowStyle("md", color);
      expect(style.shadowColor).toBe(color);
    });

    it("should default to medium size when not specified", () => {
      const style = getShadowStyle();
      expect(style.shadowOpacity).toBe(0.1);
      expect(style.shadowRadius).toBe(8);
    });

    it("should default to black color when not specified", () => {
      const style = getShadowStyle("md");
      expect(style.shadowColor).toBe("#000");
    });
  });
});
