import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SaleItem } from '../types';
import { Stock } from '@/pages/Dashboard/types';

export function ProductsSection({
    saleItems,
    availableStocks,
    processing,
    removeProduct,
    updateProduct,
    handleStockSelection,
    addNewProduct,
}: {
    saleItems: SaleItem[];
    availableStocks: Stock[];
    processing: boolean;
    removeProduct: (index: number) => void;
    updateProduct: (index: number, field: keyof SaleItem, value: any) => void;
    handleStockSelection: (index: number, value: string) => void;
    addNewProduct: (e: React.FormEvent) => void;
}) {
    return (
        <div className="space-y-6">
            {saleItems.map((item, index) => (
                <div key={`${item.stock_id}-${index}`} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-medium">Product {index + 1}</h3>
                        {index > 0 && (
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeProduct(index)} disabled={processing}>
                                Remove
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Product</Label>
                            <Select value={item.stock_id} onValueChange={(value) => handleStockSelection(index, value)} disabled={processing}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Product" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableStocks.map((stock) => (
                                        <SelectItem key={stock.id} value={stock.id.toString()}>
                                            {stock.product.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {item.product_id && (
                                <div className="text-sm text-muted-foreground">
                                    Price: {item.product_price} per {item.unit}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Quantity</Label>
                            <Input
                                type="number"
                                step="any"
                                min="0"
                                max={item.stock_available}
                                value={item.sale_quantity || ''}
                                onChange={(e) => {
                                    const value = parseFloat(e.target.value) || 0;
                                    const max = item.stock_available;
                                    updateProduct(index, 'sale_quantity', Math.min(value, max));
                                }}
                                disabled={processing || !item.product_id}
                            />
                            {item.product_id && (
                                <div className="text-sm text-muted-foreground">
                                    Available: {item.stock_available} {item.unit}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Total</Label>
                            <Input type="number" value={item.total_price.toFixed(2)} readOnly />
                        </div>
                    </div>
                </div>
            ))}

            <Button type="button" variant="outline" onClick={addNewProduct} className="w-full" disabled={processing}>
                + Add Another Product
            </Button>
        </div>
    );
}
