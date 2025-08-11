import AppLayout from "@/layouts/app-layout";
import ProductForm from "./AddProductForm";
import { Head } from "@inertiajs/react";

import { PageProps } from "@inertiajs/core";

interface ProductData {
    id?: number;
    uuid?: string,
    name: string;
    unit: string;
    price_per_unit: number;
    is_active: boolean;
}

interface EditProps extends PageProps {
    initialData?: ProductData ;
}


export default function Add({ initialData }: EditProps) {
    const title = initialData && initialData?.name;
const breadcrumb =
    initialData?.id != undefined
        ? [
              {
                  title: 'Products',
                  href: '/product',
              },
              {
                  title: `Edit ${title}`,
                  href: '/product/edit',
              },
          ]
        : [
              {
                  title: 'Products',
                  href: '/product',
              },
              {
                  title: 'Add new product',
                  href: '/product/edit',
              },
          ];
    

     return (
         <AppLayout breadcrumbs={breadcrumb}>
             <Head title="Add Stock" />
             <div className=" flex-1 flex-col justify-start gap-4 overflow-x-auto rounded-xl p-4">
                 <ProductForm initialData={initialData} />
             </div>
         </AppLayout>
     );
}