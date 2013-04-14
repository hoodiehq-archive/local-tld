#!/usr/bin/env node
var argv = require("optimist").usage("Usage: local-tld service [install|start|restart|stop|remove]").demand(1).argv;
var fs = require("fs");
var os = require("os");
var path = require("path");
var service = require("./servicemanager");
var config = require("./config");
var spawn = require("child_process").spawn;

switch (argv._[0]) {
  case "service":
    switch (argv._[1]) {
      case "start":
        service.start(function(){
          console.log("Service Started");
        });
        break;
      case "stop":
        service.stop(function(){
          console.log("Service Stopped");
        });
        break;
      case "restart":
        service.start(function(){
          service.stop(function(){
            console.log("Service Restarted");
          });
        });
        break;
      case "install":
        service.install(function(){
          console.log("Service Installed");
        });
        break;
      case "remove":
        service.remove(function(){
          console.log("Service Removed");
        });
        break;
    }
    break;
  case "add":
    config.add(argv._[1],argv._[2]);
    break;
  case "remove":
    config.remove(argv._[1]);
    break;
  case "start":
    process.env["LOCAL_TLD_CONF"] = config.file;
    var out = fs.openSync(path.join(__dirname,"out.log"), "a");
    var err = fs.openSync(path.join(__dirname,"err.log"), "a");
    var child = spawn("node",[service.file],{
      stdio:["ignore",out,err],
      env: process.env,
      detached:true
    });
    fs.writeFileSync(path.join(__dirname,"child.pid"),child.pid);
    child.unref();
    break;
  case "stop":
    process.kill(fs.readFileSync(path.join(__dirname,"child.pid"),{encoding:"utf8"}));
    break;
}
module.exports = {
  service: service,
  config: config
};