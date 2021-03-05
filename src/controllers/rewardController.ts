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
        // Authenticates minion, returns true if successful
        const isAuthed: boolean = await this.apiService.authenticate();
        // If the minion cannot authenticate, don't continue to generate a giftcard code (these are non-refundable).
        if (!isAuthed) { console.error('Could not authenticate. Aborting.'); return; }
        // Hit the incentives API and generate an alphanumeric code.
        const giftcardCode = await this.rewardService.generateGiftCardCode();
        // Check that the giftcard was set, would be undefined if failed.
        if (!giftcardCode) { return; }
        // Send email to recipientEmail with the giftcardCode.
        await this.apiService.sendGiftCard(recipientId, giftcardCode);
    }
}
