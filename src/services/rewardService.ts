import axios from 'axios';
import CryptoJS from 'crypto-js';
import { ResponseStatus } from '../common/enum';
import { IncentivePayload, IncentiveResponse } from '../common/types';
import { v4 as uuidv4 } from 'uuid';


export default class RewardService {

    dateStamp = '';
    REGION_NAME = 'us-east-1';
    SERVICE_NAME = 'AGCODService';

    incentivePayload: IncentivePayload = {
        creationRequestId: `${process.env.AMAZON_PARTNER_ID}-1`,
        partnerId: process.env.AMAZON_PARTNER_ID,
        value: {
            currencyCode: 'USD',
            amount: Number(process.env.INCENTIVE_AMOUNT),
        }
    }

    constructor() {
        this.dateStamp = new Date().toISOString().slice(0, 19) + 'Z';
        this.dateStamp = this.dateStamp.replace(/:/g, '');
        this.dateStamp = this.dateStamp.replace(/-/g, '');
        // Create a unique request ID, but request ID cannot be above 40 char
        const requestId: string = String(uuidv4()).substr(0, 13);
        this.incentivePayload.creationRequestId = `${process.env.AMAZON_PARTNER_ID}-${requestId}`
    }

    async generateGiftCardCode(): Promise<string> {
        // Step 1: Build a canonical request and hash using SHA256
        const canonicalHash = this.generateCanonicalRequest();
        // Step 2: 
        const stringToSign = this.buildStringToSign(canonicalHash);
        const authSignature = this.generateAuthorizationHeader(stringToSign);

        // Build Amazon headers
        const config = {
            headers: {
                "host": process.env.AWS_INCENTIVES_HOST,
                "x-amz-date": this.dateStamp,
                "x-amz-target": `com.amazonaws.agcod.${this.SERVICE_NAME}.CreateGiftCard`,
                "accept": "application/json",
                "content-type": "application/json",
                "regionName": this.REGION_NAME,
                "serviceName": this.SERVICE_NAME,
                "Authorization": authSignature,
            }
        };
        try {
            const response = await axios.post(`${process.env.AWS_INCENTIVES_URL}CreateGiftCard`, this.incentivePayload, config);
            const cardResult: IncentiveResponse = response.data;
            // Check if the status was successful
            if (cardResult.status !== ResponseStatus.Success) {
                console.error('Unable to create giftcard.');
                return;
            }
            // Return the alphanumeric gift card code.
            console.log(cardResult);
            console.log(`Gift card successfully created with code ${cardResult.gcClaimCode}`);
            return cardResult.gcClaimCode;
        } catch (error) {
            console.error(error);
        }
    }

    private generateAuthorizationHeader(stringToSign: string): string {
        const derivedKey = this.buildDerivedKey();
        const finalSignature = CryptoJS.HmacSHA256(stringToSign, derivedKey).toString(CryptoJS.enc.Hex)

        const abridgedDate = this.dateStamp.substring(0, 8);
        const credential = `Credential=${process.env.AWS_ACCESS_KEY}/${abridgedDate}/${this.REGION_NAME}/${this.SERVICE_NAME}/aws4_request`;
        const signedHeaders = 'SignedHeaders=accept;host;x-amz-date;x-amz-target';
        const response =
            "AWS4-HMAC-SHA256 " +
            credential + ", " +
            signedHeaders + ", " +
            "Signature=" + finalSignature;
        return response;
    }

    private generateCanonicalRequest(): string {
        // Turn payload to string, and trim all whitespace
        const payloadString = JSON.stringify(this.incentivePayload).trim();

        // SHA256 hash payload
        const hashedPayload = CryptoJS.SHA256(payloadString).toString(CryptoJS.enc.Hex);
        const request =
            "POST\n" +
            "/CreateGiftCard\n" +
            "\n" +
            "accept:application/json\n" +
            "host:agcod-v2-gamma.amazon.com\n" +
            "x-amz-date:" + this.dateStamp + "\n" +
            "x-amz-target:com.amazonaws.agcod." + this.SERVICE_NAME + ".CreateGiftCard\n" +
            "\n" +
            "accept;host;x-amz-date;x-amz-target\n" +
            hashedPayload;

        return CryptoJS.SHA256(request.trim()).toString(CryptoJS.enc.Hex);
    }

    private buildStringToSign(canonicalRequestHash): string {
        const abridgedDate = this.dateStamp.substring(0, 8);
        const stringToSign =
            "AWS4-HMAC-SHA256\n" +
            this.dateStamp + "\n" +
            abridgedDate + "/" + this.REGION_NAME + "/" + this.SERVICE_NAME + "/aws4_request\n" +
            canonicalRequestHash
        return stringToSign
    }

    private buildDerivedKey() {
        const signatureAWSKey = `AWS4${process.env.AWS_SECRET_SIGNING_KEY}`;
        const abridgedDate = this.dateStamp.substring(0, 8);
        const kDate = CryptoJS.HmacSHA256(abridgedDate, signatureAWSKey);
        const kRegion = CryptoJS.HmacSHA256(this.REGION_NAME, kDate);
        const kService = CryptoJS.HmacSHA256(this.SERVICE_NAME, kRegion);
        const kSigning = CryptoJS.HmacSHA256("aws4_request", kService);
        return kSigning;
    }
}