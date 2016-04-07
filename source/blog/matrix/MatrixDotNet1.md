@title Netting Matrix
@created April 7, 2016
@modified April 7, 2016 15:30:00
@author Will
@image /images/blog/matrixdotnet.png

I recently got into working on matrix.org, which is a pretty awesome spec/set of tools & SDKs to create a decentralised messaging system. That's actually a really rubbish way of describing it, so [check here](http://matrix.org/docs/guides/faq.html#what-is-matrix) if you want an actual definition.

Anyone who has known me for a length of time knows I like C#. One statement I have made (with only a slight amount of sarcasm) is that:

**The C# language is the closest humans have come to perfection in the field of programming field.**

Microsoft's ownership (they have loosened up a whole lot now) aside, it's fantastic. It's statically typed for the most part and strict enough to keep me in check, but it doesn't go overboard and request dumb shit like Java's 'every function must declare how it could cause an exception' nonsense. I could go on but that is not the subject of what I'm going to talk about.

I've done a bunch of things for matrix in Python, but I only use Python for small bits and bobs, not large projects because it gets too messy too quickly for my tastes. I want to write a bot for matrix that can interpret conversation as it is going on, and try to construct a table of key-worded questions to answers so that we don't have to reiterate everything discussed in the central matrix chatroom. That's not the subject of this post either though :P

### The Plan

I want to construct the entire Client > Server Matrix spec in C#. Every response will have a class, and then I want to go on to make a really smooth client API where developers can rely on just Intellisense (that thing where IDEs automatically tell you what classes/properties/methods are available) to construct a good client. Basically, I want it to be easily as good as .NET's own System libraries.

Once that's all done, I would like to go to constructing a C# homeserver*  (probably next year) to hopefully improve upon Synapses performance and memory eating habits.

### What's been done

So far, I've written up a few functions for the basic REST api bits (version,logging in, getting a users profile) and I'm now tackling the huge sync request which contains a huge array of different response types which all need to be written up in class format. I'm absolutley against anonymous types and dictionaries for this, so the SDK is still at least a week off from being usable. But I'll get there.

### Gaming

This was actually a discussion that came up from the #offtopic matrix room. There are a few voice chat applications out there for gaming such as Mumble, Teamspeak, Ventrillo (which I heard isn't so hot but still used) and Discord. I think that's an area which I'd love to tackle next seeing as there is so much room for improvement over on that side. 3 of those that I have mentioned are not free software, and Mumble is quite wrapped up in it's model that I couldn't easily port it to say Android. Once this SDK is in place I'd like to see if we could come up with a specification for a gaming application where you could report things like:

 * In-game location
 * Player class (for games like TF2)
 * Integration with other games (Which I know has been started by another guy in the matrix chat for Xonotic)
 * Kill counts
 * Automatic Team Rooms

It's kinda funny, because a year ago I saw very little importance to specification writing. Matrix.org has taught me that it's important that every detail be examined and written up clearly because when people come to build, they expect a perfect understanding on first pass. Otherwise, they will dismiss it. To that end, I hope in the future we could have a collaborative effort to create a specification for gaming communications.

\* A home server is what users connect their clients to in matrix which in turn connect to other home servers.
