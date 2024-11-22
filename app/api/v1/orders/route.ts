import {NextRequest, NextResponse} from "next/server";
import {authorizeRequest} from "@/lib/midlleware";

export const POST = async (req: NextRequest) => {
    try {
        // Authorize the request
        console.log("Attempting to authorize request...");
        const isAuthorized = await authorizeRequest(req);
        if (!isAuthorized) {
            console.warn("Authorization failed. Responding with 401 Unauthorized.");
            return NextResponse.json({message: 'Unauthorized'}, {status: 401});
        }

    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }

}