import React from 'react';
import { Item } from "@/interfaces";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";

const ItemCard = ({ item }: { item: Item }) => {
    return (
        <Card className="bg-white shadow-md rounded-lg w-[12rem] relative flex flex-col">
            {/* Image Section */}
            <CardHeader className="relative h-36">
                <Image
                    src={item.thumbnail.url}
                    alt={item.name}
                    width={200}
                    height={200}
                    className="object-cover rounded-t-lg w-full h-full"
                />
                <p className="text-sm bg-green-400 absolute top-2 right-2 px-2 py-1 rounded text-white font-medium capitalize">
                    {item.manufacturer}
                </p>
                <p className="text-sm bg-yellow-500 absolute bottom-2 right-2 px-2 py-1 rounded text-white font-medium capitalize">
                    {item.variants.length} Variants
                </p>
            </CardHeader>

            {/* Product Details Section */}
            <CardContent className="flex flex-col justify-between flex-grow p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.brand}</p>
                <p className="text-sm text-gray-800 mt-2">LKR {item.sellingPrice}</p>
            </CardContent>

            {/* Action Section (e.g., Add to Cart Button) */}
            <CardFooter className="p-1 mt-1 flex justify-center">
                <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 w-full">
                    Add to Cart
                </button>
            </CardFooter>
        </Card>
    );
};

export default ItemCard;
