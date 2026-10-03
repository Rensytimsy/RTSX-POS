import { cn } from "cn";
import { FC } from "react";
import { Price, PriceValue } from "@/components/shadcnblocks/price";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
interface ProductPrice {
  regular: number;
  sale?: number;
  currency: string;
}

interface Product {
  barcode: string,
    name: string,
    price: string,
    image: string,
    stock: number,
    description?: string,
}

type ProductCardProps = Product;

type ProductList = Array<Product>;

const PRODUCTS_LIST: ProductList = [
    {
        "barcode": "012345678901",
        "name": "Wireless Ergonomic Mouse",
        "price": "29.99",
        "image": "https://example.com/images/mouse.jpg",
        "stock": 45,
        "description": ""
    },
    {
        "barcode": "012345678902",
        "name": "Mechanical Gaming Keyboard",
        "price": "79.50",
        "image": "https://example.com/images/keyboard.jpg",
        "stock": 12,
        "description": ""
    },
    {
        "barcode": "012345678903",
        "name": "27-Inch 4K Monitor",
        "price": "349.00",
        "image": "https://example.com/images/monitor.jpg",
        "stock": 8,
        "description": ""
    },
    {
        "barcode": "012345678904",
        "name": "USB-C Multi-Port Hub",
        "price": "19.99",
        "image": "https://example.com/images/hub.jpg",
        "stock": 100,
        "description": ""
    },
    {
        "barcode": "012345678905",
        "name": "Noise-Canceling Headphones",
        "price": "129.95",
        "image": "https://example.com/images/headphones.jpg",
        "stock": 0,
        "description": ""
    },
    {
        "barcode": "012345678906",
        "name": "HD Desk Webcam 1080p",
        "price": "49.99",
        "image": "https://example.com/images/webcam.jpg",
        "stock": 23,
        "description": ""
    },
    {
        "barcode": "012345678907",
        "name": "Aluminum Laptop Stand",
        "price": "34.50",
        "image": "https://example.com/images/stand.jpg",
        "stock": 67,
        "description": ""
    },
    {
        "barcode": "012345678908",
        "name": "Portable External SSD 1TB",
        "price": "89.99",
        "image": "https://example.com/images/ssd.jpg",
        "stock": 15,
        "description": ""
    },
    {
        "barcode": "012345678909",
        "name": "Smart Desk Power Strip",
        "price": "24.99",
        "image": "https://example.com/images/powerstrip.jpg",
        "stock": 50,
        "description": ""
    },
    {
        "barcode": "012345678910",
        "name": "Extended Desk Pad Mat",
        "price": "14.99",
        "image": "https://example.com/images/deskpad.jpg",
        "stock": 85,
        "description": ""
    }
];

interface ProductList1Props {
  className?: string;
}

const ProductList1:FC<{productlist: Product[]}> = ({productlist}) => {
  return (
    <section className={cn("py-32")}>
      <div className="">
        <div className="grid place-items-center gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {productlist?.map((item, index) => (
            <ProductCard key={`product-list-1-card-${index}`} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProductCard = ({
  name,
  description,
  image,
  price,
}: ProductCardProps) => {

  return (
    <a
      className="block h-full min-w-62 transition-opacity hover:opacity-80"
    >
      <Card className="h-full overflow-hidden p-0">
        <CardHeader className="relative block p-0">
          <AspectRatio ratio={1.2555} className="overflow-hidden">
            <img
              src={image}
              alt={image}
              className="block size-full object-contain ratio-2 object-center"
            />
          </AspectRatio>
          {/* {badge && (
            <Badge
              style={{
                backgroundColor: badge.color,
              }}
              className="absolute start-4 top-4"
            >
              {badge.text}
            </Badge>
          )} */}
        </CardHeader>
        <CardContent className="flex h-full flex-col gap-4 pb-6">
          <CardTitle className="text-xl font-semibold">{name.slice(0, 10)}....</CardTitle>
          {/* <CardDescription className="font-medium text-muted-foreground">
            {description}
          </CardDescription> */}
          <div className="mt-auto">
            <Price>
              <PriceValue price={price} variant="sale" />
              <PriceValue
                price={price}
                variant="regular"
              />
            </Price>
          </div>
        </CardContent>
      </Card>
    </a>
  );
};

export default ProductList1;
