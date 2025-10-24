import {NextRequest, NextResponse} from "next/server";
import {authorizeRequest} from "@/lib/midlleware";
import { addNewOrder } from "@/services/OrderService";

export const POST = async (req: NextRequest) => {
    try {
        // Authorize the request
        console.log("Attempting to authorize request...");
        const isAuthorized = await authorizeRequest(req);
        if (!isAuthorized) {
            console.warn("Authorization failed. Responding with 401 Unauthorized.");
            return NextResponse.json({message: 'Unauthorized'}, {status: 401});
        }
        console.log("Authorization successful.");
        const json = await req.json();
        await addNewOrder(json);
        return NextResponse.json("POST request received");
    } catch (error) {
        console.error("An error occurred while processing the POST request:", error);
        return NextResponse.json({message: error.message}, {status: 500});
    }

}