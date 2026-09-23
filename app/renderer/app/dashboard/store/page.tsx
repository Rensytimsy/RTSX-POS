"use client"
import ProductList from "../../../../components/shadcn-studio/blocks/product-list-01/product-list-01"
import { products } from "@/app/store/page"
import { useState } from "react"

export default function StorePage() {

    const [activeCategory, setActiveCategory] = useState("")

    const categoryList = [
        "food", "furniture", "books", "electronics", "others"
    ]
    return (
        <div className="bg-soft py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-white uppercase tracking-wide">
                        Products in Store
                    </p>
                    <h2 className="text-2xl font-semibold sm:text-3xl lg:text-4xl text-gray-900">
                        Products List
                    </h2>
                </div>

                <div className="grid grid-cols-4 gap-3">
                    {categoryList.map((cl: string) => (
                        <button
                            key={cl}
                            type="button"
                            onClick={() => setActiveCategory?.(cl)}
                            className={`rounded-full p-3 text-sm font-medium w-32 transition-colors
            ${activeCategory === cl
                                    ? "bg-gray-900 text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-100"}`}
                        >
                            {cl}
                        </button>
                    ))}
                </div>

                <ProductList products={products} />
            </div>
        </div>
    )
}