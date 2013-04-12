#!/usr/bin/env node
var argv = require("optimist").usage("Usage: local-tld service [install|start|restart|stop|remove]").demand(1).argv;
var fs = require("fs");
var os = require("os");
var service = require("./servicemanager");
var config = require("./config");

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
}
module.exports = {
  service: service,
  config: config
};