import React from 'react';
import {Card, CardContent} from "@/components/ui/card";
import {Variant} from "@/interfaces";
import Image from "next/image";

const VariantDisplayCard = ({variant, onClick}:{variant:Variant, onClick:(variant:Variant)=>void}) => {
    return (
        <Card
            className="hover:bg-gray-100 cursor-pointer transition-colors"
            onClick={() => onClick(variant)}
        >
            <CardContent className="p-2">
                <div className="flex items-center space-x-4">
                    <Image
                        width={64}
                        height={64}
                        src={variant.images[0].url}
                        alt={variant.variantName}
                        className="w-16 h-16 rounded-md object-cover"
                    />
                    <div className="flex-1">
                        <h4 className="font-medium capitalize text-lg">{variant.variantName}</h4>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default VariantDisplayCard;