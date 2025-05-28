import { tableDef } from "./localDb";
import { z } from "zod/v4";
import { describe, expect, test } from "vitest";

describe("table generation", () => {
    test("should contain id", () => {
        const res = tableDef(z.object({
            value: z.number()
        }))
        expect(res).toBe("++id,value")
    })
    test("should be ordered", () => {
        const res = tableDef(z.object({
            a: z.number(),
            c: z.string(),
            b: z.number(),
            id: z.number(),
        }))
        expect(res).toBe("++id,a,c,b")
    })
})