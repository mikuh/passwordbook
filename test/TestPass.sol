pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Pass.sol";

contract TestPass {
    Pass pass = Pass(DeployedAddresses.Pass());

    function testUpdatePrice() public{
        var a = pass.updatePrice(10**16);
        Assert.equal(10**16, a, "update price error");
    }

    function testGetPrice() public{
        var b = pass.price;
        Assert.equal(10**16, b, "get price error");
    }
}