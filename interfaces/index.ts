export interface Item {
    itemId: string,
    type: string,
    brand: string,
    thumbnail: {
        file: File | string,
        url: string,
    },
    variants: Variant[],
    manufacturer: string,
    name: string,
    sellingPrice: number,
    discount: number,
}

export interface Size {
    size: string,
    stock: number,
}

export interface Variant {
    variantId: string,
    variantName: string,
    images: string[],
    sizes: Size[],
}