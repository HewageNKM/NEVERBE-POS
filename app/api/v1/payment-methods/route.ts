import {NextRequest, NextResponse} from "next/server";
import {authorizeRequest} from "@/lib/midlleware";
import {getAllPaymentMethods} from "@/firebase/firebaseAdmin";

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
        const methods = await getAllPaymentMethods();
        return NextResponse.json(methods);
    } catch (error) {
        console.error("An error occurred while processing the POST request:", error);
        return NextResponse.json({message: error.message}, {status: 500});
    }

}