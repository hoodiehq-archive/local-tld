#!/usr/bin/env node
var fs = require("fs");
var os = require("os");
var path = require("path");
var exec = require("child_process").exec;
var http_proxy = require("http-proxy");
var chokidar = require("chokidar");

var HTTP_PORT = 80;
// start httpd router
// restart httpd when config changes.

var config_file = path.join(process.env[(process.platform === "win32") ? "USERPROFILE" : "HOME"],".local-tld.json");
var hosts_file = os.platform() === "win32" ? "C:\\Windows\\System32\\Drivers\\etc\\hosts" : "/etc/hosts";


var config;
var httpd;
var watcher = chokidar.watch(config_file,{persistent:true});
watcher.on("all",function(type,path,stats){
  try {
    config = JSON.parse(fs.readFileSync(config_file));
  } catch (e) {
    console.log("Parsing of config file %s failed:", config_file);
    console.log(e);
    if (!config) config = {};
  }
  routes = parseConfig(config);
  console.log(routes);
  hosts("local-tld",function(){
    this.hosts = {};
    for (var host in routes) {
      this.add(host,"127.0.0.1");
    }
  },function(){
    console.log("hosts file updated");
  });
  console.log("Reloading proxy");
  if (httpd) httpd.close();
  httpd = http_proxy.createServer({
    router: routes
  });
  httpd.on("listening", function() {
    console.log("httpd running");
  });
  httpd.listen(HTTP_PORT);
  console.log("done");
});

function parseConfig(config) {
  var routes = {};
  for (var domain in config) {
    var options = config[domain];
    routes[domain + ".dev"] = "127.0.0.1:" + options.port;
  }
  return routes;
}

function hosts(name, onRead, onWrite) {
  var BEGIN, END, entry, env, exit;

  entry = -1;
  exit = -1;
  BEGIN = "### BEGIN " + name + " ###";
  END = "### END " + name + " ###";
  env = {
    hosts: {},
    add: function(name, ip) {
      this.hosts[name] = ip;
    },
    remove: function(name) {
      delete this.hosts[name];
    }
  };
  fs.readFile(hosts_file, { encoding: "ascii" }, function(err, data) {
    var current, host, i, ip, line, newhosts, str, name;
    if (err) throw err;
    data = data.split(os.EOL);
    for (i = 0; i < data.length; i++) {
      line = data[i];
      if (line.indexOf(BEGIN) > -1) {
        entry = i;
      }
      if (line.indexOf(END) > -1) {
        exit = i;
      }
    }
    if (entry === -1) {
      entry = data.length;
      data.push(BEGIN);
    }
    if (exit === -1) {
      data.splice(entry + 1, 0, END);
      exit = entry + 1;
    }
    current = data.slice(entry + 1, exit);
    for (i = 0; i < current.length; i++) {
      host = current[i];
      str = host.split(" ");
      ip = str[0];
      name = str[str.length - 1];
      env.hosts[name] = ip;
    }
    if (onRead) {
      onRead.call(env);
    }
    newhosts = [];
    for (name in env.hosts) {
      ip = env.hosts[name];
      newhosts.push("" + ip + " " + name);
    }
    data.splice.apply(data, [entry + 1, exit - entry - 1].concat(newhosts));
    fs.writeFile(hosts_file, data.join(os.EOL), { encoding: "ascii" }, function(err) {
      if (err) throw err;
      if (os.platform() === "win32") {
        exec("ipconfig /flushdns", function(err) {
          if (err) throw err;
          if (onWrite) {
            onWrite();
          }
        });
      } else {
        if (onWrite) {
          onWrite();
        }
      }
    });
  });
};
