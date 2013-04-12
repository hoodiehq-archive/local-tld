var path = require("path");
var fs = require("fs");
var config_file = path.join(process.env[(process.platform === "win32") ? "USERPROFILE" : "HOME"],".local-tld.json");

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

function add(port,domain) {
  var config = read();
  config[port] = {
    name: domain
  };
  write(config);
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
  remove: remove
};