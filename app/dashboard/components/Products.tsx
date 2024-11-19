"use client"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination';
import React, {useEffect, useState} from 'react';
import {getInventory} from "@/app/actions/prodcutsAction";
import {Item} from "@/interfaces";
import ItemCard from "@/app/dashboard/components/ItemCard";
import LoadingScreen from '@/components/ui/LoadingScreen';
import VariantForm from "@/app/dashboard/components/VariantForm";
import {useAppSelector} from "@/lib/hooks";

const Products = () => {
    const [products, setProducts] = useState([] as Item[]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true)
    const [isVariantsFormOpen, setIsVariantsFormOpen] = useState(false)

    const [selectedItem, setSelectedItem] = useState<Item | null>(null)

    const {user} = useAppSelector(state => state.auth);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [currentPage, user]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const items: Item[] = await getInventory(currentPage, 10);
            setProducts(items);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }
    // Handlers for pagination
    const handlePageChange = (page: number) => {
        if (page >= 1) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="rounded-lg p-4 mt-10 bg-background shadow relative lg:min-h-[80vh] md:min-h-[60vh] min-h-screen">
            <h1 className="lg:text-xl text-lg font-bold tracking-wide">Products</h1>
            <div className="mt-5 flex flex-col justify-between">
                {/* Display products */}
                <div className="mb-10">
                    <ul className="grid lg:grid-cols-4 grid-cols-1 md:grid-cols-2 gap-5 md:gap-10">
                        {products.map((product: Item) => (
                            <li key={product.itemId} className="mb-4">
                                <ItemCard item={product} onAdd={() => {
                                    setSelectedItem(product)
                                    setIsVariantsFormOpen(true)
                                }}/>
                            </li>
                        ))}
                    </ul>
                    {products.length === 0 && (
                        <p className="text-center text-lg text-gray-500 mt-5">No products to display</p>
                    )}
                </div>
            </div>

            {/* Pagination controls */}
            <div className="flex absolute bottom-3 w-full justify-center items-center">
                <Pagination>
                    <PaginationContent className="flex-box flex-row flex-wrap">
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(currentPage - 1);
                                }}
                            />
                        </PaginationItem>
                        {[...Array(5)].map((_, index) => (
                            <PaginationItem key={index}>
                                <PaginationLink
                                    href="#"
                                    isActive={index + 1 === currentPage}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handlePageChange(index + 1);
                                    }}
                                >
                                    {index + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationEllipsis/>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(currentPage + 1);
                                }}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
            {isLoading && (<LoadingScreen type={"component"}/>)}
            {isVariantsFormOpen && (
                <VariantForm
                    selectedItem={selectedItem}
                    open={isVariantsFormOpen}
                    onCancel={() => {
                        setIsVariantsFormOpen(false)
                        setSelectedItem(null)
                    }}
                />
            )}
        </div>
    );
};

export default Products;
