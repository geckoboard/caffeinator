import { SerialPort } from 'serialport';
import connect from 'connect';
import http from 'http';

const serialPort = new SerialPort(process.env.SERIAL_PORT, {
  baudrate: 9600,
});

let reading = 0;

serialPort.on('open', () => {
  serialPort.on('data', data => {
    console.log(data.toString());
    reading = parseInt(data.toString(), 10);
  });
});

const app = connect()
.use((req, res) => {
  const body = {
    brewing: reading > 1000,
  };

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
});

http.createServer(app).listen(process.env.HTTP_PORT);
