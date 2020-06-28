---
title: Picking NodeJS libraries
subtitle: Not all hammers are equal
tags: nodejs dependencies programming
published: '2020-06-28'
---

It came to me as a realisation when I was writing the code for this blog. As a developer you have your own
system for assessing new dependencies. Some people have very simple system, where they take the first library
that solves the problem. Others may instead choose to pick the one that meets several layers of criteria.

I believe this is probably something that comes with experience, but there isn't a good one-size-fits-all
rulebook that describes how most projects should manage their dependencies.

Anyway, in the interests of keeping this post to the point I wanted to outline how *I* pick a dependency
for a NodeJS project.


### Requriements

#### Types (if you're into that)

Generally speaking if the project isn't a [tiny single file app](https://github.com/Half-Shot/matrix-to-riot),
I tend to pick [Typescript](https://www.typescriptlang.org/). I won't get into the nitty gritty of why, but
it adds a requirement: The package must serve types OR have a up to date `@types/package` on DefinitelyTyped.

At the moment, nearly all major libraries include their own types and notable exceptions like [express]() have
very well maintained `@types/` library. But there are exceptions, and introducing a type-less library either
means you will need to maintain your own types (which can be very dangerous), or you can forgo types altogether
which means you will be including unknowable types into your code.

You may be reading this and thinking this is surely a reason not to use Typescript. It might be, depending on
your use case but there are very few occasions I have had to do either of the above, and I can usually find a
library that matches my other requirements.

### Licence

![Licence information can be found on npm](/public/images/nodejs-picking-libraries/npm-licence.png)

Fairly obvious one, but check the licence. You might be in for a nasty surprise. I'm not going to pretend to know
enough to advise on licence specifics, so a good starting place is checking https://choosealicense.com/licenses/.
Some licences may cause trouble for you should you plan to make an application closed source, such as GPLv3
which requires source disclosure. 

### Package activity

If a package has not seen an update in a year or two, that may be cause for concern. Obviously some libraries
fill a simple goal, and don't need regular maintenance but those are few and far between. Chances are if you
are seeking to add a new dependency to your project, it's not going to be a "simple" piece of code. You don't
need to do a deep dive into the packages history, but it's worthwhile just looking if the community is active
on creating releases, or even just on the main branch.

### Issue count

This one really is a pinch of salt thing. Plenty of good quality projects may have many open issues and few closed
issues, but it's worth glancing at the content of these issues. Is there a trend where issues have stopped being
responded to, has the latest version of NodeJS rendered this broken? Is there any hope? I always recommend a skim
before committing to using it.

### Subdependencies

Finally, I always like to see how liberal developers have been in adding dependencies to their project. If the project
pulls in hundreds of dependencies, it might be worth just seeing if you want to afford the extra burden of installing
those. Technically speaking, a breakage in a dependencies dependency can render you in serious trouble. Though these
kinds of breakages are rare.

### Nothing else fits

Sometimes, there might be nothing that ticks these boxes. You might be looking for a niche solution (XMPP components spring to mind),
or maybe nobody has tried to solve this in Javascript yet. At the end of the day, picking up a dependency is deciding
that you would rather stand on the shoulders of giants than...well construct your own. Just be sure that the giant is
made out of something strong :). 

So in summary, it's really something I've started to do over the years as I've maintained more and more NodeJS projects
and this article is certainly not prescriptive about what you must do. This is purely my criteria for selectiong
a depencency, and what has worked out well for me over the years.

NPM [had 211,000 users in 2016](https://blog.npmjs.org/post/143451680695/how-many-npm-users-are-there). I couldn't find
any information on the number of packages, but probably a good ballpark figure is **500,000 packages**. That's a lot
of software, so picking the right ones to carry into your project is important, and nessacery for the safety of users
as well as your enjoyment of the process itself.