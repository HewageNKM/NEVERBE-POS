import {NextRequest, NextResponse} from "next/server";
import {authorizeRequest} from "@/lib/midlleware";
import {addItemToPosCart, removeFromPostCart} from "@/firebase/firebaseAdmin";
import {CartItem} from "@/interfaces";

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
        const json:CartItem = await req.json();
        console.log("POST request received:", json);
        await addItemToPosCart(json);
        return NextResponse.json("POST request received");
    } catch (error) {
        console.error("An error occurred while processing the GET request:", error);
        if(error.message === 'Insufficient Stock') {
            return NextResponse.json({message: 'Insufficient Stock'}, {status: 400});
        }
        return NextResponse.json({message: 'Internal Server Error'}, {status: 500});
    }
};

export const DELETE = async (req: NextRequest) => {
    try {
        // Authorize the request
        console.log("Attempting to authorize request...");
        const isAuthorized = await authorizeRequest(req);
        if (!isAuthorized) {
            console.warn("Authorization failed. Responding with 401 Unauthorized.");
            return NextResponse.json({message: 'Unauthorized'}, {status: 401});
        }
        console.log("Authorization successful.");
        const json:CartItem = await req.json();
        console.log("DELETE request received:", json);
        await removeFromPostCart(json);
        return NextResponse.json("POST request received");
    } catch (error) {
        console.error("An error occurred while processing the GET request:", error);
        return NextResponse.json({message: 'Internal Server Error'}, {status: 500});
    }
};