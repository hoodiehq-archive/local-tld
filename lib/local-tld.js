#!/usr/bin/env node
var argv = require("optimist").usage("Usage: local-tld service [install|start|restart|stop|remove]").demand(1).argv;
var fs = require("fs");
var os = require("os");
var service = require("./servicemanager");

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
    break;
  case "remove":
    break;
}
