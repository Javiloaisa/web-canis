import { describe, expect, it } from "vitest";
import { FRANJAS, LIMITE_PAELLA, LIMITE_TOTAL } from "shared";

describe("scaffolding del workspace", () => {
  it("expone las constantes de cupo del paquete shared", () => {
    expect(FRANJAS).toHaveLength(8);
    expect(LIMITE_TOTAL).toBe(10);
    expect(LIMITE_PAELLA).toBe(7);
  });
});
