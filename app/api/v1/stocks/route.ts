import { authorizeRequest } from "@/lib/midlleware";
import { gettAllStockForDropdown } from "@/services/OtherService";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    console.log("Received GET request at:", req.url);

    // Authorize the request
    console.log("Attempting to authorize request...");
    const isAuthorized = await authorizeRequest(req);
    if (!isAuthorized) {
      console.warn("Authorization failed. Responding with 401 Unauthorized.");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.log("Authorization successful.");

    const res = await gettAllStockForDropdown();
    return NextResponse.json(res);
  } catch (error) {
    console.error("An error occurred while processing the GET request:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
