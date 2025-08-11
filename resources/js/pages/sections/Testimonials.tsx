import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Cake, Egg, FlaskConical, Milk, Truck,  } from "lucide-react";
import * as React from "react";

export default function Testimonials() {
     const plugin = React.useRef(
       Autoplay({ delay: 9000, stopOnInteraction: true })
     );

    return (
        <section className="relative z-10 py-16">
            <div className="container mx-auto px-4">
                <h2 className="mb-12 text-center text-3xl font-bold text-blue-900">What Our Customers Say</h2>

                <Carousel
                    plugins={[plugin.current]}
                    className="mx-auto w-full max-w-4xl"
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                >
                    <CarouselContent className="-ml-1">
                        {/* Testimonial 1 */}
                        <CarouselItem className="basis-full pl-1 sm:basis-1/2 lg:basis-1/3">
                            <div className="p-2">
                                <Card className="carousel-item border-blue-100 shadow-sm">
                                    <CardContent className="p-6">
                                        <div className="mb-4 flex items-center">
                                            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                                <img src="/images/image.png" className="rounded-full" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-blue-900">Peter Maina</h4>
                                                <span className="text-yellow-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i}>★</span>
                                                    ))}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-blue-800 italic">
                                            "Their eggs are always fresh and yolky. Perfect for my morning omelets. Delivery is always on time!"
                                        </p>
                                        <div className="mt-4 flex items-center text-blue-600">
                                            <Egg size={18} className="mr-1" />
                                            <span className="text-sm">Orders Weekly</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>

                        <CarouselItem className="basis-full pl-1 sm:basis-1/2 lg:basis-1/3">
                            <div className="p-2">
                                <Card className="carousel-item border-blue-100 shadow-sm">
                                    <CardContent className="p-6">
                                        <div className="mb-4 flex items-center">
                                            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                                <img src="/images/image.png" className="rounded-full" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-blue-900">Sarah Johnson</h4>
                                                <span className="text-yellow-400">
                                                    {[...Array(4)].map((_, i) => (
                                                        <span key={i}>★</span>
                                                    ))}
                                                </span>
                                                <span className="text-gray-400">★</span>
                                            </div>
                                        </div>
                                        <p className="text-blue-800 italic">
                                            "KayKay's milk is the freshest I've ever tasted! My family won't drink any other brand now. The home
                                            delivery is so convenient too."
                                        </p>
                                        <div className="mt-4 flex items-center text-blue-600">
                                            <Milk size={18} className="mr-1" />
                                            <span className="text-sm">Regular Customer for 2 years</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>

                        <CarouselItem className="basis-full pl-1 sm:basis-1/2 lg:basis-1/3">
                            <div className="p-2">
                                <Card className="carousel-item border-blue-100 shadow-sm">
                                    <CardContent className="p-6">
                                        <div className="mb-4 flex items-center">
                                            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                                <img src="/images/image.png" className="rounded-full" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-blue-900">Faith Njeri</h4>
                                                <span className="text-yellow-400">
                                                    {[...Array(4)].map((_, i) => (
                                                        <span key={i}>★</span>
                                                    ))}
                                                </span>
                                                <span className="text-gray-400">★</span>
                                            </div>
                                        </div>
                                        <p className="text-blue-800 italic">
                                            "KayKay's mala is so thick and tasty. I enjoy it every day after work. Highly recommended!"
                                        </p>
                                        <div className="mt-4 flex items-center text-blue-600">
                                            <FlaskConical size={18} className="mr-1" />
                                            <span className="text-sm">Daily Mala Lover</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>

                        <CarouselItem className="basis-full pl-1 sm:basis-1/2 lg:basis-1/3">
                            <div className="p-2">
                                <Card className="carousel-item border-blue-100 shadow-sm">
                                    <CardContent className="p-6">
                                        <div className="mb-4 flex items-center">
                                            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                                <img src="/images/image.png" className="rounded-full" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-blue-900">Lucy Wambui</h4>
                                                <span className="text-yellow-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i}>★</span>
                                                    ))}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-blue-800 italic">
                                            "The cakes are moist, sweet, and fresh every single time. My kids love them for birthdays!"
                                        </p>
                                        <div className="mt-4 flex items-center text-blue-600">
                                            <Cake size={18} className="mr-1" />
                                            <span className="text-sm">Birthday Regular</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                        <CarouselItem className="basis-full pl-1 sm:basis-1/2 lg:basis-1/3">
                            <div className="p-2">
                                <Card className="carousel-item border-blue-100 shadow-sm">
                                    <CardContent className="p-6">
                                        <div className="mb-4 flex items-center">
                                            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                                <img src="/images/image.png" className="rounded-full" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-blue-900">Brian Otieno</h4>
                                                <span className="text-yellow-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i}>★</span>
                                                    ))}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-blue-800 italic">
                                            "Their doorstep delivery is always on time, even during bad weather. I never miss my milk!"
                                        </p>
                                        <div className="mt-4 flex items-center text-blue-600">
                                            <Truck size={18} className="mr-1" />
                                            <span className="text-sm">Reliable Delivery Since 2022</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    </CarouselContent>

                    <div className="mt-8 flex justify-center gap-4">
                        <CarouselPrevious className="relative top-0 left-0 translate-y-0 border-blue-200 bg-white/80 text-blue-900 hover:bg-white" />
                        <CarouselNext className="relative top-0 right-0 translate-y-0 border-blue-200 bg-white/80 text-blue-900 hover:bg-white" />
                    </div>
                </Carousel>
            </div>
        </section>
    );
}