+++
title = "Kobold Kombat: Building an entirely free software Worms clone."
description = "How I turned love and frustration of old video games into a hobby project"
date = 2025-08-02
aliases = ["/blog/wormengine-1-basics"]
[taxonomies]
categories = ["gamedev", "worms", "javascript", "hobby", "kobold-kombat"]
[extra]
project_url="https://github.com/Half-Shot/wormgine"
+++


This is going to be a *series* of blog posts discussing the various bits and pieces about one of my most proudest achievements;
I've spent the last 2 years[^1] working on building a fully functional clone of [Worms Armageddon](https://en.wikipedia.org/wiki/Worms_Armageddon).

For those less familiar with the series, you control a group of small characters on a island of randomly generated breakable terrain. You have
a bunch of weapons, nearly all cartoonish and primed to inflict horrible painful deaths on your enemies (the name we use to refer to people you've convinced
to huddle round your PC to play a game).

{{ figure(
    src="/blog/kobold_kombat_intro/screenshot.webp",
    href="/blog/kobold_kombat_intro/screenshot.webp",
    alt="Screenshot of the game. The level is a cutout of a skate park halfpipe with my Skraps character sprayed on. The UI has a toast which says 'Look who's up, it's Halfy's Angel!'. The team names are 'Team Halfy' and 'Chuckle Brothers'",
    caption="Look, when you've played your own game for so long you have to start to get a bit creative with the levels. "
) }}


### What's the project ultimately about.

I will be writing the game from scratch, targeting web browser specifically. And most importantly:

**Every last line of code and as much of the assets as possible will be open source**

This game will be entirely within the public domain. No reverse engineering will be used, simply observation and reimplementation. This will also not just be
another Worms game, but a game in its own right. It will have its own characters and weapons and modes and so on. There are also plenty of shortcomings of games
in this era (notably, accessible game design) which I am to fix without impacting the core experience. And of course finally, this game is intended to outgrow
its roots, and take its own identity (hence the name Kobold Kombat, with cute little murderous kobolds :>)

Ultimately what got me into programming was video games, and **it's about time I returned to what I love to work on most**. If I can make it a resource
that others can built on and learn from, then so much the better!

### So, what's on the menu?

I've spent the last year or so wanting to write more blog posts about this topic, because with every day spent working on games I have learnt more tricks and
fallen into more pitfalls than I thought possible. And, to meet that educational goal I really 'aught to document everything that goes through my little developer
brain.

However, this blog post has sat in a half completed form for the best part of a year so I've instead decided to write a formal introduction post with the plan to do
deep dives on specific topics later. **With that in mind, here are some of the topics I'd like to cover**.

 - So, you want to build a web game in 2025.
 - Bug squashing, automated game testing, and how many GitHub issues is too many.
 - Welding Pixi.JS to a Physics engine, and how I can prevent you from going mad.
 - The bluffers guide to music production and sound design.
 - Why you should have thought about networking before your first commit.
 - And finally, perhaps the thing I want to cover the most: Video game accessibility.


I *hope* to get to all these topics because each one is fun! But making video games is also fun! Doing real life chore things is not fun, but since all of those
things are currently unpaid and only one of them might leave me in serious hot water, I can't promise I'll manage them all.

### I'm here for video games, is this in a functional state.

It's certainly [playable](https://half-shot.github.io/wormgine/)[^2], and I really encourage people to give it a go and file issues. The multiplayer section
is heavily neglected while I shore up the fundamental game mechanics, but I hope to return to that soon. A local game between 2-or-more players should work without issue.


<video alt="Gameplay video" src="demo.webm" controls> </video>


### What's next!

I plan to really work to shore up testing and code quality so I can then start to tackle lots of interesting, critical features. The next up items are:

 - Terrain generation
 - Multiplayer improvements[^3]
 - More items
 - More animations
 - More sounds
 - And finally, a big pass on accessibility design and teaching the game to new players.

And if you have any questions, you can always ask on [the mastodon thread](https://mastodon.half-shot.uk/@halfy/114963948231166102)

Thanks for reading!

[^1]: Yes, it [really has been that long](https://github.com/Half-Shot/wormgine/tree/74656c1dac389043167f222f4e889111fb71df58). 
[^2]: Occasionally this gets stuck on first load, a refresh nearly always fixes it. It's a frustrating bug.
[^3]: The current multiplayer system uses [Matrix](https://matrix.org/) for interactions, and even on a tuned homeserver it was slow.