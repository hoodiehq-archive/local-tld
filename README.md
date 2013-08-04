# Local TLD

Local TLD maintains a local development top level domain that you can hook various projects into.

If you know `pow`, this is `pow` without the Rack part.

Mac OS X only, for the time being. Cross platform support desired, if you can contribute it! :)


## Er what?

Here’s an example. What if you maintained two web projects A and B and have a local setup of both, and you’d like to work on the both at the same time, or switch easily, and you don’t want to mess with things like `http://localhost:8888` because that is just annoying and ugly.

What if you could have these two nice addresses:

    http://myfancyprojectA.dev
    http://thatotherprojectB.dev

Yes, you can do that by messing with `/etc/hosts`, but it ain’t pretty, and you have to do it for every new project and it is ugly.


## Setup

    $ npm -g install local-tld
      # or for now git clone $thisrepo
    $ $EDITOR ~/.local-tld.json
    {
      "8000": {
        "name": "myfancyprojectA"
      },
      "8001": {
        "name": "thatotherprojectB"
      }
    }

Dat it. `/.local-tld.json` maps the a subdomain to a TCP port. So if you have a httpd running on `localhost:8000` you can now reach it by going to `http://myfancyprojectA.dev`.


## I want my app to register itself with local-tld!

See https://github.com/hoodiehq/local-tld-lib


## Ok cool, how does it work?

This uses a cool dynamic DNS system that is built into Mac OS X. Local TLD runs a minimal DNS lookup server that does the address translation magic.

## I want subdomains!
Easy. Just make your configuration look like this:

```json
{
  "8000": {
    "name": "myfancyprojectA",
    "aliases": ["subdomain1", "subdomain2"]
  }
}
```

Now, you should be able to reach `localhost:8000` from `http://myfancyprojectA.dev`, `http://subdomain1.myfancyprojectA.dev`, and `http://subdomain2.myfancyprojectA.dev`!

## No Original Work

This is all ripped out of `pow`, we don’t claim any credit.


## License

Apache 2 License


## Copyright

(c) 2013 Jan Lehnardt <jan@apache.org>
