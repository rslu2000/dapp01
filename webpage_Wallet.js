//以下教學範例，若有疑問請參閱web3.js的官方文檔，https://web3js.readthedocs.io/

const INFURA_API_KEY = '45a27bf77c7d4f70a744a35738ec07b7';
web3 = new Web3(`https://mainnet.infura.io/v3/${INFURA_API_KEY}`);
web3_goerli = new Web3(`https://goerli.infura.io/v3/${INFURA_API_KEY}`);
mygasprice = web3.utils.toWei('5', 'Gwei'); //把12 Gwei轉換成 wei
// 查詢測試鏈Ｇoerli 的即時gas price可以連上網站 https://stats.goerli.net/ 查詢
console.log('gasprice:',mygasprice);

function queryBlocks(){
    web3.eth.getBlockNumber((err, results) => {
        let blocks_number = results;
        document.getElementById('latestBlocks_mainnet').value = blocks_number;
        console.log(blocks_number);
    } );
    // web3_ropsten.eth.getBlockNumber((err, results) => {
    //     let blocks_number2 = results;
    //     document.getElementById('latestBlocks_testnet').value = blocks_number2;
    //     console.log(blocks_number2);
    // } );
    web3_goerli.eth.getBlockNumber((err, results) => {
        let blocks_number3 = results;
        document.getElementById('latestBlocks_goerli').value = blocks_number3;
        console.log(blocks_number3);
    } );
}

function queryBalance(event) {
    address = document.getElementById('walletaddress').value
  web3.eth.getBalance(address, (err, balance) => {
    let number1 = Math.round(web3.utils.fromWei(balance, 'ether') * 100) / 100;
    console.log(number1);
    document.getElementById('walletbalance').value = number1;
  });
//   web3_ropsten.eth.getBalance(address, (err, balance) => {
//     let number2 = Math.round(web3_ropsten.utils.fromWei(balance, 'ether') * 100) / 100;
//     console.log(number2);
//     document.getElementById('walletbalance2').value = number2;
//   });
  web3_goerli.eth.getBalance(address, (err, balance) => {
    let number3 = Math.round(web3_goerli.utils.fromWei(balance, 'ether') * 100) / 100;
    console.log(number3);
    document.getElementById('walletbalance3').value = number3;
  });
  web3_goerli.eth.getTransactionCount(address,
    (err, resolved) => {
    req_times=resolved;
    console.log("Nonce值-這是發送者地址所發起的總交易筆數共：" + (req_times) + "筆");
    document.getElementById('nonce1').value = req_times;
    })
}

function sendETH(){
    receiverAddress = document.getElementById('receiverAddress').value;
    sendAmount = web3.utils.toWei(document.getElementById('sendAmount').value, 'ether');
    senderPrivateKey = document.getElementById('senderPrivateKey').value;
    obj1=web3.eth.accounts.privateKeyToAccount(senderPrivateKey);
    senderAddress = Object.values(obj1);
    hexdata = document.getElementById('send_data').value;
    console.log('收款地址:' + receiverAddress);
    console.log('發送方地址:' + senderAddress[0]);
    console.log('轉帳數量:' + sendAmount + 'wei');
    web3_goerli.eth.accounts.signTransaction({
        to: receiverAddress,
        value: sendAmount,
        chainId: 5,
        nonce: web3_goerli.eth.getTransactionCount(senderAddress[0]),
        gasPrice: mygasprice,
        data:hexdata,
        gas: 70000},
        senderPrivateKey,
        (err, resolved) => {
         temp = Object.values(resolved);
        //  console.log(temp);
         signedRawData=temp[4];
         console.log('signedRawData:' + signedRawData);
         web3_goerli.eth.sendSignedTransaction(signedRawData,
            (e,success)=>{
                console.log(success);
                document.getElementById('tx_hash').value = success;
                console.log('交易成功,交易哈希值為:' + success);
                console.log('交易打包出塊紀錄請上以下網站查詢：');
                document.getElementById('tx_hash_on_goerli').value = 'https://goerli.etherscan.io/tx/' + success;
                console.log('https://goerli.etherscan.io/tx/' + success);
            });
        }
    );

            web3_goerli.eth.getTransactionCount(senderAddress[0],
            (err, resolved) => {
            req_times=resolved;
            console.log("這是發送者地址所發起的第：" + (req_times+1) + "筆的交易");
            }
        );
}

//自行創建錢包地址的作法，其他做法請參閱https://web3js.readthedocs.io/en/v1.4.0/web3-eth-accounts.html#wallet-create
//若是要用助記詞來當作亂數產生錢包地址，請使用ether.js的庫中的方法來創建。
function creatAccount(){
    result = web3_goerli.eth.accounts.create();
    document.getElementById('newPrivateKey').value = result['privateKey'];
    document.getElementById('newPublicKey').value = result['address'];
    console.log(result);
}



