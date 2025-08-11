import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Milk, Factory, Heart, Truck, Egg, GlassWater, CakeSliceIcon } from "lucide-react";

export default function Products() {
    return (
        <div>
            <section className="relative z-10 bg-red-300 bg-gradient-to-tr to-blue-950 py-20">
                <div className="container mx-auto px-4">
                    <h2 className="mb-12 text-center text-3xl font-bold text-white">Our Dairy Products & Services</h2>

                    <Carousel plugins={[Autoplay({ delay: 3000 })]} opts={{ loop: true }} className="w-full">
                        <CarouselContent className="-ml-1">
                            {/* Product 1 - Fresh Milk */}
                            <CarouselItem className="basis-full pl-1 sm:basis-1/2 lg:basis-1/3">
                                <div className="p-2">
                                    <Card className="border-blue-50 shadow-sm transition-all hover:shadow-md">
                                        <CardContent className="flex flex-col items-center p-6">
                                            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-blue-400">
                                                <Milk className="text-violet-600" size={48} />
                                            </div>
                                            <h3 className="mb-2 text-xl font-semibold text-blue-900">Fresh Milk</h3>
                                            <p className="mb-4 text-center text-blue-800">
                                                Pasteurized whole milk from grass-fed cows, delivered fresh daily.
                                            </p>
                                            <Button className="bg-blue-700 text-white hover:bg-blue-800">Brows Products</Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>

                            {/* Product 2 - Organic Yogurt */}
                            <CarouselItem className="basis-full pl-1 sm:basis-1/2 lg:basis-1/3">
                                <div className="p-2">
                                    <Card className="border-blue-50 shadow-sm transition-all hover:shadow-md">
                                        <CardContent className="flex flex-col items-center p-6">
                                            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
                                                <CakeSliceIcon className="text-blue-700" size={48} />
                                            </div>
                                            <h3 className="mb-2 text-xl font-semibold text-blue-900">Fresh Cakes</h3>
                                            <p className="mb-4 text-center text-blue-800">
                                                Soft, moist cakes baked daily with love — perfect for birthdays, tea time, or dessert.
                                            </p>

                                            <Button className="bg-blue-700 text-white hover:bg-blue-800">View Details</Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>

                            {/* Product 3 - Artisan Cheese */}
                            <CarouselItem className="basis-full pl-1 sm:basis-1/2 lg:basis-1/3">
                                <div className="p-2">
                                    <Card className="border-blue-50 shadow-sm transition-all hover:shadow-md">
                                        <CardContent className="flex flex-col items-center p-6">
                                            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-pink-700">
                                                <Factory className="text-pink-100" size={48} />
                                            </div>
                                            <h3 className="mb-2 text-xl font-semibold text-blue-900">Artisan Cheese</h3>
                                            <p className="mb-4 text-center text-blue-800">
                                                Handcrafted cheeses aged to perfection in our dairy cellars.
                                            </p>
                                            <Button className="bg-blue-700 text-white hover:bg-blue-800">View Details</Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>

                            {/* Product 4 - Butter */}
                            <CarouselItem className="basis-full pl-1 sm:basis-1/2 lg:basis-1/3">
                                <div className="p-2">
                                    <Card className="border-blue-50 shadow-sm transition-all hover:shadow-md">
                                        <CardContent className="flex flex-col items-center p-6">
                                            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-white">
                                                <GlassWater className="text-red-700" size={48} />
                                            </div>
                                            <h3 className="mb-2 text-xl font-semibold text-blue-900">Fermented Mala</h3>
                                            <p className="mb-4 text-center text-blue-800">
                                                Rich, creamy fermented milk packed with nutrients , a perfect healthy drink.
                                            </p>
                                            <Button className="bg-blue-700 text-white hover:bg-blue-800">View Details</Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                            <CarouselItem className="basis-full pl-1 sm:basis-1/2 lg:basis-1/3">
                                <div className="p-2">
                                    <Card className="border-blue-50 shadow-sm transition-all hover:shadow-md">
                                        <CardContent className="flex flex-col items-center p-6">
                                            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
                                                <Egg className="text-amber-700" size={48} />
                                            </div>
                                            <h3 className="mb-2 text-xl font-semibold text-blue-900">Organic Eggs</h3>
                                            <p className="mb-4 text-center text-blue-800">
                                                Nutritious, farm-raised eggs with rich yolks great for breakfast, baking, or protein needs.
                                            </p>

                                            <Button className="bg-blue-700 text-white hover:bg-blue-800">View Details</Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>

                            {/* Product 5 - delivery */}
                            <CarouselItem className="basis-full pl-1 sm:basis-1/2 lg:basis-1/3">
                                <div className="p-2">
                                    <Card className="border-blue-50 shadow-sm transition-all hover:shadow-md">
                                        <CardContent className="flex flex-col items-center p-6">
                                            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
                                                <Truck className="text-pink-600" size={48} />
                                            </div>
                                            <h3 className="mb-2 text-xl font-semibold text-blue-900">Milk Delivery</h3>
                                            <p className="mb-4 text-center text-blue-800">
                                                Enjoy fresh, pure milk delivered straight to your door any time. fast, clean, and reliable.
                                            </p>
                                            <Button className="bg-blue-700 text-white hover:bg-blue-800">View Details</Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        </CarouselContent>

                        {/* Custom navigation positioned at bottom center */}
                        <div className="mt-8 flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((_, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    className="h-2 w-2 rounded-full border-blue-300 p-0"
                                    onClick={() => {}}
                                />
                            ))}
                        </div>
                    </Carousel>
                </div>
            </section>
        </div>
    );   
}