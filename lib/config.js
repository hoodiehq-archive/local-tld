var path = require("path");
var fs = require("fs");
var config_file = path.join(process.env[(process.platform === "win32") ? "USERPROFILE" : "HOME"],".local-tld.json");
var base_port = 6000;
fs.openSync(config_file, 'a');

function read(){
  try {
    return JSON.parse(fs.readFileSync(config_file));
  } catch (e) {
    return {};
  }
}
function write(data){
  fs.writeFileSync(config_file,JSON.stringify(data,null,"\t"));
}

function add(port,domain,aliases) {
  var config = read();
  config[port] = {
    name: domain
  };
  if (aliases && aliases.length) {
    for (var i=0; i < aliases.length; i++) {
      config[port].aliases[aliases[i]] = true;
    }
  }
  write(config);
}
function setAlias(name, alias) {
  var config = read();
  for (var port in config) {
    if (config[port].name === name) {
      if (!config[port].aliases) config[port].aliases = {};
      config[port].aliases[alias] = true;
      write(config);
      return true;
    }
  }
  return false;
}
function removeAlias(name, alias) {
  var config = read();
  for (var port in config) {
    if (config[port].name === name && config[port].aliases && config[port].aliases[alias]){
      delete config[port].aliases[alias];
      return true;
    }
  }
  return false;
}

function getPort(name) {
  var config = read();
  var max = base_port;
  for (var port in config) {
    if (config[port].name === name) return port;
    portInt = parseInt(port, 10);
    if (portInt > max) max = portInt;
  }
  config[++max] = {
    name: name
  };
  write(config);
  return max;
}

function remove(port) {
  var config = read();
  delete config[port];
  write(config);
}

module.exports = {
  file: config_file,
  read: read,
  write: write,
  add: add,
  remove: remove,
  getPort: getPort,
  setAlias: setAlias,
  removeAlias: removeAlias
};