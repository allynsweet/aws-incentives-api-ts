import axios from 'axios';

export async function sendError(errorMessage: string): Promise<void> {
    console.error(errorMessage);
    const SLACK_WEBHOOK =
        "https://hooks.slack.com/services/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";
    await axios.post(SLACK_WEBHOOK, {
        username: `GridLite/referrals`,
        text: `:alert: ${errorMessage}`,
    });
    throw new Error(errorMessage);
}
