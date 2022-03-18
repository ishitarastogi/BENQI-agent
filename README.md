# High Gas Agent

## Description

This agent detects transactions with high gas consumption

## Supported Chains

- Ethereum
- List any other chains this agent can support e.g. BSC

## Alerts

Describe each of the type of alerts fired by this agent

- FORTA-1
  - Fired when a transaction consumes more gas than 1,000,000 gas
  - Severity is always set to "medium" (mention any conditions where it could be something else)
  - Type is always set to "suspicious" (mention any conditions where it could be something else)
  - Mention any other type of metadata fields included with this alert

## Test Data

The agent behaviour can be verified with the following transactions:

- 0x1b71dcc24657989f920d627c7768f545d70fcb861c9a05824f7f5d056968aeee (1,094,700 gas)
- 0x8df0579bf65e859f87c45b485b8f1879c56bc818043c3a0d6870c410b5013266 (2,348,226 gas)
  it("should only return findings if value is equal to or greater than threshold", async () => {
    const TEST_DATA :string[][] =[
      [
        createAddress("0xabc268"),
        createAddress("0xabc842"),
        createAddress("0xdef954"),
        
      ]
    ];
    const txEvent: TestTransactionEvent = new TestTransactionEvent().setBlock(
      55
    );

    for (let [delegator,fromDelegate,toDelegate] of TEST_DATA) {
      const { data, topics } = testBenqiEventIFace.encodeEventLog(
        testBenqiEventIFace.getEvent("DelegateChanged"),
        [delegator, fromDelegate, toDelegate]
      );
              
      // mockProvider.addCallTo(
      //   testBenqiToken,
      //   50,
      //   testBenqiFunctionIFace,
      //   "balanceOf",
      //   {
      //     inputs: [delegator],
      //     outputs: [BigNumber.from(100).toString()],
      //   }
      // );
  
      txEvent.addAnonymousEventLog(testBenqiToken, data, ...topics);
//txEvent.setData(Transaction)
    }
    const findings = await handleTransaction(txEvent);
console.log(findings)
  });