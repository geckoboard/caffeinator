# Caffeinator

A service to post the status of the coffee machine to Slack

## Uploading the sketch to your Arduino

1. Add `sketch/EmonLib.zip` to your Arduino library
2. Upload `sketch/caffeinator.ino` to your Arduino
3. Identify the serial port your Arduino has been assigned (you'll need that to start the node service)

## Installation

```bash
npm install
```

## Startup

```bash
SLACK_CHANNEL=#test SLACK_TOKEN=<AUTH_TOKEN> SLACK_USERNAME=caffeinator SERIAL_PORT=/dev/tty.usbserial1 npm start
```
