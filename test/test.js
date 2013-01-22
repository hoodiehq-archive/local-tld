var assert = require("assert");
var ltld = require("../lib/local-tld");
var fs = require("fs");

ltld.tld_file = "/tmp/tld-test.json";
ltld.base_port = 6000;

var tests = {}

tests.test_getPort = function() {
  ltld.getPort("foo");
  var expect = {
    "6001": {
      "name": "foo"
    }
  };
  var result = read_json(ltld.tld_file);
  assert.deepEqual(result, expect);
}

tests.test_getPortAgain = function() {
  ltld.getPort("foo");
  ltld.getPort("bar");
  var expect = {
    "6001": {
      "name": "foo"
    },
    "6002": {
      "name": "bar"
    }
  };
  var result = read_json(ltld.tld_file);
  assert.deepEqual(result, expect);
}

tests.test_setAlias = function() {
  var result = ltld.setAlias("foo", "foo1");
  assert.equal(result, true, "should return true");

  var result = ltld.setAlias("foo", "foo1");
  var result = ltld.setAlias("wibble", "foo1");
  assert.equal(result, false, "should return false");

  var expect = {
    "6001": {
      "name": "foo",
      "aliases": {
        "foo1": true
      }
    },
    "6002": {
      "name": "bar"
    }
  };
  var result = read_json(ltld.tld_file);
  assert.deepEqual(result, expect);
}

try {
  run_test("test_getPort");
  run_test("test_getPortAgain");
  run_test("test_setAlias");
  console.log("All tests OK.")
} catch(e) {
  throw e;
} finally {
  cleanup();
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
