+++
title = "New frontiers"
description = "Breaking into an Internet Radio"
date = 2023-08-30
[taxonomies]
categories = ["hacking", "javascript", "audio"]
[extra]
project_url="https://github.com/Half-Shot/fairable"
image="/blog/new_frontiers/wifi_interface.jpg"
image_alt="A picture of the radio, with the wifi screen."
+++

## Preface

I bought an Internet Radio. Yes, one of those things from the late 2000s where you could make a radio
connect to your WiFi and hook into a MP3 stream. I bought one because I was unsatisifed with the solutions out there to get audio around your house.

Bluetooth is cumbersome, you have to connect it and then you have to locate an app on your phone to get
the media you want...ugh. I want a thing that turns on and immediately plays. Yes, I could have built one
out of speakers and a Pi...but that's now a thing *I* have to spec and maintain. I just want a Wifi-enabled streaming device.

And so, the often forgotten little entry-level internet radios appeared before me. Amazon is littered with internet radios from different providers
but the one I bought ended up being a [LEMEGA IR1](https://www.amazon.co.uk/gp/product/B089D8BV99). 

{{ figure(
    src="/blog/new_frontiers/wifi_interface.jpg",
    href="/blog/new-frontiers/wifi_interface.jpg",
    alt="A picture of the radio, with the wifi screen",
    caption="The UX for the wifi password screen left something to be desired"
) }}

## Frontier Silicon

A lot of the cheapo radios use the same OS and hardware under the hood. I've by no means done a thorough investigation, but "Pure radios" may
be another seller. Either way, they're all using [Frontier Silicon](https://www.frontiersmart.com/). These seem to be a Cambridge outfit that
build purpose-made PCBs for internet-radio-shaped devices. They also provide an operating system based on RTOS, which is closed source. I used
[this GitHub project](https://github.com/huaracheguarache/Frontier-Silicon-Argon-Firmware/tree/master) as a good starting point.

## Breaking in

To start with, we needed to know what it was connecting to. To do that, I pointed the radio at my home DNS resolver (what do you mean you don't have one?). This showed me that it was connecting to `airable.wifiradionetworks.com`. Great!

Now I had initially assumed it was unencrypted and simply pointing it to a web server would be enough. Not at all! The call was made directly as HTTPS so simply responding on port 80 would do...nothing.

I poked about a bit and ended up looking at port 514, which when connected to via `telnet` will spam out logs. However, nothing useful was sent...

```
Escape character is '^]'.
(Thread1): [     28.992309] UI     (2): Timer1---873
(Thread1): [     28.992478] UI     (2): BATT =>> 1023
(Thread1): [     29.306109] NET    (2): Notify Wlan Link i/f 0 UP
(Thread1): [     29.992315] UI     (2): Timer1---872
(Thread1): [     30.992313] UI     (2): Timer1---871
(Thread1): [     30.992489] UI     (2): BATT =>> 1023
(Thread1): [     31.992320] UI     (2): Timer1---870
(Thread1): [     32.992317] UI     (2): Timer1---869
(Thread1): [     32.992490] UI     (2): BATT =>> 1023
(Thread1): [     33.992310] UI     (2): Timer1---868
(Thread1): [     34.992310] UI     (2): Timer1---867
(Thread1): [     34.992486] UI     (2): BATT =>> 1023
(Thread1): [     35.339301] NET    (2): Notify IP i/f 0 (192.168.1.203) UP
(Thread1): [     35.348842] CB     (1): airable_cb_module_SetInfo(): item index = 0, item id = 'airable://frontiersmart/radio/102296330081
(Thread1): [     35.356550] CB     (1): airable_cb_module_PostImmediateConnect(): connecting to 'airable://frontiersmart/radio/10229633008
(Thread1): [     35.357703] IB     (2): Browsing into '<no folder name>' (-1 - -1)
```

*it's cute how they have their little protocol handler*

The next thing to try was the API used to control these devices via an app. Yes, a lovely insecure API protected by a 4 digit pin (the default is easily guessed and enabled by default, yay).

This API even features a web interface you can reach by hitting the 8080 port on the radio, but it wasn't very useful.
You can control the media volume, set some presets and see what's playing but critically you **cannot** modify what is playing.

So then what? After a chat with some lovely folks on Mastodon, it was suggested to try `mitmproxy`. [mitmproxy](https://mitmproxy.org/) is a simple tool that
allows you to serve encrypted HTTPS traffic and view the contents. it has a proxy mode, but it also has a *reverse proxy mode*. This means you can serve up
a server, and redirect all requests to the real server *while* inspecting the contents of the messages. Neat!

Critically the radio does not verify the certificates for the host at all, so the target domain was set to my devbox's IP address.
I ran the proxy and routed traffic to the real host aaaand...🎉 voila! It spilled the beans and by clicking around on the interface,
you could see how it was pulling the data.

{{ figure(
    src="/blog/new_frontiers/requests_view.png",
    href="/blog/new-frontiers/requests_view.png",
    caption="And now it all makes sense!",
    alt="Screen capture of mitmproxy showing two requests from wifiradionetworks.com")
}}

So now that the API was revealed it was fairly trivial to work with. I wrote a simple node server to handle the requests which let me play a MP3 file (sadly no vorbis support) through it.
I could then also connect it to `mpd` (Music Player Daemon) and play a whole playlist. Also, I added my own "brand".

<video alt="Video of the stream working" src="success.webm" controls> </video>

So that's that, we've broken in and found ourselves a way to add arbitrary streams to it!


## Summary

You can now use [fairable](https://github.com/Half-Shot/fairable) as a rudimentary replacement service for this radio series. I plan to add
support for things like [Snapcast](https://github.com/badaix/snapcast) so I can stream arbitrary audio to it but that will require a lot more
effort than what is put here.

Ultimately, this project will be useful as part of my home automation stack (think: morning alarm playlists without the need for Spotify).

I'd like to thank the Mastodon community, the Watercooler group on Matrix, the previous hackers who wrote some tremendously useful info. 
and my poor partner who suffered my enthusiasm for days on end 😁.

If you've got any questions on this, hit me up on [Matrix](/contact)!


### References

- [The Mastodon thread](https://mastodon.half-shot.uk/@halfy/110967351685629045)
- [Fairable](https://github.com/Half-Shot/fairable)
