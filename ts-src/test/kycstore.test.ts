import * as eosic from "eosic";
import Eos, { IEosContract, Name, IEosjsCallsParams } from "eosjs";
import { assert } from "chai";
import "mocha";

interface IKYCStoreContract extends IEosContract {
  addprofile(
    provider: Name,
    payload: {
      owner: Name;
      mroot_sensitive_data: Buffer;
      birthdate: number;
      country: number;
      residential: {
        longitude: number;
        latitude: number;
      };
    },
    extra?: IEosjsCallsParams
  ): Promise<any>;
  addprovider(provider: Name, extra?: IEosjsCallsParams): Promise<any>;
}

describe("priceoraclize", () => {
  let kycAccount: Name, kycContract: IKYCStoreContract;
  let provider: Name;

  const [pub, wif] = [
    "EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
    "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3"
  ];

  const nullsbnb_id =
    "0xae1cb3a8b6b4c49c65d22655c1ec4d28a4b3819065dd6aaf990d18e7ede951f1";

  const eos = Eos({
    httpEndpoint: "http://0.0.0.0:8888",
    keyProvider: wif
  });

  beforeEach(async () => {
    ({
      account: kycAccount,
      contract: kycContract
    } = await eosic.createContract<IKYCStoreContract>(pub, eos, "kycstore"));

    await eosic.allowContract(eos, kycAccount, pub, kycAccount);

    const charMap = ["a", "b", "c", "d", "e", "f", "g", "h", "k", "l", "m"];
    const pid = Array(4)
      .fill(0)
      .map(() => charMap[Math.floor(Math.random() * charMap.length)])
      .join("");

    provider = `provider${pid}`;
    await eosic.createAccount(eos, pub, provider);

    await kycContract.addprovider(provider, {
      authorization: [kycAccount]
    });
  });

  it("provide profile", async () => {
    const tx = await kycContract.addprofile(
      provider,
      {
        owner: "eosio",
        birthdate: 10,
        country: 10,
        mroot_sensitive_data: Buffer.from(
          "64df45e4393331b4586988e0e4f5e41f13f8c5d8c658c8e7b57e50a52053dc67",
          "hex"
        ),
        residential: {
          latitude: 10,
          longitude: 10
        }
      },
      {
        authorization: [provider]
      }
    );

    console.log(tx);
    // const priceBinary = kycContract.fc.toBuffer("price", price);

    // await masterContract.addoracle(oracle, {
    //   authorization: masterAccount
    // });

    // await masterContract.push(
    //   oracle,
    //   oraclizeAccount,
    //   "0xae1cb3a8b6b4c49c65d22655c1ec4d28a4b3819065dd6aaf990d18e7ede951f1",
    //   "",
    //   priceBinary,
    //   {
    //     authorization: oracle
    //   }
    // );
  });
});
