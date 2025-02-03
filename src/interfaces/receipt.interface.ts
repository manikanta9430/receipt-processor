export interface ReceiptI{
    retailer: string;
    purchaseDate: string;
    purchaseTime: string;
    items: PurchaseItem[];
    total: number;
}

export interface PurchaseItem{
    shortDescription: string;
    price: number;
}