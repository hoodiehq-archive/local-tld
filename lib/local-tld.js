#!/usr/bin/env node
var argv = require("optimist").usage("Usage: local-tld [help|start|stop|service|add|remove]").demand(1).argv;
var fs = require("fs");
var os = require("os");
var path = require("path");
var service = require("./servicemanager");
var config = require("./config");
var spawn = require("child_process").spawn;
require("consoleplusplus");
console.disableTimestamp();

switch (argv._[0]) {
  case "service":
	
	if(!argv._[1]) {
		console.log("Usage local-tld service <command>:");
		console.log("");
		console.log("\tstart");
		console.log("\tstop");
		console.log("\trestart");
		console.log("\tinstall");
		console.log("\tremove");
	}
	
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
		
	if(!argv._[1] || !argv._[2]) {
		console.log("Please enter a port and domain");
		console.log("");
		console.log("local-tld add <port> <domain>");
	}
		
    config.add(argv._[1],argv._[2]);
    break;
  case "remove":
	
	if(!argv._[1] || !argv._[2]) {
		console.error("Please enter a port");
		console.log("");
		console.log("\tlocal-tld remove <port>");
	}
		
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
	child.on("error", function() {
		console.log(e);
	})
	console.debug("Started server with pid " + child.pid);
		
    child.unref();
    break;
  case "stop":
	
	var pid = parseInt(fs.readFileSync(path.join(__dirname,"child.pid"),{encoding:"utf8"}), 10);
	if(pid == 0) {
		console.error("No server started.");
		console.error("You must start a server first:");
		console.log("\tlocal-tld start");
	}
	
    try {
		process.kill(pid);
	} catch(e) {
		fs.writeFileSync(path.join(__dirname,"child.pid"), 0);
		console.error("An error appeared killing the child (%s):", pid)
		throw e;
	}
	fs.writeFileSync(path.join(__dirname,"child.pid"), 0);
	
	console.debug("Stopped server with pid " + pid);
		
    break;
		
	case "help":
	default:
		
	console.log("Usage: local-tld <command>");
	console.log("");
	console.log("\thelp\t\t\t- Show help (this)");
	console.log("\tstart\t\t\t- Start the server");
	console.log("\tstop\t\t\t- Stop the server");
	console.log("\tservice\t\t\t- Manage the service (could be broken)");
	console.log("\tadd <port> <domain>\t- Add a domain");
	console.log("\tremove <port>\t\t- Remove a domain");
}

module.exports = {
  service: service,
  config: config
};