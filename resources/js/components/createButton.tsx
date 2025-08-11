
import { Link } from "@inertiajs/react";
import { Plus } from "lucide-react";
import React, { FunctionComponent } from 'react';
import { Button } from "./ui/button";


interface CreateButtonProps {
    toRoute: string,
    action: string
}    

export default function CreateButton({toRoute, action}: CreateButtonProps) {
    return (
        <Link href={route(toRoute)}>
            <Button className="rounded-full">
                <Plus className=" h-6 w-6" />
                 <span className="hidden md:flex hover:flex">{action}</span>
            </Button>
        </Link>
    );
}

