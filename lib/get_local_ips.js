var os = require("os");

function get_local_ips()
{
  var ifconfig = os.networkInterfaces();
  var local_ips = [];
  var if_name;

  for(if_name in ifconfig) {
    if(if_name.substr(0, 2) != "en") {
      continue; // for other unixes learn other interface names
    }
    var _if = ifconfig[if_name];
    _if.forEach(function(address_info) {
      if(address_info.internal) {
        return; // no loopback!
      }

      if(address_info.family == 'IPv6') {
        return; // no
      }

      local_ips.push(address_info.address);

    });
  }
  return local_ips;
}

module.exports = get_local_ips;
