"use client";

import * as React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Link } from "@radix-ui/react-navigation-menu";
import { MapPinned, SearchIcon, ShoppingBasketIcon } from "lucide-react";

const menuItems = [
  {
    title: "Home",
    href: "/",
    description: "Welcome to KayKay's Dairy",
    subItems: [
      {
        title: "Welcome",
        href: "/",
        description: "Discover our farm fresh products",
      },
      {
        title: "Special Offers",
        href: "/offers",
        description: "Current promotions and discounts",
      },
      {
        title: "Our Story",
        href: "/story",
        description: "Learn about our dairy farm history",
      },
    ],
  },
  {
    title: "Products",
    href: "/products",
    description: "Our farm fresh offerings",
    subItems: [
      {
        title: "Milk Products",
        href: "/products/milk",
        description: "Fresh milk varieties",
      },
      {
        title: "Cheese",
        href: "/products/cheese",
        description: "Artisanal cheese selection",
      },
      {
        title: "Yogurt",
        href: "/products/yogurt",
        description: "Creamy yogurt options",
      },
      {
        title: "Specialty Items",
        href: "/products/specialty",
        description: "Seasonal and specialty products",
      },
    ],
  },
  {
    title: "About",
    href: "/about",
    description: "Learn about our farm",
    subItems: [
      {
        title: "Our Farm",
        href: "/about/farm",
        description: "See where our products come from",
      },
      {
        title: "Sustainability",
        href: "/about/sustainability",
        description: "Our eco-friendly practices",
      },
      {
        title: "Team",
        href: "/about/team",
        description: "Meet the people behind our dairy",
      },
    ],
  },
  {
    title: "Delivery",
    href: "/delivery",
    description: "How we get products to you",
    subItems: [
      {
        title: "Areas Covered",
        href: "/delivery/areas",
        description: "Check if we deliver to your location",
      },
      {
        title: "Schedule",
        href: "/delivery/schedule",
        description: "Delivery days and times",
      },
      {
        title: "Subscription",
        href: "/delivery/subscription",
        description: "Regular delivery options",
      },
    ],
  },
  {
    title: "Contact",
    href: "/contact",
    description: "Get in touch with us",
    subItems: [
      {
        title: "Visit Us",
        href: "/contact/visit",
        description: "Farm location and visiting hours",
      },
      {
        title: "Customer Service",
        href: "/contact/service",
        description: "Questions and support",
      },
      {
        title: "Wholesale",
        href: "/contact/wholesale",
        description: "Inquiries for businesses",
      },
    ],
  },
];

export function MainNavigation() {
    return (
      <div className="flex flex-col gap-4 items-center justify-between   ">
        <div className="hidden md:flex items-center  w-full  justify-end px-1 gap-10">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="px-4 py-2 rounded-full border border-blue-300 focus:outline-none focus:ring-2 focus:ring-amber-950-300 w-64"
            />
            <SearchIcon className="absolute right-3 top-2.5 text-blue-400" />
          </div>

          <Button className="rounded-full bg-white text-blue-800">
            <ShoppingBasketIcon size={24} />
            <span className="ml-1">Cart</span>
          </Button>
        </div>
        <NavigationMenu className=" min-w-full flex justify-around">
          <NavigationMenuList className="">
            {menuItems.map((item) => (
              <NavigationMenuItem key={item.title}>
                {item.subItems ? (
                  <>
                    <NavigationMenuTrigger className="text-blue-900 hover:text-blue-700 hover:bg-amber-700 data-[active]:bg-amber-600 data-[state=open]:bg-amber-500">
                      {item.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-black">
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <Link
                              className="flex h-full w-full select-none flex-col justify-center rounded-md bg-blue-300 p-6 no-underline outline-none focus:shadow-md"
                              href={item.href}
                            >
                              <div className="mb-2 mt-4 text-lg font-medium text-red-900">
                                {item.title}
                              </div>
                              <p className="text-sm leading-tight text-blue-700">
                                {item.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        {item.subItems.map((subItem) => (
                          <ListItem
                            key={subItem.title}
                            href={subItem.href}
                            title={subItem.title}
                          >
                            {subItem.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <Link href={item.href}>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      <Button
                        variant="ghost"
                        className="text-blue-900 hover:text-blue-700 hover:bg-blue-50"
                      >
                        {item.title}
                      </Button>
                    </NavigationMenuLink>
                  </Link>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
          <Button variant={"ghost"} className="text-blue-900 ms-10">
            <MapPinned color="blue" size={30} className="" />
          </Button>
        </NavigationMenu>
      </div>
    );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 focus:bg-blue-50"
          {...props}
        >
          <div className="text-sm font-medium leading-none text-blue-900">
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-blue-700">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
