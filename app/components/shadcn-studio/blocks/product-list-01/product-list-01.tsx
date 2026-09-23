import { HeartIcon, ShoppingCartIcon } from 'lucide-react'

import { Checkbox as CheckboxPrimitive } from 'radix-ui'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import { cn } from '@/lib/utils'

export type ProductItem = {
  image: string
  imgAlt: string
  name: string
  price: number
  salePrice?: number
  badges: string[],
  barcode?: string,
}

type ProductProps = {
  products: ProductItem[]
}

const ProductList = ({ products }: ProductProps) => {

  const categoryList = [
    "food", "furniture", "books", "electronics", "others"
  ]

  return (
    <section className='bg-soft py-8 sm:py-16 lg:py-18'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Grid wrapper with explicit 1 -> 3 -> 4 column setup */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3'>
          {products.map((product, index) => (
            <div
              key={index}
              className='relative flex flex-col justify-between rounded-lg border bg-card text-card-foreground shadow-sm p-4 h-full w-full overflow-hidden'
            >
              {/* Sale Badge */}
              {product.salePrice && (
                <Badge className='bg-destructive/10 [a&]:hover:bg-destructive/5 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive absolute top-3 left-3 z-10 rounded-sm px-3 py-1 uppercase focus-visible:outline-none'>
                  Sale
                </Badge>
              )}

              <div className='flex flex-col justify-between flex-1 gap-4'>
                {/* Product Image Container with strict max-height */}
                <a href='#' className='flex items-center justify-center pt-2 w-full h-48 overflow-hidden'>
                  <img
                    src={product.image}
                    alt={product.imgAlt}
                    className='h-full w-full object-contain pointer-events-none'
                  />
                </a>

                {/* Product Details */}
                <div className='space-y-4 mt-auto'>
                  <div className='flex flex-col gap-2 text-center'>
                    <a href='#'>
                      <h3 className='text-base font-semibold line-clamp-1'>{product.name}</h3>
                    </a>
                    <div className='flex flex-wrap items-center justify-center gap-1.5'>
                      {product.badges.map((badge, idx) => (
                        <Badge
                          key={idx}
                          className='rounded-sm bg-green-600/10 text-green-600 focus-visible:ring-green-600/20 focus-visible:outline-none dark:bg-green-400/10 dark:text-green-400 dark:focus-visible:ring-green-400/40 text-xs'
                        >
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Product Price & Actions */}
                  <div className='flex items-center justify-between gap-2'>
                    {!product.salePrice ? (
                      <span className='text-lg font-semibold'>${product.price.toFixed(2)}</span>
                    ) : (
                      <div className='flex items-center gap-1.5'>
                        <span className='text-lg font-semibold'>${product.salePrice.toFixed(2)}</span>
                        <span className='text-muted-foreground text-xs font-medium line-through'>
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className='flex items-center gap-1'>
                      <CheckboxPrimitive.Root
                        data-slot='checkbox'
                        className='group focus-visible:ring-ring/50 rounded-sm p-1.5 outline-none focus-visible:ring-3'
                        aria-label='Heart icon'
                      >
                        <span className='group-data-[state=checked]:hidden'>
                          <HeartIcon className='size-4' />
                        </span>
                        <span className='group-data-[state=unchecked]:hidden'>
                          <HeartIcon className='fill-destructive stroke-destructive size-4' />
                        </span>
                      </CheckboxPrimitive.Root>

                      <Button variant='ghost' size='icon' className='size-8'>
                        <ShoppingCartIcon className='size-4' />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductList
