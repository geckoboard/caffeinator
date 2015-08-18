import { SerialPort } from 'serialport';
import request from 'request';

const SLACK_HOOK_URL = 'https://slack.com/api/chat.postMessage';
const SLACK_CHANNEL = process.env.SLACK_CHANNEL;
const SLACK_TOKEN = process.env.SLACK_TOKEN;
const SLACK_USERNAME = process.env.SLACK_USERNAME;
const START_BREWIN_THRESHOLD = process.env.START_BREWIN_THRESHOLD || 1000;
const DONE_BREWIN_THRESHOLD = process.env.DONE_BREWIN_THRESHOLD || 100;

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
  sendMessage(SLACK_CHANNEL, '<!here> coffee is ready!')
}

function notifyCoffeeStarted(){
  sendMessage(SLACK_CHANNEL, 'a fresh pot is brewing');
}

const serialPort = new SerialPort(process.env.SERIAL_PORT, {
  baudrate: 9600,
});

serialPort.on('open', () => {
  let readings = [],
    brewin = false;

  serialPort.on('data', data => {
    const reading = parseFloat(data.toString());
    readings.push(reading);
    console.log(reading);

    if (readings.length === 20) { // Sample every 20 readings
      const avg = readings
      .sort() // Sort from min to max
      .slice(6, 14) // Ignore potential outliers
      .reduce((m, v) => m + v) / 8; // Take the mean of what remains

      readings.length = 0; // Truncate

      if (avg > START_BREWIN_THRESHOLD && !brewin) {
        console.log('BREWIN');
        notifyCoffeeStarted();
        brewin = true;
      }

      if (avg < DONE_BREWIN_THRESHOLD && brewin) {
        console.log('DUN BREWIN');
        notifyCoffeeReady();
        brewin = false;
      }
    }
  });
});
