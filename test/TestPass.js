var Pass = artifacts.require("./Pass.sol");

contract('Pass', function() {

    it("set info and get info, add need to pay 0.001 ether", function () {
        return Pass.deployed().then(function (instance) {
            return instance.addPassword('_platformasdadadasdasdasdasdasdasdasdasd', '_accounasdasdadssssssssssssssssssssssssssssssst', 'U2FsdGVkX1/qDxArQp/y5cwVz7pQuBWeoSNb7rBuxAe5Dbnt4DOg0GmHh6/FFC64IZR6bKhAQfQODY92Vv4EaA==', {value: web3.toWei('0.001', 'ether')});
        }).then(function () {
            return Pass.deployed().then(function (instance) {
                return instance.getBook(0)
            }).then(function (result) {
                assert.equal(result[0], '_platformasdadadasdasdasdasdasdasdasdasd', "platform error");
                assert.equal(result[1], '_accounasdasdadssssssssssssssssssssssssssssssst', "account error");
                assert.equal(result[2], 'U2FsdGVkX1/qDxArQp/y5cwVz7pQuBWeoSNb7rBuxAe5Dbnt4DOg0GmHh6/FFC64IZR6bKhAQfQODY92Vv4EaA==', "password error");
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

