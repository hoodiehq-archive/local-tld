// An app’s API to ~/.local-tld.json
var fs = require("fs");

module.exports.tld_file = process.env.HOME + "/.local-tld.json";

module.exports.add = function add(name, port) {
  // get obj from file, or {} if file doesn’t exist
  var projects = read_json(module.exports.tld_file);
  // add/replace values
  projects[name] = {
    port: port
  };
  // write back
  write_json(module.exports.tld_file, projects);
}

module.exports.remove = function remove(name) {
  var projects = read_json(module.exports.tld_file);
  delete projects[name];
  write_json(module.exports.tld_file, projects);
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
