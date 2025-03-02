"use client"
import React, {useState} from 'react';
import {CartItem, Item, Variant} from "@/interfaces";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {ScrollArea} from "@/components/ui/scroll-area";
import {Button} from '@/components/ui/button';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import VariantDisplayCard from "@/app/dashboard/components/VariantDisplayCard";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {reserveItem} from "@/app/actions/invoiceAction";
import {getPosCartItems, setIsInvoiceLoading} from "@/lib/invoiceSlice/invoiceSlice";
import {setIsVariantsFormOpen, setSelectedItem} from "@/lib/prodcutSlice/productSlice";
import {showAlert} from "@/lib/alertSlice/alertSlice";
import {Label} from "@/components/ui/label";

const VariantForm = () => {
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
    const [selectedSize, setSelectedSize] = useState("")
    const [discount, setDiscount] = useState(0)
    const [qty, setQty] = useState(1)
    const {
        selectedItem,
        isVariantsFormOpen,
    } = useAppSelector(state => state.product);
    const dispatch = useAppDispatch();

    const addToCart = async () => {
        const newCartItem: CartItem = {
            discount: discount * qty,
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
        try {
            dispatch(setIsVariantsFormOpen(false));
            dispatch(setIsInvoiceLoading(true));
            await reserveItem(newCartItem);
            onCancel()
        } catch (e) {
            console.error(e);
            const title: string = e.response?.data?.message || "An error occurred";
            dispatch(showAlert({buttonTitle: "Okay", title: title, showAlert: true}))
        } finally {
            dispatch(getPosCartItems());
            dispatch(setIsInvoiceLoading(false));
        }
    }
    const onCancel = () => {
        dispatch(setIsVariantsFormOpen(false));
        dispatch(setSelectedItem({} as Item));
        setSelectedVariant(null)
        setSelectedSize("")
        setQty(1)
    }

    return (
        <Dialog open={isVariantsFormOpen} onOpenChange={onCancel}>
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
                        <p
                            className="text-sm text-muted-foreground flex w-full justify-end"
                        >{selectedVariant.sizes.find(size => size.size === selectedSize)?.stock} in stock</p>
                        <div className="flex flex-col gap-5">
                            <Label>
                                <span>Quantity</span>
                                <Input
                                    className={"mt-2"}
                                    type="number"
                                    min="1"
                                    value={qty}
                                    onChange={(e) => setQty(parseInt(e.target.value))}
                                    placeholder="Quantity"
                                />
                            </Label>
                            <Label>
                                <span>Discount</span>
                                <Input type={"number"} className={"mt-2"} placeholder={"Discount"}
                                       value={discount.toString()}
                                       onChange={(event) => setDiscount(Number.parseInt(event.target.value))}/>
                            </Label>
                        </div>
                    </div>
                ) : (
                    <ScrollArea className="h-72 w-full rounded-md border p-4">
                        <div className="space-y-4">
                            {selectedItem?.variants?.map((variant) => (
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