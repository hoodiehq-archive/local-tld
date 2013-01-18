// An app’s API to ~/.local-tld.json
var fs = require("fs");

module.exports.tld_file = process.env.HOME + "/.local-tld.json";
module.exports.base_port = 6000;

module.exports.getPort = function getPort(name) {

  var map = read_json(module.exports.tld_file);
  var max_port = module.exports.base_port;

  for(var port_m in map) {
    port_m = parseInt(port_m, 10);

    if(port_m > max_port) {
      max_port = port_m;
    }

    var name_m = map[port_m].name;
    if(name_m == name) {
      return port_m;
    }
  }

  // if we got here, max_port is the highest registered port
  var new_port = max_port + 1;
  map[new_port] = {
    name: name
  };

  write_json(module.exports.tld_file, map);
  return new_port;
}

var read_json = function read_json(filename, default_value) {
  try {
    return JSON.parse(fs.readFileSync(filename));
  } catch(e) {
    return default_value || {};
  }
};

var write_json = function write_json(filename, value) {
  fs.writeFileSync(filename, JSON.stringify(value));
};
