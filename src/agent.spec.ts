import {
  Finding,
  FindingSeverity,
  FindingType,
  HandleTransaction,
  TransactionEvent,
} from "forta-agent";
import {
  createAddress,
  TestTransactionEvent,
  encodeParameters,
  MockEthersProvider,
} from "forta-agent-tools";
import { provideHandleTransaction } from "./agent";
import { BigNumber } from "ethers";
import { Interface } from "@ethersproject/abi";
import util from "./utils";
import { leftPad } from "web3-utils";

const testThreshold: BigNumber = BigNumber.from(100); // $100
const testBenqiEventIFace: Interface = new Interface([util.DELEGATE_CHANGED_EVENT]);
const testBenqiFunctionIFace: Interface = new Interface(util.BALANCE_OF_FUNCTION);
const testBenqiToken: string = createAddress("0xdef1");

const createFinding = ([
  delegator,
  fromDelegate,
  toDelegate,
  balance,
]: string[]) =>
  Finding.fromObject({
    name: "Delegations Monitor",
    description: "Detect user with a huge balance delegating their votes",
    alertId: "BENQI-2",
    severity: FindingSeverity.Info,
    type: FindingType.Info,
    protocol: "BENQI",
    metadata: {
      delegator,
      fromDelegate,
      toDelegate,
      balance,
    },
  });
describe("Large stake deposits", () => {
  let handleTransaction: HandleTransaction;

  const mockProvider = new MockEthersProvider();

  beforeAll(() => {
    handleTransaction = provideHandleTransaction(
      testThreshold,
      testBenqiToken,
      mockProvider as any
    );
  });

  
  beforeEach(() => mockProvider.clear());

  it("should return 0 findings in empty transactions", async () => {
    const txEvent: TransactionEvent = new TestTransactionEvent();

    const findings = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([]);
  });
  // it("should return no Findings due to incorrect event signature", async () => {

  // })
  it("should return findings", async () => {
    const testDelegator:string=createAddress("0xabc268");
    const testFromDelegate:string=createAddress("0xabc842");
    const testToDelegate:string=createAddress("0xdef954");

    const { data, topics } = testBenqiEventIFace.encodeEventLog(
      testBenqiEventIFace.getEvent("DelegateChanged"),
      [
        testDelegator,
        testFromDelegate,
        testToDelegate
      ]
    );
    console.log("topics",topics);
  mockProvider.addCallTo(testBenqiToken, 50, testBenqiFunctionIFace, "balanceOf", {
      inputs: [testDelegator],
      outputs: [100],
    });

    const txEvent: TransactionEvent = new TestTransactionEvent()
      .setBlock(50)
      .addAnonymousEventLog(testBenqiToken,data,  ...topics);
      const findings = await handleTransaction(txEvent);
console.log(findings)
      expect(findings).toStrictEqual([
        createFinding(
          [testDelegator,
          testFromDelegate,
          testToDelegate,
          "100"]
        )

      ]);
  })
  // it("should only return findings if value is equal to or greater than threshold", async () => {

  // })
});
