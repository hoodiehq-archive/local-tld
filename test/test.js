var assert = require("assert");
var ltld = require("../lib/local-tld");
var fs = require("fs");

ltld.tld_file = "/tmp/tld-test.json";

var tests = {}
tests.test_add = function () {
  ltld.add("foo", 12345);
  var expect = {
    "foo": {
      "port": 12345
    }
  };
  var result = read_json(ltld.tld_file);
  assert.deepEqual(expect, result);
}

tests.test_remove = function() {
  ltld.remove("foo");
  var expect = {};
  var result = read_json(ltld.tld_file);
  assert.deepEqual(expect, result);
}

try {
  run_test("test_add");
  run_test("test_remove");
  console.log("All tests OK.")
} catch(e) {
  cleanup();
  throw e;
}

function cleanup() {
  try {
    fs.unlinkSync(ltld.tld_file);
  } catch (e) {
    // yup
  }
}

function run_test(name) {
  try {
    tests[name]();
    console.log("OK: %s.", name);
  } catch(e) {
    console.log("Fail: %j.", name, e);
    throw e;
  }
}

function read_json(filename) {
  return JSON.parse(fs.readFileSync(filename));
}
