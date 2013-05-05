#!/usr/bin/env node
var argv = require("optimist").usage("Usage: local-tld [help|start|stop|service|add|remove]").argv;
var fs = require("fs");
var os = require("os");
var path = require("path");
var spawn = require("child_process").spawn;
var service = require("../lib/servicemanager");
var config = require("../lib/config");
var EOL = os.EOL || "\n";
require("consoleplusplus");
console.disableTimestamp();

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
      default:
        console.log([
          "Usage local-tld service <command>:",
          "",
          "\tstart",
          "\tstop",
          "\trestart",
          "\tinstall",
          "\tremove"
        ].join(EOL));

        process.exit(1);
    }
    break;
  case "add":

    if (!argv._[1] || !argv._[2]) {
      console.log([
        "Please enter a port and domain",
        "",
        "local-tld add <port> <domain>"
      ].join(EOL));

      process.exit(1);
    }

    config.add(argv._[1],argv._[2]);
    break;
  case "remove":

    if (!argv._[1] || !argv._[2]) {

      console.log([
        "Please enter a port",
        "",
        "local-tld remove <port>"
      ].join(EOL));

      process.exit(1);
    }

    config.remove(argv._[1]);
    break;
  case "start":
    process.env["LOCAL_TLD_CONF"] = config.file;
    var out = fs.openSync(path.join(__dirname,"out.log"), "w");
    var err = fs.openSync(path.join(__dirname,"err.log"), "w");
    var child = spawn("node",[service.file],{
      stdio:["ignore",out,err],
      env: process.env,
      detached:true
    });
    fs.writeFileSync(path.join(__dirname,"child.pid"),child.pid);

    console.debug("Started server with pid " + child.pid);

    child.unref();
    break;
  case "stop":

    var pid = parseInt(fs.readFileSync(path.join(__dirname,"child.pid"),{encoding:"utf8"}), 10);
    if (pid === 0) {
      console.error("No server started.");
      console.error("You must start a server first:");
      console.log("\tlocal-tld start");
    }

    try {
      process.kill(pid);
    } catch(e) {
      fs.writeFileSync(path.join(__dirname,"child.pid"), 0);
      console.error("Could not kill child process (%s):", pid);
      throw e;
    }
    fs.writeFileSync(path.join(__dirname,"child.pid"), 0);

    console.debug("Stopped server with pid " + pid);

    break;
  default:

    console.log([
      "Usage: local-tld <command>",
      "",
      "\thelp\t\t\t- Show help (this)",
      "\tstart\t\t\t- Start the server",
      "\tstop\t\t\t- Stop the server",
      "\tservice\t\t\t- Manage the service (could be broken)",
      "\tadd <port> <domain>\t- Add a domain",
      "\tremove <port>\t\t- Remove a domain"
    ].join(EOL));
}