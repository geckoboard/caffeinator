# Caffeinator

A service to post the operating status of a coffee machine to Slack

## Hardware you will need

* [Particle Photon or a Particle Electron](https://www.particle.io/)
* [Current sensor](https://www.proto-pic.co.uk/non-invasive-current-sensor-30a.html)
* A two plug mains extension lead
* A piece of stripboard, a few resistors, a capacitor, some wire and a soldering iron.
* A little box to put it all in

Here is the circuit you'll need to build in order to get this all working — https://openenergymonitor.org/emon/buildingblocks/measuring-voltage-with-an-acac-power-adapter. The guide is for an Arduino but the same circuit will work with the analog inputs on a Photon.

Once you've built the above circuit you can attach the input to pin `A1`, `VDC` to `3V3` and `GND` to `GND` on your Photon.

You'll need to carefully cut into the plastic casing of your mains extension to access the positive lead (Really don't do this while the extension is plugged into the wall). You'll then need to wrap the positive wire around the clamp of the current sensor and snap it shut (I wrapped it a couple of times to increase the gain). Stick all of this in the little project box to keep it all tidy.

## Upload the code in `caffeinator.ino` to your Photon

You can do this using the IDE at https://build.particle.io and pasting the file contents in then flashing your Photon.

## Putting it together

Plug your coffee machine and the USB adapter to power your Photon into the extension lead.

Now go to https://dashboard.particle.io/user/logs

Now if you switch your coffee machine on hopefully a `started_brewing` event will appear in the logs.

You might find that the power thresholds for your machine are a little different to ours. You can experiment with the values of `LOWER_THRESHOLD` and `UPPER_THRESHOLD` from within the IDE. These represent the thresholds at which caffeinator decides the machine has switched off and switched on respectively.

## Add some Slack webhooks

Included in this repo are `hook_started.json` and `hook_success.json` you can use these as templates to create webhooks with the [Particle CLI](https://docs.particle.io/reference/cli/). Just paste the [Slack API token for your bot](https://api.slack.com/bot-users) in place of `%SLACK_BOT_TOKEN%` and the name of a Slack channel in your organisation in place of `%SLACK_CHANNEL%` then follow the [Particle CLI webhook docs](https://docs.particle.io/reference/cli/#particle-webhook-create) to create the webhooks.

If all goes well then when you turn your coffee machine on and when it finishes a message should appear in the channel you specified.