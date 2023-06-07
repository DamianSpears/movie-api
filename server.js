//VARIABLE DECLARATION
const http = require('http'),
   fs = require('fs'),
   url = require('url');
//This is assigning the variable HTTP, file system, and url in order to import the modules to allow for the use of its functions.

//SERVER CREATION
http.createServer((request, response) => {
   let addr = request.url,
      q = url.parse(addr, true),
      filePath = '';
      //above is taking the incoming request and parsing the URL so the HTTP server can read it.
      //any time an HTTP request is made, the createServer function is called
   fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
      if (err) {
         throw err
      } else {
         console.log('Added to log.');
      }
   });

   if (q.pathname.includes('documentation')) {
      filePath = (__dirname + '/documentation.html');
   } else {
      filePath = 'index.html';
   }
   //this if-else checks to see if the parsed URL pathname (first text after the '/' in the URL)...
   //... *includes()* a value or string with the phrase 'documentation'.
   //if it finds the path, it will also return the directory name (__dirname) to the filePath variable above



   fs.readFile(filePath, (err, data) => {
      if (err) {
         throw err;
      }
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.write(data);
      response.end();
      //The file system module uses the readFile function to either throw an error, or read the data within 'filePath'
      //filePath is the passed argument, therefore if no error is thrown, filePath is written through 'response.write(data)'
   });
}).listen(8080);
//We are telling node to listen for port 80, which is standard for HTTP. Anything above 1024 is fine
//Here, we are accessing the 'createServer' functin from the HTTP module we imported in variable declaration.

console.log('My first Node test server is running on Port 8080.');
//This request handler function will be called everytime an HTTP request hits the server.
