# AWS Incentives API

A TypeScript service for using the [Amazon Gift Card API](https://developer.amazon.com/incentives-api) (aka. Amazon Incentives API) to generate Amazon gift cards. 

This library implements the [AWS Signature Version 4](https://docs.aws.amazon.com/general/latest/gr/sigv4_signing.html) signature algorithm.

> "Every request to an endpoint of the Incentives API must be digitally signed using your Incentives API security credentials and the Signature Version 4 signature algorithm. Signing correctly using Signature Version 4 can be the toughest hurdle when calling Incentives API endpoints."
> - https://developer.amazon.com/docs/incentives-api/incentives-api.html

# Usage

Using the service is simple. Instantiate the service with the following credentials, then call the `.generate()` method to generate a new giftcard code:
* PartnerID
* AWS Incentives API Access Key
* AWS Incentives API Secret Key
* AWS Incentives API Hostname
* AWS Incentives API URL

```typescript
const service = new AWSGiftcardService(
    "YourPartnerID",
    "YourAccessKey",
    "YourSecretKey",
    "agcod-v2-gamma.amazon.com",         // Sandbox Host
    "https://agcod-v2-gamma.amazon.com", // Sandbox URL
    "us-east-1",                         // AWS Region (optional, default us-east-1)
);
// Pass the amount in USD you want the giftcard to be, in this case $5
// the giftcard amount must be an integer. Currency code is optional, default is 'USD'
const giftcardCode = await service.generateGiftCardCode(5, 'USD');

```
