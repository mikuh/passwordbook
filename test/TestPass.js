var Pass = artifacts.require("./Pass.sol");

contract('Pass', function() {

    it("set info and get info, add need to pay 0.001 ether", function () {
        return Pass.deployed().then(function (instance) {
            return instance.addPassword('_platform', '_account', '_password', {value: web3.toWei('0.001', 'ether')});
        }).then(function () {
            return Pass.deployed().then(function (instance) {
                return instance.getBook(0)
            }).then(function (result) {
                assert.equal(web3.toUtf8(result[0]), '_platform', "platform error");
                assert.equal(web3.toUtf8(result[1]), '_account', "account error");
                assert.equal(web3.toUtf8(result[2]), '_password', "password error");
            });
        });
     });

    it("set price and then get the price", function () {
        var _price = 10000000000000000;
        return  Pass.deployed().then(function (instance) {
            return instance.updatePrice(_price)
        }).then(function () {
            return  Pass.deployed().then(function (instance) {
                return instance.getPrice()
            }).then(function (result) {
                assert.equal(result, _price, "set price error");
            })
        })
    })
});

