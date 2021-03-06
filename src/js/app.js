App = {
  web3Provider: null,
  contracts: {},

  init: function() {

    return App.initWeb3();
  },

  initWeb3: function() {

    // Is there an injected web3 instance?
      if (typeof web3 !== 'undefined') {
          App.web3Provider = web3.currentProvider;
          $('.metamask').hide();
      } else {
          // If no injected web3 instance is detected
          $('.metamask').show();
          return
      }
      web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {

      $.getJSON('Pass.json', function (data) {
          // Get the necessary contract artifact file and instantiate it with truffle-contract
          var PassArtifact = data;
          App.contracts.Pass = TruffleContract(PassArtifact);
          // Set the provider for our contract
          App.contracts.Pass.setProvider(App.web3Provider);

          // Use our contract to retrieve and mark the adopted pets
          // return App.markAdopted();
      });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-add', App.addpassword);
    $(document).on('click', '.btn-list', App.getPasswords);
    $(document).on('click', '#auto-pass', App.autopass);
  },


  addpassword: function () {
      var _platform = $('#platform').val().trim();
      var _account =  $('#account').val().trim();
      var _password = $('#password').val().trim();
      var _key = $('#key').val().trim();
      if (alphanumeric(_platform )|| alphanumeric(_account) || alphanumeric(_password) || alphanumeric(_key)){
          return alert('Cannot be special characters.')
      }
      App.contracts.Pass.deployed().then(function (instance) {
          passInstance = instance;
          console.log(encrypt(_platform, _key), encrypt(_account, _key), encrypt(_password, _key))
          return passInstance.addPassword(encrypt(_platform, _key), encrypt(_account, _key), encrypt(_password, _key), {value: web3.toWei('0.001', 'ether')});  // value:web3.toWei('0.001', 'ether')
      }).catch(function (err) {
          console.log(err.message);
      });
  },
  getPasswords: function () {
          App.contracts.Pass.deployed().then(function (instance) {
              passInstance = instance;
              return passInstance.getBookLength();
          }).then(function (result) {
              var booklength = parseInt(result.toString())
            for(var i=0; i<booklength; i++){
                getpassword(i)
            }
          }).catch(function (err) {
              console.log(err.message)
          })
  },
    autopass: function () {
        var auto_pass = ''
        var nums = ['1', '2', '4', '5', '6', '7', '8', '9', '10'];
        var lower = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        var upper = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        var items = [nums, lower, upper, nums, lower, upper, nums, lower, upper, nums, lower, upper];
        items.shuffle();
        items.forEach(function(e){
            auto_pass += e[Math.floor(Math.random()*e.length)]
        });
        $('#password').val(auto_pass)
    }

};


$(function() {
  $(window).load(function() {
    App.init();
  });
});

Array.prototype.shuffle = function() {
    var input = this;

    for (var i = input.length-1; i >=0; i--) {

        var randomIndex = Math.floor(Math.random()*(i+1));
        var itemAtIndex = input[randomIndex];

        input[randomIndex] = input[i];
        input[i] = itemAtIndex;
    }
    return input;
}


function getpassword(_index) {
    var _key=$('#key').val();
    if(_key == ""){
        return alert("please input Encrypted Key!")
    }
    $('.table').empty();
    $('.table').append('<tr><td>index</td><td>platform</td><td>account</td><td>password</td></tr>');
    App.contracts.Pass.deployed().then(function (instance) {
        passInstance = instance;
        return passInstance.getBook(_index);
    }).then(function (result) {
        // console.log(web3.toAscii(result[0]).substring(1), web3.toAscii(result[1]).substring(1), web3.toAscii(result[2]).substring(1))
        showMyPasswords(_index, decrypt(result[0], _key), decrypt(result[1], _key), decrypt(result[2], _key))
        $('.mypasswords').show()
    }).catch(function (err) {
        console.log(err.message);
    });
}


function showMyPasswords(_index, a, b, c) {
    $('.table').append('<tr><td>' + _index + '</td><td>' + a + '</td><td>' + b + '</td><td>' + c + '</td></tr>')
}


function alphanumeric(string){
    if(string.length < 1){
        return true;
    }
    for(var i=0;i<string.length;i++){
        var code = string.charCodeAt(i);
        if(code < 33 || code > 125){
            return true;
        }
    }
    return false;
}


function encrypt(message, _key){
    var key = CryptoJS.SHA3(_key).toString().substring(0,32);
    var encrypted = CryptoJS.AES.encrypt(message, key).toString();
    return encrypted
}

function decrypt(encrypted, _key){
    var key = CryptoJS.SHA3(_key).toString().substring(0,32);
    var decrypted = CryptoJS.AES.decrypt(encrypted, key);
    return CryptoJS.enc.Utf8.stringify(decrypted)
}