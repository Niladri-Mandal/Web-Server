const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  const { url, method } = req;

  if (url === '/about') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('About Page');
  } else if (url === '/home') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Home Page');
  } else {
    const logFilePath = path.join(__dirname, 'errors.log');
    const logEntry = `${new Date().toISOString()} - ${method} ${url}\n`;

    fs.appendFile(logFilePath, logEntry, (err) => {
      if (err) {
        console.error('Error writing to log file:', err);
      }
    });

    fs.readFile(logFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading log file:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }

      const lines = data.trim().split('\n');
      if (lines.length > 5) {
        const newLines = lines.slice(lines.length - 5).join('\n');
        fs.writeFile(logFilePath, newLines, (err) => {
          if (err) {
            console.error('Error truncating log file:', err);
          }
        });
      }
    });

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server started...');
});
