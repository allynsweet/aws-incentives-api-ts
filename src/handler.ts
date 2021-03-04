import { Handler, SQSEvent } from 'aws-lambda';
import RewardService from './services/rewardService';

const service = new RewardService();

export const issueReward: Handler = async (event: SQSEvent) => {
  // Ensure the event originated from SQS at runtime. 
  if (!instanceOfSQSEvent(event)) { console.error('Function must be triggered by an SQSEvent.'); return; }

  // SQSEvent is now safe to use. 
  const message = event.Records[0].messageAttributes;
  
  // Ensure recipient is passed to function.
  if (!message.recipient) { console.error('Required message attribute "recipient" not found.'); return; }
  const recipient = message.recipient.stringValue;
  await service.issueReward(recipient);
  return {};
};


// Type guard to check if the event is an SQSEvent type at runtime.
function instanceOfSQSEvent(event: any): event is SQSEvent {
  return 'Records' in event;
}