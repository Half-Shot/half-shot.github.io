+++
title = "New frontiers"
date = 2019-11-27
+++

## Preface

I bought an Internet Radio. Yes, one of those things from the late 2000s where you could make a radio
connect to your WiFi and hook into a MP3 stream. I bought one because I was unsatisifed with the solutions out there to get audio around your house.

Bluetooth is cumbersome, you have to connect it and then you have to locate an app on your phone to get
the media you want...ugh. I want a thing that turns on and immediately plays. Yes, I could have built one
out of speakers and a Pi...but that's now a thing *I* have to spec and maintain. I just want a Wifi-enabled streaming device.

And so, the often forgotten little entry-level internet radios appeared before me. Amazon is littered with internet radios from different providers
but the one I bought ended up being a [LEMEGA IR1](https://www.amazon.co.uk/gp/product/B089D8BV99). 

{{ figure(src="https://mastodon-media.half-shot.uk/media_attachments/files/110/967/348/610/898/990/small/42986795cafe0620.jpg", alt="A picture of the radio, with the wifi screen", caption="The UX for the wifi password screen left something to be desired") }}

## Frontier Silicon

A lot of the cheapo radios use the same OS and hardware under the hood. I've by no means done a thorough investigation, but "Pure radios" may
be another seller. Either way, they're all using [Frontier Silicon](https://www.frontiersmart.com/). These seem to be a Cambridge outfit that
build purpose-made PCBs for internet-radio-shaped devices. They also provide an operating system based on RTOS, which is closed source. I used
[this GitHub project](https://github.com/huaracheguarache/Frontier-Silicon-Argon-Firmware/tree/master) as a good starting point.

## Breaking in

To start with, we needed to know what it was connecting to. To do that, I pointed the radio at my home DNS resolver (what do you mean you don't have one?). This showed me that it was connecting to `airable.wifiradionetworks.com`. Great!

Now I had initially assumed it was unencrypted and simply pointing it to a web server would be enough. Not at all! The call was made directly as HTTPS so simply responding on port 80 would do...nothing.

I then ended up looking at port 514, which when connected to via `telnet` will spam out logs. However, nothing useful was sent...

```
log sample
```

The next port of call was the API used to control these devices via an app. Yes, a lovely insecure API protected by a 4 digit pin (1234 by default, lovely).

This API even features a web interface you can reach by hitting the 8080 port on the radio, but it wasn't very useful. You can control the media volume, set some presets and see what's playing but critically you **cannot** modify what is playing.

So then what? After a chat with some lovely folks on Mastodon, it was suggested to try `mitmproxy`. mitmproxy is a simple tool that allows you to serve encrypted HTTPS traffic and view the contents. it has a proxy mode, but it also has a *reverse proxy mode*.

Critically the radio does not verify the certificates for the host at all, so the target domain was set to my devbox's IP address. I ran the proxy and routed traffic to the real host aaaand...🎉 voila!

It spilled the beans and navigating the radio interface showed all the requests it was making.

(photo of requests)

Now we know what to say, let's say it. I wrote a simple node server to handle the requests which let me play a MP3 file through it. I could then also connect it to `mpd` (Music Player Daemon) and play a whole playlist. Also, I added my own brand.

(video of halfy stream)

So there we have it, a internet radio but with actual configuration support. The node app is bare now but I plan to add support for snapcast so I can stream arbitrary audio to the device from around my home. Ultimately it will be useful as part of my home automation stack (think: morning alarm playlists without the need for Spotify).

I'd like to thank the Mastodon community, the Watercooler group on Matrix, the previous hackers who wrote some tremendously useful info..and my poor partner who suffered my enthusiasm for days on end 😁

## TL;DR

If you don't want to read the whole preface to this, the end result of this project is that there is now a project that can convince
a FS Radio that is configured for Airable, to instead talk to streams of your choice.


### References

- [The Mastodon thread](https://mastodon.half-shot.uk/@halfy/110967351685629045)
