# Local TLD

Local TLD maintains a local development top level domain that you can hook various projects into.

If you know `pow`, this `pow` without the Rack part.

Mac OS X only, for the time being. Cross platform support desired, if you can contribute it! :)


## Er what?

Here’s an example. What if you maintained two web projects A and B and have a local setup of both, and you’d like to work on the both at the same time, or switch easily, and you don’t want to mess with things like `http://localhost:8888` because that is just annoying and ugly.

What if you could have these two nice addresses:

    http://myfancyprojectA.dev
    http://thatotherprojectB.dev

Yes, you can do that by messing with `/etc/hosts`, but it ain’t pretty, and you have to do it for every new project and it is ugly.


## Setup

    $ brew install local-tld
      # or for now git clone $thisrepo
    $ sudo local-tld setup
      # once time sudo required
    $ $EDITOR ~/.localtld.json
    {
      "myfancyprojectA": {
        "port": 8000
      },
      "thatotherprojectB": {
        "port": 8001
      }
    }

Dat it. `/.localtld.json` maps the a subdomain to a TCP port. So if you have a httpd running on `localhost:8000` you can now reach it by going to `http://myfancyprojectA.dev`.


## I want my app to register itself with local-tld!

  var ltld = require("local-tld");
  ltld.add("yourfancyproject", 12345);

  // ok cool, how can I deregister?
  ltld.remove("yourfancyproject");


## Ok cool, how does it work?

This uses a cool dynamic DNS system that is built into Mac OS X. Local TLD runs a minimal DNS lookup server that does the address translation magic.


## No Original Work

This is all ripped out of `pow`, we don’t claim any credit.


## License

Apache 2 License


## Copyright

(c) 2013 Jan Lehnardt <jan@apache.org>
