import {NextRequest, NextResponse} from "next/server";
import {authorizeRequest} from "@/lib/midlleware";
import {CartItem} from "@/interfaces";
import { addItemToPosCart, getPosCart, removeFromPosCart } from "@/services/CartService";

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
        const json: CartItem = await req.json();
        console.log("POST request received:", json);
        await addItemToPosCart(json);
        return NextResponse.json("POST request received");
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
};

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
        const posCart = await getPosCart();
        console.log("GET request received:", posCart);
        return NextResponse.json(posCart);
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
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
        const json: CartItem = await req.json();
        console.log("DELETE request received:", json);
        await removeFromPosCart(json);
        return NextResponse.json("POST request received");
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
};