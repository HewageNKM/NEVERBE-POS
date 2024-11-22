import {NextRequest, NextResponse} from "next/server";
import {authorizeRequest} from "@/lib/midlleware";
import {getAOrder} from "@/firebase/firebaseAdmin";

export const GET = async (req: NextRequest) => {
    try {
        // Authorize the request
        console.log("Attempting to authorize request...");
        const isAuthorized = await authorizeRequest(req);
        if (!isAuthorized) {
            console.warn("Authorization failed. Responding with 401 Unauthorized.");
            return NextResponse.json({message: 'Unauthorized'}, {status: 401});
        }
        console.log("Authorization successful.");
        const orderId = new URL(req.url).searchParams.get('orderId');
        const order = await getAOrder(orderId || "");
        console.log("GET request received:", orderId);
        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}