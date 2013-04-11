var os = require("os");
var path = require("path");
var service = {};

switch (os.platform()) {
  case "win32":
    var win = require("node-windows");
    var svc = new win.Service({
      name: "Local-tld",
      description: "Routes local.dev domains",
      script: path.join(path.dirname(module.filename),"service.js")
    });
    service = {
      install: function(done){
        svc.on("install",function(){
          if (done) done();
        });
        svc.install();
      },
      remove: function(done){
        svc.on("uninstall",function(){
          if (done) done();
        });
        svc.uninstall();
      },
      start: function(done){
        svc.on("start",function(){
          if (done) done();
        });
        svc.start();
      },
      stop: function(done){
        svc.on("stop",function(){
          if (done) done();
        });
        svc.stop();
      }
    };
    break;
  case "darwin":
    throw new Error("Not implemented");
    break;
  case "linux":
    throw new Error("Not implemented");
}

module.exports = service;