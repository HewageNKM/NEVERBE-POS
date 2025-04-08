import React from 'react';
import {Item} from "@/interfaces";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import Image from "next/image";

const ItemCard = ({item, onAdd}: { item: Item, onAdd: () => void }) => {
    return (
        <Card className="shadow-md rounded-lg w-[11rem] min-h-[21.5rem] relative flex flex-col">
            {/* Image Section */}
            <CardHeader className="relative h-36">
                <Image
                    src={item.thumbnail.url}
                    alt={item.name}
                    width={200}
                    height={200}
                    className="object-cover rounded-t-lg w-full h-full"
                />
            </CardHeader>

            {/* Product Details Section */}
            <CardContent className="flex flex-col relative flex-grow px-4 py-2">
                <h2 className="capitalize text-lg">
                    {item.manufacturer}
                </h2>
                <h3 className="text-lg font-semibold truncate">{item.name}</h3>
                <div className="flex flex-col">
                    {item.discount > 0 &&(
                        <h3 className="text-lg font-bold text-gray-500 line-through">
                            LKR {item.sellingPrice.toFixed(2)}
                        </h3>
                    )}
                    <h3 className={`text-lg font-bold ${item.discount > 0 ? "text-yellow-500" : "dark:text-white text-black"}`}>
                        LKR {(Math.round((item.sellingPrice - (item.discount * item.sellingPrice / 100)) / 10) * 10).toFixed(2)}
                    </h3>
                </div>
                <p className="text-sm absolute bottom-1 right-3 text-gray-500 mt-3 font-bold">
                    {item.variants.length} Colors
                </p>
            </CardContent>
            {/* Action Section (e.g., Add to Cart Button) */}
            <CardFooter className="p-1 mt-1 flex justify-center">
                <button onClick={onAdd} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 w-full">
                    Add to Cart
                </button>
            </CardFooter>
            {item.discount > 0 && (
                <p className="font-bold absolute right-2 top-5 text-muted bg-yellow-500 rounded-md p-1 text-white">{item.discount}%</p>
            )}
            <p className="text-sm font-bold bg-red-500 text-white absolute top-1 uppercase left-2 p-[.2rem] rounded">
                {item.itemId}
            </p>
        </Card>
    );
};

export default ItemCard;
