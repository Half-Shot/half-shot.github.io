+++
title = "2025 Round-off"
description = "Sanding down the year "
date = 2026-01-04
aliases = ["/blog/2025-roundoff"]
[taxonomies]
categories = ["2025", "end-of-year"]
+++

Hey friends! This post got stuck in a sludge of inaction for the last week, and has just been sanded down and ready for your consumption. 2025 was a reasonably
busy year for projects and things that I got up to, so this is just a quick summary on the year.


{{ cw(kind="Food", description="Some of this post contains pictures of food including meat. I've left this section at the end, so feel free to skip by it.") }}

{{ figure(
    src="/blog/2025_roundup/field.webp",
    href="/blog/2025-roundup/field_full.webp",
    caption="We hiked the Ridgeway this year. There was a lot of yellow.",
    alt="A picture of some yellow rapeseed fields split in the middle with a path.")
}}

# Projects

## MSC Crafter

This year [MSC Crafter](https://github.com/Half-Shot/msc-crafter) was born, which is an ongoing attempt to build a better editor for the
[Matrix Spec Change](https://spec.matrix.org/proposals/) process.

On the whole this was borne out of a mix of desires and frustrations from:

- The process being so heavily dependant on GitHub, a platform which has in recent times got heavier, broken workflows, and occasionally just goes offline now.
- Information on MSCs (like which ones they link to, impls of those MSCs) being scattered around the place.
- Some MSCs range into the hundreds of comments territory, or go through several rounds of changes and reviews.
- Travelling along rail networks meant my internet would suddenly vanish, which was usually the times I wanted to spend writing docs. So offline modes would be useful.

{{ figure(
    src="/blog/2025_roundup/crafter.webp",
    caption="Pretty happy with how it came out looking!",
    href="#"
    alt="Preview of the interface showing the light/dark mode split on MSC4143: MatrixRTC.")
}}

So all in all, there felt ample room for improving the workflow and if there is one thing I can do, it's bash out a web app! 

My overall aim for 2026 is to get it to a state where it's more useful, and feels snappier than GitHub is today. The end goal for the project is for the Matrix
Foundation to promote it as a suggested tool for MSC writers and reviewers alike.

## Kobold Kombat (wormgine)

I wrote about about the project [in August](/blog/kobold-kombat-intro/) but haven't kept up with it as much as I'd like to. The project is suffering a bit
from a rotting architecture. It works well enough, most of the time in local play but trying to extend to multiplayer has brought a lot of bugs to the forefront.

Primarily I would like to spend some of 2026 splitting out the rendering logic from the game logic, and decoupling it so that you could run and test the game entirely headless,
which would then allow for smoother multiplayer games.

Still though, I'm proud of where it is at!

# Fitness

It was a good year for trying to keep fit! My usual ambition of running a few races a year split into 3 different tracks of:

{{ figure(
    src="/blog/2025_roundup/paddleb.webp",
    caption="The lake! This doesn't do it justice. On a hot day, it was just beautiful.",
    href="#"
    alt="Picture of a lake in the background, with a wooden deck and a paddle board sitting idle. It's a beautiful blue day.")
}}


- Gym! Actually properly sticking to a routine. I've ended up with a spreadsheet and a finely crafted routine that I try to work towards most mornings.
- Paddle-boarding! We found out there was a nice lake to go paddle around in the heat of the summer, it was just beautiful.
- Running (still)!. I apparently ran ~650km in 2025, and PB'd my half marathon time at `1:49:22` so well happy with that.

# Cooking

I occasionally post the good foods on socials, but I thought just for this post I'll round off my favourite things I made this year
(and critically, took a photo of before I ate!).

{{ figure(
    src="/blog/2025_roundup/foods/white-fish.webp",
    caption="This one came out beautifully. Some tenderly poached white fish in sauce, with a few drips of hot honey on top.",
    href="#"
    alt="This one came out beautifully. Some tenderly poached white fish in sauce, with a few drips of hot honey on top.")
}}
{{ figure(
    src="/blog/2025_roundup/foods/chillib.webp",
    caption="Chilli beef that had marinaded for some time in chilli oil and soy sauce, laid atop rice and carrots.",
    href="#"
    alt="Chilli beef that had marinaded for some time in chilli oil and soy sauce, laid atop rice and carrots.")
}}

{{ figure(
    src="/blog/2025_roundup/foods/egg-fried-lamb.webp",
    caption="Egg fried rice with the most delicate lamb on top, alongside some duck spring rolls.",
    href="#"
    alt="Egg fried rice with the most delicate lamb on top, alongside some duck spring rolls.")
}}

{{ figure(
    src="/blog/2025_roundup/foods/steak.webp",
    caption="A beautifully prepared sirloin steak. The leftover juices were used to cook up the mushrooms in butter, and those juices were then mixed with beer and cream for the sauce. Homemade chips too!",
    href="#"
    alt="A beautifully prepared sirloin steak. The leftover juices were used to cook up the mushrooms in butter, and those juices were then mixed with beer and cream for the sauce. Homemade chips too!")
}}

{{ figure(
    src="/blog/2025_roundup/foods/beef-stew.webp",
    caption="Coming into the holiday season, I stewed down some beef for a good few hours in more beer, and then added bacon. The result was a very rich stew, alongside some home roasted potatoes.",
    href="#"
    alt="Coming into the holiday season, I stewed down some beef for a good few hours in more beer, and then added bacon. The result was a very rich stew, alongside some home roasted potatoes.")
}}

{{ figure(
    src="/blog/2025_roundup/foods/banana-bread-tart.webp",
    caption="And finally, banana bread! Well a tart, because my bread tin went missing! Still, it actually works!",
    href="#"
    alt="And finally, banana bread! Well a tart, because my bread tin went missing! Still, it actually works!")
}}


### And moving into 2026

Despite all the above, I've not actually cemented down what the goal of 2026 will be yet.

I've got some thoughts about trying to be a better maintainer and working
on some good habits to keep the overall cost to maintain low for the projects I've got on the burners. I probably plan to also do more
hardware projects with the local hackspace, and post more of those on this very site!

Anyway, that was a quick-ish post to give a general update of what I've been up to! Happy new year everyone!