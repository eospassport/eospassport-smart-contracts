"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eosic = __importStar(require("eosic"));
const eosjs_1 = __importDefault(require("eosjs"));
require("mocha");
describe("priceoraclize", () => {
    let kycAccount, kycContract;
    let provider;
    const [pub, wif] = [
        "EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
        "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3"
    ];
    const nullsbnb_id = "0xae1cb3a8b6b4c49c65d22655c1ec4d28a4b3819065dd6aaf990d18e7ede951f1";
    const eos = eosjs_1.default({
        httpEndpoint: "http://0.0.0.0:8888",
        keyProvider: wif
    });
    beforeEach(async () => {
        ({
            account: kycAccount,
            contract: kycContract
        } = await eosic.createContract(pub, eos, "kycstore"));
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
        const tx = await kycContract.addprofile(provider, {
            owner: "eosio",
            birthdate: 10,
            country: 10,
            mroot_sensitive_data: Buffer.from("64df45e4393331b4586988e0e4f5e41f13f8c5d8c658c8e7b57e50a52053dc67", "hex"),
            residential: {
                latitude: 10,
                longitude: 10
            }
        }, {
            authorization: [provider]
        });
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
