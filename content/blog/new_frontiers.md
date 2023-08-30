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

- DNS
- telnet
- FSAPI
- spinning up a dumb HTTPS server
- mitmproxy?
- MTIMPROXY!
- writing a custom client

## TL;DR

If you don't want to read the whole preface to this, the end result of this project is that there is now a project that can convince
a FS Radio that is configured for Airable, to instead talk to streams of your choice.


### References

- [The Mastodon thread](https://mastodon.half-shot.uk/@halfy/110967351685629045)