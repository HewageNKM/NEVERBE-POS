import { NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/midlleware";
import { getAOrder } from "@/services/OrderService";

export const GET = async (
  req: Request,
  { params }: { params: { orderId: string } }
) => {
  try {
    // Authorize the request
    console.log("Attempting to authorize request...");
    const isAuthorized = await authorizeRequest(req);
    if (!isAuthorized) {
      console.warn("Authorization failed. Responding with 401 Unauthorized.");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.log("Authorization successful. Fetching order:", params.orderId);

    // Fetch order by ID
    const order = await getAOrder(params.orderId);

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};
