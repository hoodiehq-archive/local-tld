var path = require("path");
var fs = require("fs");
var config_file = path.join(process.env[(process.platform === "win32") ? "USERPROFILE" : "HOME"],".local-tld.json");

fs.openSync(config_file, 'a');

function read(){
  return JSON.parse(fs.readFileSync(config_file));
}
function write(data){
  fs.writeFileSync(config_file,JSON.stringify(data,null,"\t"));
}

function add(domain,port) {
  var config = read();
  config[domain] = {
    port: port
  };
  write(config);
}

function remove(domain,port) {
  var config = read();
  delete config[domain];
  write(config);
}

module.exports = {
  file: config_file,
  read: read,
  write: write,
  add: add,
  remove: remove
};