import { describe, expect, it } from "vitest";
import { inferPokemonFromTitle, inferSetFromTitle, normalizeEbayItem } from "../lib/normalization.js";

describe("normalizeEbayItem", () => {
  it("normalizes valid sold listings", () => {
    const normalized = normalizeEbayItem({
      itemId: "v1|12345|0",
      title: "Charizard holo Base Set 4/102 PSA 8",
      soldDate: "2025-01-01T00:00:00.000Z",
      condition: "Used",
      price: {
        value: "499.99",
        currency: "USD",
      },
    });

    expect(normalized).not.toBeNull();
    expect(normalized?.pokemonName).toBe("Charizard");
    expect(normalized?.setName).toBe("Base Set");
    expect(normalized?.price).toBe(499.99);
  });

  it("returns null when required fields are missing", () => {
    const normalized = normalizeEbayItem({
      itemId: "",
      title: "Pikachu",
      price: {
        value: "100",
        currency: "USD",
      },
    });

    expect(normalized).toBeNull();
  });

  it("returns unknown values when no hints exist", () => {
    expect(inferPokemonFromTitle("Japanese promo card")).toBe("Unknown Pokemon");
    expect(inferSetFromTitle("Japanese promo card")).toBe("Unknown Set");
  });
});
