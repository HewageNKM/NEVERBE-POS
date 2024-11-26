import {getUserById, verifyIdToken} from "@/firebase/firebaseAdmin";
import {NextRequest} from "next/server";

export const authorizeRequest = async (req: NextRequest) => {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
        console.warn("Authorization Failed: Missing or invalid authorization header.");
        return false;
    }

    try {
        // Verify the token
        const idToken = await verifyIdToken(token);
        console.log("Token verification successful:", idToken);

        // Retrieve user by ID
        const user = await getUserById(idToken.uid);
        if (user) {
            console.log("Authorization Success: User found with ID", idToken.uid);
            return true;
        } else {
            console.warn("Authorization Failed: User not found for UID", idToken.uid);
            return false;
        }
    } catch (error) {
        console.error("Authorization Failed: Invalid token or error during verification.", error);
        return false;
    }
}
