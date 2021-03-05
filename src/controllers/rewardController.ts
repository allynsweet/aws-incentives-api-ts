import RewardService from '../services/rewardService';
require('dotenv').config()

export default class RewardController extends RewardService {

    async issueReward(recipientEmail: string): Promise<void> {
        // Hit the incentives API and generate an alphanumeric code.
        const giftcardCode = await this.generateGiftCardCode();
        // Check that the giftcard was set, would be undefined if failed.
        if (!giftcardCode) { return; }
        // Send email to recipientEmail with the giftcardCode.
        console.log(giftcardCode);
    }
}
