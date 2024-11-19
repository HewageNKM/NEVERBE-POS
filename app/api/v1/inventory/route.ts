import {NextRequest, NextResponse} from "next/server";
import {authorizeRequest} from "@/lib/midlleware";
import {getInventory} from "@/firebase/firebaseAdmin";

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
        const url = new URL(req.url);
        const page = Number.parseInt(url.searchParams.get('page') || '1');
        const size = Number.parseInt(url.searchParams.get('size') || '20');

        const items = await getInventory(page, size);
        return NextResponse.json(items);
    } catch (error) {
        console.error("An error occurred while processing the GET request:", error);
        return NextResponse.json({message: 'Internal Server Error'}, {status: 500});
    }
};