export interface IMarketPrice {
    crop: string;
    market: string;
    district: string;
    state: string;
    date: Date;
    minimumPrice: number;
    maximumPrice: number;
    modalPrice: number;
    arrivalQuantity: number;
    source: string;
    createdAt?: Date;
    updatedAt?: Date;
}
