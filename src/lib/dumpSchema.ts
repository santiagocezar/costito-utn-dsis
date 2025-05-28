import { z } from "zod/v4"
//@ts-expect-error 
import * as schema from "./schema.ts"

[
    schema.Tercero
].forEach(s => {
    const json = JSON.stringify(z.toJSONSchema(z.globalRegistry), undefined, 4)
    console.log(json)
})