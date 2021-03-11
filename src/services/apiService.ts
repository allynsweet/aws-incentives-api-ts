import axios, { AxiosResponse } from 'axios';
import { sendError } from '../common/helper';
import { MinionLogin } from '../common/types';

export default class ApiService {

    private API_URL = process.env.API_URL;
    private authorizationHeader = '';

    /**
     * Login to GridLite using the minion scraper account.
     * If successful, returns the Authorization header value to be used. 
     */
    async authenticate(): Promise<boolean> {
        const payload: MinionLogin = {
            email: process.env.GRIDLITE_USERNAME,
            password: process.env.GRIDLITE_PASSWORD,
        };
        const response = await this.post(payload, 'users/authenticate');
        // Check response was successful and access_token exists.=
        if (!response || !response.data.access_token) { return; }

        const access_token = response.data.access_token;
        this.authorizationHeader = `Bearer ${access_token}`;
        return true;
    }

    /**
     * Send the gift card code and the recipient's ID to the API to send the email.
     * @param recipientId 
     * @param giftcardCode 
     */
    async sendGiftCard(recipientId: string, giftcardCode: string): Promise<void> {
        await this.post(
            { amazon_gift_card_claim_code: giftcardCode },
            `users/${recipientId}/disperse_referral_reward`,
            { Authorization: this.authorizationHeader }
        );
    }

    private async post(data = {}, endpoint: string, headers = {}): Promise<AxiosResponse> {
        try {
            const response = await axios.post(`${this.API_URL}/${endpoint}`, data, { headers });
            return response;
        } catch (error) {
            sendError(error);
            console.error(error);
        }
    }

}