import axios from 'axios';

export default class ApiService {

    API_URL = process.env.API_URL;

    async sendGiftCard(recipientId: string, giftcardCode: string): Promise<void> {
        await this.post({ recipient_id: recipientId, gift_card_code: giftcardCode }, '/');
    }

    private async post(data = {}, endpoint: string): Promise<void> {
        try {
            await axios.post(`${this.API_URL}/${endpoint}`, data);
        } catch (error) {
            console.error(error);
        }
    }

}