+++
title = "Power Monitor"
description = "Accurate power monitoring and billing for your home server."
date = 2024-05-15
[taxonomies]
categories = ["hacking", "iot", "smart plug", "rust"]
[extra]
project_url="https://github.com/Half-Shot/autopowerbill"
image="/blog/power_monitor/plug.png"
image_alt="A hand holding a smart plug with the words Local Bytes written on it."
+++

I run half-shot.uk, and various other services off actual server hardware at home. A few years back a friend convinced me to stop relying
on cloud servers, and instead just buy a second hand box and run with it. The friend houses the server for me, and provides me an internet
connection, power, and space in their cabinet at home.

And for a long time the arrangement worked out fine. We installed a standard power monitoring brick which would tell him how much power
I had used, and we'd multiply that by the kilowatt per hour cost from their power supplier. I'd end up paying anywhere between
£30 to £40 per month depending on usage and the variance of bills.

Things then changed with [Agile Octopus](https://octopus.energy/smart/agile/).

### Agility

I promise it's got nothing to do with Agile software development delivered by eight-limbed molluscs. Octopus (a major UK energy company)
have a plan where kilowatt per hour costs change every half hour. The customer is notified a day or so before, so they can plan to eat their 
dinner earlier/later or generally plan to use energy in off-peak sessions; The intention to balance out power demand across the UK.

Because the UK has a pretty sizable [renewable energy](https://grid.iamkate.com/) sector, power costs can vary greatly based on the weather
conditions. There are some days when it's miserable and the power costs tend to go up over the next few days, and some times we get a lot of
wind and sunshine and the power costs drop (I've seen it drop below a penny per kwh!).

This is great, except it utterly ruins the way I pay for the server! You can take averages sure, but my usage is never constant as my
traffic patterns vary. And if I choose to do my heavy full disk backups in off peak periods, then I'd lose out on those potential savings.

A better solution it seems, was needed.

### Smart Plugs

The first thing that needed to be improved was the data collection system. The current smart plug could only capture daily usage,
and had no functionality to export the data to a third-party. 

{{ figure(
    src="/blog/power_monitor/old-app.png",
    href="/blog/power-monitor/old-app.png",
    alt="Screenshot of a basic Android app showing power usage per month.",
    caption="The process involved reading from this, and enter the data manually into a spreadsheet. Nobody was going for that idea."
) }}

In the end the solution was a MQTT-compatible smart plug that offered at least half hourly reporting. While I could have
bought any old plug off the internet and hardware modded it...I do not trust my skills or my attention span. Instead,
a supplier in the UK sells reasonably priced pre-modded ones [here](https://www.mylocalbytes.com/products/smart-plug-pm?variant=41600621510847).
Thanks Local Bytes!

{{ figure(
    src="/blog/power_monitor/plug.png",
    href="/blog/power-monitor/plug.png",
    alt="A hand holding a smart plug with the words Local Bytes written on it.",
    caption="Fairly unassuming!"
) }}


The next steps were to setup a MQTT broker on the server; [Mosquitto](https://mosquitto.org/) was very easy to get started with
so I just plonked that on and connected my plug to it. Then all I needed was the logic to convert the power readings into power costs.

### Autopowerbill

(I tried to think of an imaginative name for this project, but...ah well)

I wrote a little Rust daemon process that does essentially 3 things forever. It pulls in the latest prices from Octopus, roughly
every few hours. It subscribes to the power usage statistics topic from the smart plug, and then it calculates between the last
window and present time how much power has been used. This is then costed and pushed into a PostgreSQL database.

The algorithm ended up something like this:

```rust
if usage > 0.0 {
    // Find the price that matches this period
    let usage_cost: f32 = match octopus.get_price_for_period(last_date, date).await {
        Ok((matched_cost, Some(second_cost))) => {
            // We fall inside a second bucket, so fetch that price too.
            // Calculate the delta between the two timestamps
            let total_delta = (date-last_date).num_seconds() as f32;
            let mult_a = (matched_cost.to - last_date).num_seconds() as f32 / total_delta;
            let mult_b = (date - second_cost.from).num_seconds() as f32  / total_delta;
            // And thus determine how much power was used (approx) in each period.
            (matched_cost.cost * (usage * mult_a)) + second_cost.cost * (usage * mult_b)
        },
        Ok((matched_cost, None)) => {
            // Otherwise, straightforward to calculate.
            matched_cost.cost * usage
        }
        Err(e) => {
            panic!("Failure to handle cost at {:?}. No applicable cost found: {:}", date, e)
        },
    };
    println!("Calculated {:?} for {:?} ({:?} kwh)", usage_cost, date, kwh);
    PowerUsage { date, usage, total_usage: kwh, cost: usage_cost }
} else {
    PowerUsage { date, usage, total_usage: kwh, cost: 0.0 }
}
```

Definitely feel like Rust is starting to click for me a little bit now too.

### Everyone loves a graph

Of course now the data was being entered into PostgreSQL, it was then trivial to put together a Grafana dashboard. So I did:

{{ figure(
    src="/blog/power_monitor/grafana.png",
    href="/blog/power-monitor/grafana.png",
    alt="Grafana dashboard showing Usage Per Day (kwh), Cost Per Day, Monthly Cost and Total usage. The graphs show that there is a significant cost saving over constant rate power.",
    caption="The yellow column is how much power I would have used if we kept on the old plan."
) }}

Evidently this turned out to be a good idea. We've had some terrific weather in the UK recently, and it's translated into some pretty
welcome cost savings.

If you are interested in something like this, or would just like to see how it's put together then please check out [https://github.com/Half-Shot/autopowerbill](https://github.com/Half-Shot/autopowerbill).

And if you have any questions, you can always ask on [the mastodon thread](https://mastodon.half-shot.uk/@halfy/112446159375587479)

Thanks for reading!
