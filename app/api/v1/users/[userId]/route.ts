import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/midlleware";
import {authenticateUserPassword, getUserById} from "@/firebase/firebaseAdmin";

export const GET = async (req: NextRequest) => {
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

        // Extract user ID from URL
        const url = new URL(req.url);
        const uid = url.pathname.split('/').pop();
        console.log(`Extracted UID from URL: ${uid}`);

        if (!uid) {
            console.warn("No UID found in the request URL. Responding with 400 Bad Request.");
            return NextResponse.json({ message: 'Bad Request: Missing UID' }, { status: 400 });
        }

        // Retrieve user by ID
        console.log(`Attempting to retrieve user with UID: ${uid}`);
        const user = await getUserById(uid);
        console.log("User retrieval successful:", user);

        return NextResponse.json(user);

    } catch (error) {
        console.error("An error occurred while processing the GET request:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};
