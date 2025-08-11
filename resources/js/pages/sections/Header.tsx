import {
  MapPinned,
  MoreVerticalIcon,
  SearchIcon,
  ShoppingBasketIcon,
} from "lucide-react";
import { MainNavigation } from "./MainNav";
import * as React from "react";
import { Button } from "@/components/ui/button";

export default function AppHeader() {
  const [showMobileSearch, setShowMobileSearch] = React.useState(false);
  return (
    <div>
      {/* Header */}
      <header className="container mx-auto flex flex-col md:flex-row justify-between items-center   relative ">
        {/* Logo and Mobile Menu */}
        <div className="flex items-center justify-between md:justify-center w-full md:w-1/6 ">
          <div className="flex items-center gap-2 text-blue-900">
            {/* Mobile Menu Button */}
            <Button variant={"ghost"} className="rounded-full md:hidden">
              <MoreVerticalIcon />
              
            </Button>

            {/* Logo - Responsive sizing */}
            <div>
              <img
                src="/images/milky.png"
                alt="KayKay's Dairy Logo"
                className="w-28 md:w-35"
              />
            </div>
          </div>

          {/* Mobile Icons */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant={"ghost"}
              className="px-2"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              <SearchIcon size={20} />
            </Button>
            <Button variant={"ghost"} className="px-2">
              <MapPinned color="blue" size={24} className="animate-bounce" />
            </Button>
            <Button size={"sm"} className="rounded-full bg-white text-blue-800">
              <ShoppingBasketIcon size={20} />
            </Button>
          </div>
        </div>

        <div className="hidden md:w-5/6 md:block">
          <MainNavigation />
        </div>

        {/* Desktop Search and Icons */}

        {/* Mobile Search - Conditionally shown */}
        {showMobileSearch && (
          <div className="w-full mt-2 px-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 rounded-full border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <SearchIcon className="absolute right-3 top-2.5 text-blue-400" />
            </div>
          </div>
        )}
      </header>
      
    </div>
  );
}
