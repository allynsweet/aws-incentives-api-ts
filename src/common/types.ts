export interface IncentivePayload {
    creationRequestId: string;
    partnerId: string;
    value: GiftCardAmount;
}

export interface GiftCardAmount {
    currencyCode: string,
    amount: number
}

export interface IncentiveResponse {
    cardInfo: CardInfo;
    creationRequestId: string;
    gcClaimCode: string;
    gcExpirationDate: string | null;
    gcId: string;
    status: string;
}

export interface CardInfo {
    cardNumber: string | null;
    cardStatus: string;
    expirationDate: string | null;
    value: CardValue;
}

export interface CardValue {
    amount: number;
    currencyCode: string;
}