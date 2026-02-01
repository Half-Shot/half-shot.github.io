
+++
title = "Bringing a SanDisk Clip+ back to life"
description = "A very cute portable music player is revived!"
date = 2026-01-31
[taxonomies]
categories = ["hacking", "clip plus", "music"]
kind = ["hacking"]
[extra]
project_url="https://www.rockbox.org/wiki/SansaAMS.html"
fediverse_post="https://mastodon.half-shot.uk/@halfy/115990112148237007"
+++

## Preamble

My latest obsession has been trying to find a "retro" personal music player, and replace the all-too-easy
lure of subscription services of my eternally chatty Android phone.

I already have a sizeable collection of music bought from [Bandcamp](https://bandcamp.com) or ripped from CDs,
but having tried out a number of FOSS Android Music apps, they just don't feel good to use. They're "fine",
but it's just another battery drainer and just lack the tactile feel of a player in your hands.

So my adventure began to find a good player from the 2000s which could:

1. Looks cool. This is very important, my ego needs stroking by total strangers!.
2. Sounds *good*. No crappy DACs.
3. Storage can be expanded.
4. Can be found online for a sensible amount of money.
5. A stretch goal of being supported by [Rockbox](https://www.rockbox.org/). Rockbox is awesome!

And the winner? A [SanDisk Clip +](https://en.wikipedia.org/wiki/SanDisk_portable_media_players#Sansa_Clip+).

{{ figure(
    src="/blog/clip_plus/clipplus.webp",
    caption="It's aliiiiiiive!",
    href="/blog/clip-plus/clipplus.webp",
    alt="A picture of me holding my Clip+ running Rockbox")
}}

These things can be found from anywhere from £20 to up to £100, but you can save significant amounts of
money by buying "Spares/Parts only", *if you can hack it*.

Also, they can run [the Sansa Rockbox port](https://www.rockbox.org/wiki/SansaAMS.html) which gives the little matchbox
a significant number of cool features like FLAC support, gap-less playback and a dozens of fidget toys.

You *might* think DOOM on a tiny portable is a gimmick, but it was very handy when my phone ran out out battery
when I was travelling!

## The hackers gamble 🎲

I got very lucky and snagged a Clip+ for £20. It was in pristine condition but could not boot. The specific
bug was that it got stuck at the "flower" stage, which is where the device starts but can't get further
than the boot animation. This was a total gamble, but I assumed it might just need a hard reset.

Nope.

{{ figure(
    src="/blog/clip_plus/bootup.webp",
    caption="A sure sign your Clip+ isn't happy is showing you an eternal flower.",
    href="/blog/clip-plus/bootup.webp",
    alt="A picture of a Clip+ with a flower logo on it's LCD")
}}

The device seemed to recognise being plugged in via USB to my PC, but the PC didn't register a smidge of
data across the connection. No USB device detected, not even an attempt registered when I checked `dmesg`.

So something was seriously wrong. You can even put these devices into MSC mode, which means they boot
and just expose the flash / SD card as a filesystem directly. Super useful for modding/debugging, but this
device was so far gone that even that wasn't possible. The firmware was almost certainly **corrupted**, and I
was praying that the onboard flash was still good.

### Digging in.

We need to try and put new firmware on the board now.

I followed the [iFixIt](https://www.ifixit.com/Guide/Repairing+Loose+Headphone+Jack/29473)
guide to get the case off, which was easy-ish. You just have to be *gentle* with the prying as it uses 
tiny little clips to keep the case together.

Next, you need to **gently** pull the battery off. I can not stress enough how gently, this thing has 3
tiny wires soldering the battery to the PCB, and it's stuck to the processor via a thermal pad.

Once that's done, you need to unscrew the board, This is the most straightforward bit.

Then, a real test of skill. We need to bridge the two pins that force the device to expose the NAND
to allow us to flash on new firmware. This is shown below <span style="color: red; text-weight: bold;">IN RED</span>.

{{ figure(
    src="/blog/clip_plus/pcb.webp",
    caption="Original Clip+ picture copyright © 2005-2009 EnzoTen Media. All rights reserved.",
    href="/blog/clip-plus/pcb.webp",
    alt="Clip Plus PCB with the correct pins in red.")
}}

These steps are abridged from the sources mentioned at the bottom. I have just annotated things that related to my experience,
and you should definitely be careful here. Please do as the source article says and reach out to Rockbox via their support channels
if you do not feel comfortable doing this work!

0. Download the [original firmware](https://download.rockbox.org/sansa_fw/clipplus01.02.16.zip) and unzip it. 
1. Plug the device in via USB. Remove the micro-SD card if you have one inserted.
2. (Optional, strongly recommended) Have `dmesg -w` running so you can see what the USB port is doing.
3. A second terminal running which allows you to see the output of `lsblk`.
4. Turn the device OFF by holding the power button for 20s until the screen turns off.
5. Bridge the <span style="color: red; text-weight: bold;">indicated ports</span>. This is fiddly, I used a screwdriver that was conductive.
6. Turn the device on, the screen should end up **blank** if this worked.
  - Do not worry if this does not work the first, second, or 20th time. I had to take many attempts at this process. If you still get a stuck boot logo, just hard power off like in step 3 and retry.
7. You can see a block device has appeared (you can also run `fdisk -l` to check).
  - This block device should be 4G / 8GB depending on your model (i.e. the whole flash storage). If it gives
    you a different value, **do not persist any further**. Your flash is likely faulty.
8. Once that's working, you can attempt to flash new firmware by using `dd if=orig_image.bin of=/dev/sdX status=progress`.  **TRIPLE CHECK THE DEVICE YOU ARE WRITING TO!**
9. This may take a while. In my case, it about 30 minutes. Much longer than you might expect to write ~16MB of data. If it looks like
   it's hung, just wait a while and check back on it.
10. When it's completed, disconnect the device and power off again like in step 3.
11. The device should now boot normally.

Congratulations, you have saved a device from the e-waste bin!

### Rockbox

I found the original firmware to be quite frankly, shit. It was slow to run, supported very little of my library or my 128GB Micro SD card.

The instructions for doing this are very straight forward and listed on the [Rockbox Sansa article](https://www.rockbox.org/wiki/SansaAMS.html#Installation)
so I won't repeat those here. Hopefully they were as straightforward for me as they were for you.

Anyway, that covers everything I wanted to say on the Clip +. It's a fantastic piece of kit, and I've already had a lot of good usage out of
it. Do let me know if you found this article useful on the fediverse!

### Acknowledgements

This post is merely the net summary of knowledge of people who came before me, I want to give a shout out to the following posts:

- The contributors to [https://www.ifixit.com/Guide/Repairing+Loose+Headphone+Jack/29473](https://www.ifixit.com/Guide/Repairing+Loose+Headphone+Jack/29473).
- [This reddit post](https://www.reddit.com/r/rockbox/comments/16bd2dj/recovered_another_cheap_sansa_clipplus_for_the/)
- This [RockBox article](https://www.rockbox.org/wiki/SansaAMSUnbrick.html) showing how to unbrick a device with this problem.
- The [PCB image](http://www.anythingbutipod.com/archives/disassembly/) from anythingbutipod.com.
