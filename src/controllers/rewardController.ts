import ApiService from 'services/apiService';
import RewardService from '../services/rewardService';
require('dotenv').config()

export default class RewardController {

    rewardService: RewardService;
    apiService: ApiService;

    constructor() {
        this.rewardService = new RewardService();
        this.apiService = new ApiService();
    }

    async issueReward(recipientId: string): Promise<void> {
        // Hit the incentives API and generate an alphanumeric code.
        const giftcardCode = await this.rewardService.generateGiftCardCode();
        // Check that the giftcard was set, would be undefined if failed.
        if (!giftcardCode) { return; }
        // Send email to recipientEmail with the giftcardCode.
        await this.apiService.sendGiftCard(recipientId, giftcardCode);
    }
}
