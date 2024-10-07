// /api/index.ts

import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
    res.status(200).json({
        message: "API is healthy!",
    });
}
