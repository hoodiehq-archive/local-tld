# Local TLD

Local TLD maintains a local development top level domain that you can hook various projects into.

If you know `pow`, this `pow` without the Rack part.

Mac OS X and Windows only, for the time being. Cross platform support desired, if you can contribute it! :)


## Er what?

Here’s an example. What if you maintained two web projects A and B and have a local setup of both, and you’d like to work on the both at the same time, or switch easily, and you don’t want to mess with things like `http://localhost:8888` because that is just annoying and ugly.

What if you could have these two nice addresses:

    http://myfancyprojectA.dev
    http://thatotherprojectB.dev

Yes, you can do that by messing with `/etc/hosts`, but it ain’t pretty, and you have to do it for every new project and it is ugly.


## Setup

    $ npm install -g git://github.com/Acconut/local-tld.git#crossplatform
    
    $ local-tld add 8000 myfanceprojectA
    $ local-tld add 8001 myfanceprojectB
    
	$ local-tld start

So if you have a httpd running on `localhost:8000` you can now reach it by going to `http://myfancyprojectA.dev`.

## No Original Work

This is all ripped out of `pow`, we don’t claim any credit or done by contributors.


## License

Apache 2 License


## Copyright

(c) 2013 Jan Lehnardt <jan@apache.org>
