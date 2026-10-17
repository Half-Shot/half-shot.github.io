+++
title = "WebDAV and the Optical Revolution"
description = "Or, how I started storing and learned to love the discs."
date = 2026-09-14
[taxonomies]
categories = ["hacking", "webdav", "rust", "mpd", "mopidy", "cd"]
[extra]
project_url="https://codeberg.org/Half-Shot/mopidy-webdav"
image="/blog/power_monitor/plug.png"
image_alt="A hand holding a smart plug with the words Local Bytes written on it."
+++

I got so sick of paying for Spotify. The application can be somewhat clunky, and I never felt comfortable paying about the same price as 5-6 secondhand albums a month to have access to my music. Obviously, I could just pirate my way around and bit torrent / newsgroup my music together, but what if there was a way to get the convenience legitimately.

I turn of course to our reflective spinny friends, the Compact Disk!

### The Project

I want to return to an era where I own my music, forever. I can stream it to my devices, store it forever and not pay a fee to an American company for the convenience. 

### Mopidy and WebDAV and Nextclouds

I already have a Nextcloud, it serves many purposes from backups to nostalgic photo album sharing. My plan is to acquire all the music I listen to as Bandcamp downloads, or CDs off eBay / Music Magpie (seriously, £2 a CD in some cases).

I use [Laser]() to rip these CDs from source. It helpfully hooks up to online sources for the media so each track is ripped as a FLAC with full metadata. Within a hour I have a Nextcloud full of media. At this point I could just listen to it in the WebUI, but where is the fun in that!

I'm a heavy MPD user, but storing all this music on each device I own feels like a lot of wasted space. Why couldn't we just stream it from WebDAV...enter Mopidy.

Mopidy is a very extendible music server, which allows you to to plug in extensions for audio sources, outputs and control interfaces. It has a reasonable MPD interface, so that part is easy[1].

The bit that was missing is that it doesn't support WebDAV natively. We could use Rclone to mount the directory, but we'd be paying massive performance costs for those FLAC files. Because a local filesystem to Mopidy is expected to be fast, it's gonna try and index all those files and we do want to play music some time today!

### Arghhh Nextcloud y u so :snail:

I end up writing an extension for Mopidy that exposes WebDAV to it, but with heavy caching /intelligent file scanning. We do things like reas file with `Range` to prevent Nextcloud from working too hard. Unfortunately, we do need to implement the metadata scanning ourselves so we use [mutagen]() for that bit.

We now have a way to stream music, however it is *dead* slow. Nextcloud is simply not designed for rapid small reads of files, but we can fix it.

`nextcloudr` is a rust proxy layer for Nextcloud that handles some WebDAV operations, such as reads and multi-writes. Because my Nextcloud uses object storage under the hood, it's trivial to bypass the sluggish PHP-fpm layer of Nextcloud with a rapid Rust handler giving us essentially native speeds to S3. Given this runs on kube, spinning up many replicas of this layer means we can do many reads/writes without saturating the Nextcloud main process.


### Putting this altogether

### What's next
