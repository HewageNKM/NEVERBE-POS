import {NextRequest, NextResponse} from "next/server";
import {authorizeRequest} from "@/lib/midlleware";
import {authenticateUserPassword} from "@/firebase/firebaseAdmin";

export const POST = async (req: NextRequest) => {
    try {
        console.log("Received GET request at:", req.url);

        // Authorize the request
        console.log("Attempting to authorize request...");
        const isAuthorized = await authorizeRequest(req);
        if (!isAuthorized) {
            console.warn("Authorization failed. Responding with 401 Unauthorized.");
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        console.log("Authorization successful.");

        const body = await req.json();
        const usr = await authenticateUserPassword(body);
        return NextResponse.json(usr);

    } catch (error) {
        console.error("An error occurred while processing the GET request:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};