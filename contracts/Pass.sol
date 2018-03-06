pragma solidity ^0.4.17;

contract Pass {
    address private admin;
    uint private price;
    function Pass() public{
        admin = msg.sender;
        price = 10 ** 15;
    }

    struct PasswordBook{
        bytes32 [] platforms;        /// 平台
        bytes32 [] accounts;         /// 密码描述列表
        bytes32 [] passwords;        /// 密码列表
    }

    mapping (address => PasswordBook) private userbook;   /// 用户地址 映射密码本
    mapping (address => uint) private registerUsers;     /// 拥有密码本的用户地址

    event BookUpdated(address _sender, bool _success);
    /// 增加密码
    function addPassword(bytes32 platform, bytes32 account, bytes32 password) public payable {
        if (platform.length > 32 || account.length > 32 || password.length > 32 || platform.length == 0 || account.length == 0 || password.length == 0) return;
        require(msg.value >= price);
        admin.transfer(msg.value);
        registerUsers[msg.sender] += 1;
        userbook[msg.sender].platforms.push(platform);
        userbook[msg.sender].accounts.push(account);
        userbook[msg.sender].passwords.push(password);
        BookUpdated(msg.sender, true);
    }

    function getBookLength() public view returns (uint){
        return registerUsers[msg.sender];
    }

    function getBook(uint _index) public view returns (bytes32, bytes32, bytes32){
        require(_index>=0);
        require(_index < registerUsers[msg.sender]);
        return (userbook[msg.sender].platforms[_index], userbook[msg.sender].accounts[_index], userbook[msg.sender].passwords[_index]);
    }

    function updatePassword(uint _index, bytes32 platform, bytes32 account, bytes32 password) public payable {
        if(platform.length >32 || account.length >32 || password.length >32 || platform.length == 0 || account.length == 0 || password.length == 0) return;
        if(_index >= registerUsers[msg.sender]) return;
        require(msg.value >= price);
        admin.transfer(msg.value);
        userbook[msg.sender].platforms[_index] = platform;
        userbook[msg.sender].accounts[_index] = account;
        userbook[msg.sender].passwords[_index] = password;
        BookUpdated(msg.sender, true);
    }

    function updatePrice(uint p) public{
        require(msg.sender == admin);
        price = p;
    }

    function getPrice() public view returns (uint){
        return price;
    }
}
