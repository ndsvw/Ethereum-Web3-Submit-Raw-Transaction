const Web3 = require("web3");
const EthTx = require("ethereumjs-tx");
let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

let getBalance = (acc) => {
  return new Promise((res, rej) => {
    let balance = web3.eth.getBalance(acc).then((data, error) => {
      if (!error) {
        let ethers = web3.utils.fromWei(data, "ether");
        res(ethers);
      } else {
        rej("Requesting balance failed.");
      }
    });
  }).catch((e) => {
    console.error(e)
  })
}

let main = async () => {
  let accounts = await web3.eth.getAccounts();
  let acc1 = accounts[0];
  let acc2 = accounts[1];
  let pKey1 = "49b41e6b1cac757e41e65116a743d50af17fe6402873818ecaa233e7a4a6ba57"; // enter the private key of the first account here!
  let pKey1x = new Buffer(pKey1, "hex");

  let rawTx = {
    nonce: web3.utils.toHex(await web3.eth.getTransactionCount(acc1)),
    from: acc1,
    to: acc2,
    gasPrice: web3.utils.toHex(2e11),
    gasLimit: web3.utils.toHex(21000),
    value: web3.utils.toHex(web3.utils.toWei("2", "ether")),
    data: ""
  }

  let tx = new EthTx(rawTx);
  tx.sign(pKey1x);
  tx = '0x' + tx.serialize().toString("hex");

  console.log("Before:\n");
  console.log("\tAccount 1: " + await getBalance(acc1));
  console.log("\tAccount 2: " + await getBalance(acc2));

  await web3.eth.sendSignedTransaction(tx);

  console.log("Before:\n");
  console.log("\tAccount 1: " + await getBalance(acc1));
  console.log("\tAccount 2: " + await getBalance(acc2));
}

main();