var FILENAME = process.env.HOME + "/.local-tld.json";

var fs = require("fs");
var watch = require("watchfd").watch;
var EventEmitter = require("events").EventEmitter;
var get_local_ips = require("./get_local_ips");

var config_file = new EventEmitter();
var config = {};

function read()
{
  try {
    config = migrate_config(JSON.parse(fs.readFileSync(FILENAME)));
  } catch(e) {
    console.error("Parsing of config file %s failed:", FILENAME);
    console.error(e);
    config = {};
  }
}

function migrate_config(config)
{
  // Old config files expected alias lists to be an object
  // with the aliases as keys. We changed this to just be
  // an array of aliases, and are automagically migrating
  // everyone's config files for them.
  var changed = false;
  for (var port_m in config) {
    var aliases = config[port_m].aliases;
    if (typeof aliases === "object" && !Array.isArray(aliases)) {
      config[port_m].aliases = Object.keys(aliases);
      changed = true;
    }
  }
  if (changed) {
    try {
      fs.writeFileSync(FILENAME, JSON.stringify(config, null, 2));
    } catch(e) {
      console.error("Failed updating config file %s:", FILENAME);
      console.error(e);
    }
  }
  return config;
}

config_file.routes = function() {
  var routes = {};
  var local_ips = get_local_ips();
  for(var port_m in config) {
    var domain = config[port_m].name;
    routes["localhost"] = "127.0.0.1:80";
    routes[domain + ".dev"] = "127.0.0.1:" + port_m;
    local_ips.forEach(function(local_ip) {
      routes[domain + "." + local_ip + ".xip.io"] = "127.0.0.1:" + port_m;
    });
    if(config[port_m].aliases) {
      var aliases = config[port_m].aliases;
      for(var alias in aliases) {
        routes[".*" + aliases[alias] + "." + domain + ".dev"] = "127.0.0.1:" + port_m;
        local_ips.forEach(function(local_ip) {
            routes[".*" + aliases[alias] + "." + domain + "." + local_ip + ".xip.io"] = "127.0.0.1:" + port_m;
        });
      }
    }
  }
  console.log(routes);
  return routes;
};

watch(FILENAME, function(current, previous) {
  if(current.length == 0) {
    return;
  }
  read();
  config_file.emit('changed');
});

read();
module.exports = config_file;
