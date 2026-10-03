"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus, Trash, Terminal, Barcode, Trash2, ShoppingCart } from "lucide-react";
import { useCallback, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useEffect } from "react";
import {
    Controller,
    FormProvider,
    useFieldArray,
    useForm,
    useFormContext,
} from "react-hook-form";
import z from "zod";
import { cn } from "cn";

import {
    Logo,
    LogoImageDesktop,
    LogoImageMobile,
} from "@/components/shadcnblocks/logo";
import { Price, PriceValue } from "@/components/shadcnblocks/price";
import QuantityInput from "@/components/shadcnblocks/quantity-input";
import { ChangeEvent } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ProductList1 from "@/components/product-list";

interface ProductPrice {
    regular: number;
    sale?: number;
    currency: string;
}

type CartItem = {
    product_id: string;
    link: string;
    name: string;
    image: string;
    price: ProductPrice;
    quantity: number;
    details: {
        label: string;
        value: string;
    }[];
};

interface CartItemProps extends CartItem {
    index: number;
    onRemoveClick: () => void;
    onQuantityChange: (newQty: number) => void;
}

interface CartProps {
    cartItems: CartItem[];
}

const PAYMENT_METHODS = {
    creditCard: "creditCard",
    paypal: "paypal",
    onlineBankTransfer: "onlineBankTransfer",
};

type PaymentMethod = keyof typeof PAYMENT_METHODS;

const CreditCardPayment = z.object({
    method: z.literal(PAYMENT_METHODS.creditCard),
    cardholderName: z.string(),
    cardNumber: z.string(),
    expiryDate: z
        .string()
        .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid format (MM/YY)")
        .refine((value) => {
            const [mm, yy] = value.split("/").map(Number);

            const now = new Date();
            const currentMonth = now.getMonth() + 1;
            const currentYear = now.getFullYear() % 100;

            if (yy < currentYear) return false;

            if (yy === currentYear && mm < currentMonth) return false;

            return true;
        }, "Card has expired"),
    cvc: z.string(),
});

const PayPalPayment = z.object({
    method: z.literal(PAYMENT_METHODS.paypal),
    payPalEmail: z.string(),
});

const BankTransferPayment = z.object({
    method: z.literal(PAYMENT_METHODS.onlineBankTransfer),
    bankName: z.string(),
    accountNumber: z.string(),
});

const PaymentSchema = z.discriminatedUnion("method", [
    CreditCardPayment,
    PayPalPayment,
    BankTransferPayment,
]);

const checkoutFormSchema = z.object({
    contactInfo: z.object({
        email: z.string(),
        subscribe: z.boolean().optional(),
    }),
    address: z.object({
        country: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        address: z.string(),
        postalCode: z.string(),
        city: z.string(),
        phone: z.string(),
    }),
    shippingMethod: z.string(),
    payment: PaymentSchema,
    products: z
        .object({
            product_id: z.string(),
            quantity: z.number(),
            price: z.number(),
        })
        .array(),
});

type CheckoutFormType = z.infer<typeof checkoutFormSchema>;

const CART_ITEMS: CartItem[] = [
    {
        product_id: "product-1",
        link: "#",
        name: "Stylish Maroon Sneaker",
        image:
            "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/stylish-maroon-sneaker.png",
        price: {
            regular: 354.0,
            currency: "USD",
        },
        quantity: 1,
        details: [
            {
                label: "Color",
                value: "Red",
            },
            {
                label: "Size",
                value: "36",
            },
        ],
    },
    {
        product_id: "product-2",
        link: "#",
        name: "Bicolor Sweatshirt with Embroidered Logo",
        image:
            "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/bicolor-crewneck-sweatshirt-with-embroidered-logo.png",
        price: {
            regular: 499.0,
            currency: "USD",
        },
        quantity: 1,
        details: [
            {
                label: "Color",
                value: "Blue & White",
            },
            {
                label: "Size",
                value: "L",
            },
        ],
    },
    {
        product_id: "product-4",
        link: "#",
        name: "Maroon Leather Handbag",
        image:
            "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/maroon-leather-handbag.png",
        price: {
            regular: 245.0,
            currency: "USD",
        },
        quantity: 1,
        details: [
            {
                label: "Color",
                value: "Maroon",
            },
        ],
    },
];

interface Checkout1Props {
    cartItems?: CartItem[];
    className?: string;
}

type ExpectedData = {
    barcode: string
}

const text_barcodes = [
    {
        "barcode": "012345678901",
        "name": "Wireless Ergonomic Mouse",
        "price": "29.99",
        "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSavea4lk1z6VWuEx6L5rMkrMXT4iqlBCIgTaT7DyRPog&s=10",
        "stock": 45,
        "description": "",
        "id": "1"
    },
    {
        "barcode": "012345678902",
        "name": "Mechanical Gaming Keyboard",
        "price": "79.50",
        "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWeojVwp0-ONMxdCKWZldf6sFzfShO9Ok6EMH1hgG_sA&s=10",
        "stock": 12,
        "description": "",
        "id": "2"
    },
    {
        "barcode": "012345678903",
        "name": "27-Inch 4K Monitor",
        "price": "349.00",
        "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrlsVipVIsDgH8hRRbCd_d2BAdFMalVX6VdpaetNVz6A&s=10",
        "stock": 8,
        "description": "",
        "id": "3"
    },
    {
        "barcode": "012345678904",
        "name": "USB-C Multi-Port Hub",
        "price": "19.99",
        "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4vgCRygZzDBwsnUN8gJHbufUw6KZL-Q8I74CbCJogpg&s=10",
        "stock": 100,
        "description": "",
        "id": "4"
    },
    {
        "barcode": "012345678905",
        "name": "Noise-Canceling Headphones",
        "price": "129.95",
        "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQv6sCSGjrND-CobcOCoT8cbC_RGghXgyQ-LAEL3DHFg&s=10",
        "stock": 0,
        "description": "",
        "id": "5"
    },
    {
        "barcode": "012345678906",
        "name": "HD Desk Webcam 1080p",
        "price": "49.99",
        "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5HsnPmKHwYnIINWsAb4ktSBKq96ciFxWvRVJLcsKuNA&s=10",
        "stock": 23,
        "description": "",
        "id": "6"
    },
    {
        "barcode": "012345678907",
        "name": "Aluminum Laptop Stand",
        "price": "34.50",
        "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9kpE16WmLqK0A0VjKQ-IXQPfD1KL7Rrt8JTar1UtfQQ&s=10",
        "stock": 67,
        "description": "",
        "id": "7"
    },
    {
        "barcode": "012345678908",
        "name": "Portable External SSD 1TB",
        "price": "89.99",
        "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHb_-cHUulH7gMXGKNToV6hQqiWhGPXpzAoEP8IRaVOA&s=10",
        "stock": 15,
        "description": "",
        "id": "8"
    },
    {
        "barcode": "012345678909",
        "name": "Smart Desk Power Strip",
        "price": "24.99",
        "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEf_lOHjhN9Xm5jJCK9Bks12kOvkvpLhkuYBJYokf0Bw&s=10",
        "stock": 50,
        "description": "",
        "id": "9"
    },
    {
        "barcode": "012345678910",
        "name": "Extended Desk Pad Mat",
        "price": "14.99",
        "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRBoZuDjcu51kht3Rn2GSthKCMG6hGEzm8hZkt8N-pHg&s",
        "stock": 85,
        "description": "",
        "id": "10"
    }
]

type ProductItem = {
    barcode: string,
    name: string,
    price: string,
    image: string,
    stock: number,
    description?: string,
    id?: string

}

const Checkout1 = ({ cartItems = CART_ITEMS, className }: Checkout1Props) => {
    const [activeAccordion, setActiveAccordion] = useState("item-1");
    const [barcode, setBarcode] = useState('');
    const [wsRes, setWsRes] = useState();
    const [recentPurchases, setRecentPurchases] = useState<ExpectedData[]>([]);
    const [purchaseLogs, setPurchaseLogs] = useState<ProductItem[]>([]);

    const defaultProducts = cartItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price.sale ?? item.price.regular,
    }));

    const form = useForm({
        resolver: zodResolver(checkoutFormSchema),
        defaultValues: {
            payment: {
                method: PAYMENT_METHODS.creditCard,
            },
            products: defaultProducts,
        },
    });

    const onSubmit = (data: CheckoutFormType) => {
        console.log(data);
    };

    const onContinue = (value: string) => {
        setActiveAccordion(value);
    };

    const handleOnValueChange = (value: string) => {
        setActiveAccordion(value);
    };

    const total = text_barcodes.reduce((sum, item) => {
        const price = Number(item.price) || 0;
        const qty =  1;
        return sum + price * qty;
    }, 0);


    const findScannedItem = (scannedBarcode: string) => {
        const product = text_barcodes.find((product) => product.barcode === scannedBarcode);
        setPurchaseLogs((prevPurchase) => [
            ...prevPurchase,
            {
                name: product.name,
                price: product.price,
                barcode: product.barcode,
                image: product.image,
                stock: product.stock
            }])
        console.log(product.name)
    }

    useEffect(() => {
        const wsScanner = async () => {
            const wsConn = new WebSocket("ws://127.0.0.1:8000/ws/scanner/kfjsakfsdf/");
            wsConn.onopen = () => console.log("successfuly connected!");
            wsConn.onclose = () => console.log("disconnected!")

            console.log("inside useEffect hook", barcode)

            if (barcode.length >= 10) {
                wsConn.send(JSON.stringify({
                    "type": "broadcast.scan.event",
                    "barcode": barcode
                }));
            }

            wsConn.onmessage = (event) => {
                console.log("debugger", event.data)
                const data: ExpectedData = JSON.parse(event.data);
                findScannedItem(data.barcode);
                setRecentPurchases((prevState) => [...prevState, { barcode: data.barcode }]);
            };
            wsConn.onerror = (error) => console.error(error)
        };

        wsScanner();
    }, [barcode])

    console.log("ws res", recentPurchases)
    console.log(purchaseLogs[0]?.name)


    return (
        <section className={cn("py-10 flex flex-row align-center justify-center gap-8 min-h-screen w-full px-4", className)}>
            <div className="flex flex-col w-full max-w-xs h-full bg-white rounded-lg h-screen text-slate-300 font-mono text-xs">

                {/* Log Header */}
                <div className="flex items-center justify-between px-3 py-2 bg-white">
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <Terminal className="w-3.5 h-3.5 text-secondary" />
                        <span className="font-extrabold uppercase tracking-wider text-sm text-secondary">Scan Logs</span>
                    </div>
                    <span className="text-sm text-secondary">{purchaseLogs.length} entries</span>
                </div>

                {/* Simple Log Stream */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-slate-800/40">
                    {purchaseLogs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 text-slate-600 text-center">
                            <Barcode className="w-8 h-8 mb-1 text-gray-400" />
                            <span>Waiting for scans ...</span>
                        </div>
                    ) : (
                        purchaseLogs.map((item: ProductItem, idx: number) => (
                            <div key={idx} className="pt-1 flex items-center justify-between text-slate-300 hover:text-white">
                                <div className="flex items-center gap-2 truncate">
                                    <span className="text-slate-600 text-sm">#{idx + 1}</span>
                                    <span className="text-secondary truncate">{item.name}</span>
                                </div>
                                <span className="text-secondary font-semibold shrink-0 ml-2">
                                    {`${item.name}-${item.barcode}-${item.price ? Number(item.price).toFixed(2) : "0.00"}`}
                                </span>
                            </div>
                        ))
                    )}
                </div>

                {/* Minimal Footer */}
                <div className="px-3 py-1.5  text-center">
                    <button className="text-md text-secondary hover:text-secondary underline underline-offset-2">
                        view full log history
                    </button>
                </div>

            </div>

            <div className="relative">
                <div className="absolute right-0 rounded-sm border border-4 border-soft p-2 w-1/5">
                    <input type="text" placeholder="paste product bar code...." id="" className="outline-none" />
                </div>
                <div className="text-blue-400 underline hover:cursor-pointer hover:text-blue-600">
                    <p className="text-blue-400 underline hover:cursor-pointer hover:text-blue-600">backup scanner</p>
                    <input type="text" onChange={(e: ChangeEvent<HTMLInputElement>) => setBarcode(e.target.value)} />
                    {/* <button>add to cart</button> */}
                </div>

                <ProductList1 productlist={purchaseLogs} />
            </div>

            <div className="flex flex-col w-full max-w-lg h-full bg-white overflow-hidden text-slate-100 font-sans">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 bg-primary">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2">
                            <ShoppingCart className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-base text-slate-100">Purchased Items</h2>
                        </div>
                    </div>
                </div>

                {/* Cart Items Scrollable List */}
                <div className="relative flex-1 overflow-y-auto p-4 space-y-3">
                    {purchaseLogs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-52 text-slate-500 text-center">
                            <ShoppingCart className="w-10 h-10 mb-2 stroke-[1.5] opacity-30" />
                            <p className="text-sm font-medium">Cart is empty</p>
                            <p className="text-xs text-slate-600">Scan barcodes to add products</p>
                        </div>
                    ) : (
                        purchaseLogs.map((p, i) => (
                            <div
                                key={p.barcode || i}
                                className="flex items-center gap-3 p-3 rounded-3xl bg-white border hover:border-slate-700 transition-all"
                            >
                                {/* Product Thumbnail */}
                                <div className="w-14 h-14 rounded-md bg-white border border-secondary/50 overflow-hidden shrink-0 flex items-center justify-center">
                                    {p.image ? (
                                        <img
                                            src={p.image}
                                            alt={p.name || "Product"}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-xs font-mono text-slate-500">No Img</span>
                                    )}
                                </div>

                                <div>
                                    <p className="text-secondary font-semibold">{p.name}</p>
                                    <p className="text-secondary">{p.price}</p>
                                </div>

                                <div className={"bg-secondary rounded-full w-14 h-6 text-center"}>
                                    <p>{0}</p>
                                </div>

                                {/* Remove Button */}
                                <button
                                    type="button"
                                    className="p-1.5 rounded-md text-secondary transition-colors"
                                    title="Remove item"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer / Summary */}
                {text_barcodes.length > 0 && (
                    <div className="absolute bottom-5 w-1/5 p-4 border-t border-slate-800 bg-slate-900/90 space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">Total Amount</span>
                            <span className="text-lg font-bold font-mono text-emerald-400">
                                ${total.toFixed(2)}
                            </span>
                        </div>
                        <button className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors shadow-lg shadow-emerald-950/40">
                            Pay Now
                        </button>
                    </div>
                )}

            </div>
        </section>
    );
};

const ContactFields = () => {
    const form = useFormContext();

    return (
        <FieldGroup className="gap-3.5">
            <Controller
                name="contactInfo.email"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                            className="text-sm font-normal"
                            htmlFor="checkout-email"
                        >
                            Email
                        </FieldLabel>
                        <Input
                            {...field}
                            id="checkout-email"
                            aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />
            <Controller
                name="contactInfo.subscribe"
                control={form.control}
                render={({ field }) => (
                    <Field orientation="horizontal">
                        <Checkbox
                            id="checkout-subscribe"
                            name={field.name}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                        <FieldLabel htmlFor="checkout-subscribe" className="font-normal">
                            Email me with news and offers
                        </FieldLabel>
                    </Field>
                )}
            />
        </FieldGroup>
    );
};

const AddressFields = () => {
    const form = useFormContext();

    return (
        <FieldGroup className="gap-3.5">
            <Controller
                name="address.country"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                            className="text-sm font-normal"
                            htmlFor="checkout-country"
                        >
                            Country
                        </FieldLabel>
                        <Input
                            {...field}
                            id="checkout-country"
                            aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />
            <div className="flex gap-3.5 max-sm:flex-col">
                <Controller
                    name="address.firstName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel
                                className="text-sm font-normal"
                                htmlFor="checkout-firstName"
                            >
                                First Name
                            </FieldLabel>
                            <Input
                                {...field}
                                id="checkout-firstName"
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name="address.lastName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel
                                className="text-sm font-normal"
                                htmlFor="checkout-lastName"
                            >
                                Last Name
                            </FieldLabel>
                            <Input
                                {...field}
                                id="checkout-lastName"
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
            </div>
            <Controller
                name="address.address"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                            className="text-sm font-normal"
                            htmlFor="checkout-address"
                        >
                            Address
                        </FieldLabel>
                        <Input
                            {...field}
                            id="checkout-address"
                            aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />
            <div className="flex gap-3.5 max-sm:flex-col">
                <Controller
                    name="address.postalCode"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel
                                className="text-sm font-normal"
                                htmlFor="checkout-postalCode"
                            >
                                Postal Code
                            </FieldLabel>
                            <Input
                                {...field}
                                id="checkout-postalCode"
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name="address.city"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel
                                className="text-sm font-normal"
                                htmlFor="checkout-city"
                            >
                                City
                            </FieldLabel>
                            <Input
                                {...field}
                                id="checkout-city"
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
            </div>
            <Controller
                name="address.phone"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                            className="text-sm font-normal"
                            htmlFor="checkout-phone"
                        >
                            Phone
                        </FieldLabel>
                        <Input
                            {...field}
                            id="checkout-phone"
                            aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />
        </FieldGroup>
    );
};

const ShippingMethodFields = () => {
    const form = useFormContext();

    return (
        <Controller
            name="shippingMethod"
            control={form.control}
            render={({ field, fieldState }) => (
                <Field>
                    <RadioGroup
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex max-sm:flex-col"
                    >
                        <FieldLabel htmlFor="checkout-shippingMethod-1">
                            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                <FieldContent>
                                    <FieldTitle>UPS</FieldTitle>
                                    <FieldDescription>Delivery: Tomorrow</FieldDescription>
                                </FieldContent>
                                <div className="flex gap-3.5">
                                    <p className="text-sm">$10.00</p>
                                    <RadioGroupItem
                                        value="UPS"
                                        id="checkout-shippingMethod-1"
                                        aria-invalid={fieldState.invalid}
                                    />
                                </div>
                            </Field>
                        </FieldLabel>
                        <FieldLabel htmlFor="checkout-shippingMethod-2">
                            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                <FieldContent>
                                    <FieldTitle>FedEx</FieldTitle>
                                    <FieldDescription>Delivery: Next Week</FieldDescription>
                                </FieldContent>
                                <div className="flex gap-3.5">
                                    <p className="text-sm">$2.99</p>
                                    <RadioGroupItem
                                        value="FedEx"
                                        id="checkout-shippingMethod-2"
                                        aria-invalid={fieldState.invalid}
                                    />
                                </div>
                            </Field>
                        </FieldLabel>
                    </RadioGroup>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
    );
};

const PaymentFields = () => {
    const form = useFormContext();
    const paymentMethod = form.watch("payment.method") as PaymentMethod;

    return (
        <div className="space-y-7">
            <Controller
                name="payment.method"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field>
                        <RadioGroup
                            name={field.name}
                            value={field.value}
                            onValueChange={field.onChange}
                        >
                            <FieldLabel htmlFor="checkout-payment-method-1">
                                <Field
                                    orientation="horizontal"
                                    data-invalid={fieldState.invalid}
                                >
                                    <FieldContent className="flex-1">
                                        <FieldTitle>Credit Card</FieldTitle>
                                    </FieldContent>
                                    <img
                                        src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/visa-icon.svg"
                                        alt="Credit Card"
                                        className="size-5"
                                    />
                                    <RadioGroupItem
                                        value="creditCard"
                                        id="checkout-payment-method-1"
                                        aria-invalid={fieldState.invalid}
                                    />
                                </Field>
                            </FieldLabel>
                            <FieldLabel htmlFor="checkout-payment-method-2">
                                <Field
                                    orientation="horizontal"
                                    data-invalid={fieldState.invalid}
                                >
                                    <FieldContent className="flex-1">
                                        <FieldTitle>PayPal</FieldTitle>
                                    </FieldContent>
                                    <img
                                        src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/paypal-icon.svg"
                                        alt="PayPal"
                                        className="size-5"
                                    />
                                    <RadioGroupItem
                                        value="paypal"
                                        id="checkout-payment-method-2"
                                        aria-invalid={fieldState.invalid}
                                    />
                                </Field>
                            </FieldLabel>
                            <FieldLabel htmlFor="checkout-payment-method-3">
                                <Field
                                    orientation="horizontal"
                                    data-invalid={fieldState.invalid}
                                >
                                    <FieldContent>
                                        <FieldTitle>Online Bank Transfer</FieldTitle>
                                    </FieldContent>
                                    <RadioGroupItem
                                        value="onlineBankTransfer"
                                        id="checkout-payment-method-3"
                                        aria-invalid={fieldState.invalid}
                                    />
                                </Field>
                            </FieldLabel>
                        </RadioGroup>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />
            <PaymentFieldsByMethod method={paymentMethod} />
        </div>
    );
};

const PaymentFieldsByMethod = ({ method }: { method: PaymentMethod }) => {
    const form = useFormContext();

    if (!method) return;

    switch (method) {
        case PAYMENT_METHODS.creditCard:
            return (
                <div className="space-y-3.5">
                    <Controller
                        name="payment.cardholderName"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel
                                    className="text-sm font-normal"
                                    htmlFor="checkout-payment-cardholderName"
                                >
                                    Cardholder Name
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="checkout-payment-cardholderName"
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="payment.cardNumber"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel
                                    className="text-sm font-normal"
                                    htmlFor="checkout-payment-cardNumber"
                                >
                                    Card Number
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="checkout-payment-cardNumber"
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <div className="flex gap-3.5 max-sm:flex-col">
                        <DateInput />
                        <Controller
                            name="payment.cvc"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel
                                        className="text-sm font-normal"
                                        htmlFor="checkout-payment-cvc"
                                    >
                                        Card Number
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="checkout-payment-cvc"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </div>
                </div>
            );
        case PAYMENT_METHODS.paypal:
            return (
                <Controller
                    name="payment.payPalEmail"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel
                                className="text-sm font-normal"
                                htmlFor="checkout-payment-payPalEmail"
                            >
                                PayPal Email
                            </FieldLabel>
                            <Input
                                {...field}
                                type="email"
                                placeholder="you-email-here@email.com"
                                id="checkout-payment-payPalEmail"
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
            );
        case PAYMENT_METHODS.onlineBankTransfer:
            return (
                <div className="space-y-3.5">
                    <Controller
                        name="payment.bankName"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel
                                    className="text-sm font-normal"
                                    htmlFor="checkout-payment-bankName"
                                >
                                    Bank Name
                                </FieldLabel>
                                <Input
                                    {...field}
                                    placeholder="Bank Name"
                                    id="checkout-payment-bankName"
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="payment.accountNumber"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel
                                    className="text-sm font-normal"
                                    htmlFor="checkout-payment-accountNumber"
                                >
                                    Account Number
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="checkout-payment-accountNumber"
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </div>
            );
        default:
            return null;
    }
};

const DateInput = () => {
    const form = useFormContext();

    return (
        <Controller
            name="payment.expiryDate"
            control={form.control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                        className="text-sm font-normal"
                        htmlFor="checkout-payment-expiryDate"
                    >
                        Card Number
                    </FieldLabel>
                    <Input
                        {...field}
                        onChange={(e) => {
                            let val = e.target.value;
                            val = val.replace(/[^0-9/]/g, "");

                            const prev = field.value ?? "";
                            const isDeleting = val.length < prev.length;

                            if (!isDeleting) {
                                if (val.length === 2 && !val.includes("/")) {
                                    val = val + "/";
                                }
                            }

                            if (val.length > 5) {
                                val = val.slice(0, 5);
                            }

                            field.onChange(val);
                        }}
                        pattern="^(0[1-9]|1[0-2])/[0-9]{2}$"
                        placeholder="MM/YY"
                        id="checkout-payment-expiryDate"
                        aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
    );
};

const Cart = ({ cartItems }: CartProps) => {

    return (
        <div className="p-2">
            <div className="border-b py-7">
                <h2 className="text-lg leading-relaxed font-semibold">Cart Items</h2>
            </div>

            { }

        </div>
    );
};

const CartItem = ({
    image,
    name,
    link,
    details,
    price,
    index,
    onQuantityChange,
    onRemoveClick,
}: CartItemProps) => {
    const { regular, currency } = price;

    return (
        <Card className="rounded-lg bg-white p-4 shadow-none">
            <div className="flex w-full h-38 gap-3.5 max-sm:flex-col">
                <div className="shrink-3 basis-15">
                    {/* <AspectRatio ratio={1} className="overflow-hidden rounded-lg">
                        <img
                            src={image}
                            alt={name}
                            className="block max-h-[200px] border object-cover object-center"
                        />
                    </AspectRatio> */}
                </div>
                <div className="flex-1">
                    <div className="flex flex-col justify-between gap-3">
                        <div className="flex w-full justify-between gap-3">
                            <div className="flex-1">
                                <CardTitle className="text-sm font-medium">
                                    <a href={link}>{name}</a>
                                </CardTitle>
                                {/* <ProductDetails details={details} /> */}
                            </div>
                            <div>
                                <Price className="text-sm font-semibold">
                                    <PriceValue
                                        price={String(regular)}
                                        currency={currency}
                                        variant="regular"
                                    />
                                </Price>
                            </div>
                        </div>
                        <div className="flex w-full justify-between gap-3">
                            <QuantityField
                                index={index}
                                onQuantityChange={onQuantityChange}
                            />
                            <Button size="icon" variant="ghost" onClick={onRemoveClick}>
                                <Trash />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

const ProductDetails = ({
    details,
}: {
    details?: {
        label: string;
        value: string;
    }[];
}) => {
    if (!details) return;
    return (
        <ul>
            {details?.map((item, index) => {
                const isLast = index === details.length - 1;

                return (
                    <li className="inline" key={`product-details-${index}`}>
                        <dl className="inline text-xs text-muted-foreground">
                            <dt className="inline">{item.label}: </dt>
                            <dd className="inline">{item.value}</dd>
                            {!isLast && <span className="mx-1 text-muted-foreground">/</span>}
                        </dl>
                    </li>
                );
            })}
        </ul>
    );
};

const QuantityField = ({
    index,
    onQuantityChange,
}: {
    index: number;
    onQuantityChange: (n: number) => void;
}) => {
    const { control } = useFormContext();

    return (
        <Controller
            name={`products.${index}.quantity`}
            control={control}
            render={({ field }) => {
                return (
                    <Field className="w-full max-w-28">
                        <QuantityInput
                            inputProps={field}
                            onValueChange={(newQty) => {
                                field.onChange(newQty);
                                onQuantityChange(newQty);
                            }}
                            className="rounded-none"
                        />
                    </Field>
                );
            }}
        />
    );
};

export default Checkout1;
