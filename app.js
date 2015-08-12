import { SerialPort } from 'serialport';
import request from 'request';

const SLACK_HOOK_URL = 'https://slack.com/api/chat.postMessage';
const SLACK_CHANNEL = process.env.SLACK_CHANNEL;
const SLACK_TOKEN = process.env.SLACK_TOKEN;
const SLACK_USERNAME = process.env.SLACK_USERNAME;
const THRESHOLD = 1000;

function sendMessage(channel, text, cb) {
  const form = { channel, text, as_user: true, token: SLACK_TOKEN, username: 'caffeinator' };
  request.post(SLACK_HOOK_URL, { form }, (err, res, body) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Sent: "${channel}" "${text}"`, body);
    }
  });
}

function notifyCoffeeReady(){
  sendMessage(SLACK_CHANNEL, '@here coffee is ready!')
}

function notifyCoffeeStarted(){
  sendMessage(SLACK_CHANNEL, 'a fresh pot is brewing');
}

const serialPort = new SerialPort(process.env.SERIAL_PORT, {
  baudrate: 9600,
});

let reading = 0,
  lastReading;

serialPort.on('open', () => {
  serialPort.on('data', data => {
    reading = parseFloat(data.toString());

    console.log(`Reading: ${reading}`);
    if (lastReading > THRESHOLD && reading < THRESHOLD) {
      notifyCoffeeReady();
    }

    if (lastReading < THRESHOLD && reading > THRESHOLD) {
      notifyCoffeeStarted();
    }

    lastReading = reading;
  });
});
