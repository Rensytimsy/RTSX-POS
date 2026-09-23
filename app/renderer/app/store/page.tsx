"use client"

import ProductList from '../../../components/shadcn-studio/blocks/product-list-01/product-list-01';
import { ProductItem } from '../../../components/shadcn-studio/blocks/product-list-01/product-list-01';
import { ChangeEvent, useEffect, useState } from "react";
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { HeartIcon, ShoppingCartIcon } from 'lucide-react'
import { Checkbox as CheckboxPrimitive } from 'radix-ui'

export const products: ProductItem[] = [
    {
        image: "https://images-na.ssl-images-amazon.com/images/I/61OkDvrLubL.jpg",
        imgAlt: "Matte black wireless earbuds and charging case",
        name: "AuraSound Pro Wireless Headphones",
        price: 249.99,
        salePrice: 199.99,
        badges: ["Best Seller", "20% OFF"],
        barcode: "3dbda99f3b833b5787ce7c79345a1e4fbe2910668daf9511c5783d07b380bffb"
    },
    {
        image: "https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcQ31-Ik6dhM4qDLOzUm0p3jz7HAhosjVZW7z5fLRs9nclV79_DYb-J7B24Zu5Bq4rXrl02oD4X9qSqh2HY",
        imgAlt: "Ergonomic mesh office chair back view on white background",
        name: "ErgoCurve Mesh Office Chair",
        price: 349.00,
        badges: ["Free Shipping"],
        barcode: "f53d08ad7e416b4b2103c6819d3e36b1a5fee47eaaeb99e10003139bd8341536"
    },
    {
        image: "https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcRSD8jzK4W2Sur0XpgnizJDjctr3SO0l2B4K8TmJFhyZDRNW4XpVsxEWBC1Q7c9E5WkFyUAHNRoZWK755A",
        imgAlt: "Compact 75% mechanical keyboard with grey keycaps",
        name: "TactileKey K75 Mechanical Keyboard",
        price: 119.50,
        badges: ["New Arrival"],
        barcode: "5e563b988c4d2f3b72ecad97fa5e438ffd380f277283406522652d2a2db00f53"
    },
    {
        image: "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcRXJ63nXuqX2gVFsgUC89usdcb7q-4tXf4LZhva5kHEM38M-MbX5mRpsx2THIQ-fRq_NS8NtjFTjlPtRAE",
        imgAlt: "Purple insulated reusable water bottle",
        name: "HydroShield Insulated Water Bottle (32oz)",
        price: 34.99,
        badges: ["Eco-Friendly"],
        barcode: "97d43a2e598932a2581eee92ba97e849b86240ea862b5b9407816d74d2fe47a5"
    },
    {
        image: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcS5Uoiq-bWLdjSnEHDx0gD6sNVL6PX5jfuizylODeojCdL-63AWLiJHPGrDIJE65d7mnT9E53FT8ZMiER4",
        imgAlt: "Brown leather laptop backpack standing vertically",
        name: "Heritage Leather Laptop Backpack",
        price: 210.00,
        salePrice: 168.00,
        badges: ["Clearance", "Handmade"],
        barcode: "aa672f3f9ec6413c436c46683dbfed3bc32b89f8246847cebbd74bdd983e431b"
    },
    {
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ89RfsmQ51UFt3AF3HVJAW-d4quJ8BXx5Et3A3Q6d6KQ&s=10",
        imgAlt:"Nescafe coffee",
        name: "Nescafe classic",
        price: 1.00,
        // salePrice: 1.00,
        badges: ["coffee"],
        barcode: "6161106962662"
    }
]

function ProductAddToCart() {
    // by default local storage is an object, to store an object from an array one has to stringify the response
    const temporaryStore = JSON.parse(localStorage.getItem("cartItems"));
    const testProduct =     {
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ89RfsmQ51UFt3AF3HVJAW-d4quJ8BXx5Et3A3Q6d6KQ&s=10",
        imgAlt:"Nescafe coffee",
        name: "Nescafe classic",
        price: 1.00,
        // salePrice: 1.00,
        badges: ["coffee"],
        barcode: "6161106962662"
    }
    // an array to hold selected items
    return localStorage.setItem("productsList", JSON.stringify(testProduct));

    console.log("Hello world!")

}


export default function StorePage() {

    console.log(ProductAddToCart())

    const [barCode, setBarCode] = useState<string>("");

    function BarCodeScanner(productCode: string) {
        const productFound = products.filter((p) => p.barcode === productCode);

        if (productFound.length !== 1) {
            return products;
        }

        return productFound;
    }

    console.log(BarCodeScanner(barCode))
    console.log(barCode)

    return (
        <div>
            <div>
                bar code scanner
                <input
                    type="text"
                    placeholder='Paste the barcode here to reveal the product'
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setBarCode(e.target.value)}
                />

            </div>
            <ProductList products={products} />
        </div>
    )
}