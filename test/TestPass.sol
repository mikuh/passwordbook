pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Pass.sol";

contract TestPass {
    function testAddPassword() public {
        Pass pass = Pass(DeployedAddresses.Pass());
        pass.addPassword('baidu.com', 'aaa', '123456');
        var (a, b, c) = pass.getBook(0);
        Assert.equal('baidu.com', a, "platform error");
        Assert.equal('aaa', b, "account error");
        Assert.equal('123456', c, "password error");
    }
}