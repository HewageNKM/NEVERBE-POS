import React, {useState} from 'react';
import {CartItem, Item, Variant} from "@/interfaces";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {ScrollArea} from "@/components/ui/scroll-area";
import {Button} from '@/components/ui/button';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import VariantDisplayCard from "@/app/dashboard/components/VariantDisplayCard";

const VariantForm = ({
                         selectedItem,
                         open,
                         onCancel,
                     }: {
    selectedItem?: Item,
    open: boolean,
    onCancel: () => void,
}) => {

    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
    const [selectedSize, setSelectedSize] = useState("")
    const [qty, setQty] = useState(1)
    const addToCart = () => {
        const newCartItem: CartItem = {
            itemId: selectedItem?.itemId || "",
            name: selectedItem?.name || "",
            price: selectedItem?.sellingPrice || 0,
            quantity: qty,
            size: selectedSize,
            thumbnail: selectedItem?.thumbnail.url || "",
            type: selectedItem?.type || "",
            variantId: selectedVariant?.variantId || "",
            variantName: selectedVariant?.variantName || ""
        }
        console.log(newCartItem)
    }

    return (
        <Dialog open={open} onOpenChange={onCancel}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{
                        selectedVariant ? "Select a Size" : "Select a Variant"
                    }</DialogTitle>
                </DialogHeader>
                {selectedVariant ? (
                    <div className="space-y-4">
                        <Select
                            onValueChange={(value) => setSelectedSize(value)}
                            value={selectedSize}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Size"/>
                            </SelectTrigger>
                            <SelectContent>
                                {selectedVariant.sizes.map((size) => (
                                    <SelectItem key={size.size} value={size.size}>
                                        {size.size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input
                            type="number"
                            min="1"
                            value={qty}
                            onChange={(e) => setQty(parseInt(e.target.value))}
                            placeholder="Quantity"
                        />
                    </div>
                ) : (
                    <ScrollArea className="h-72 w-full rounded-md border p-4">
                        <div className="space-y-4">
                            {selectedItem?.variants.map((variant) => (
                                <VariantDisplayCard
                                    key={variant.variantId}
                                    variant={variant}
                                    onClick={() => setSelectedVariant(variant)}
                                />
                            ))}
                        </div>
                    </ScrollArea>
                )}
                <DialogFooter className="justify-between">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            setSelectedVariant(null)
                            setSelectedSize("")
                            setQty(1)
                            onCancel()
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="disabled:cursor-not-allowed disabled:bg-opacity-60"
                        type="button"
                        disabled={!selectedVariant || !selectedSize || qty < 1}
                        onClick={addToCart}
                    >
                        Add
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default VariantForm;