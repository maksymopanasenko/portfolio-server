require('dotenv').config();

var nodemailer = require('nodemailer');

const http = require('http');
const fs = require('fs');

const port = process.env.PORT || 5500;

const server = http.createServer();

server.on('request', handleRequest);

server.listen(port, () => console.log('Server has been started at http://localhost:' + port));

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:process.env.EMAIL,
        pass:process.env.EMAIL_PASSWORD
    }
});

async function handleRequest(request, response) {
    const {method, url} = request;
    if (method == 'GET') {
        response.end('ok');
    } else if (method == 'POST') {
        // response.setHeader('Access-Control-Allow-Origin', '*');
        // response.setHeader('Access-Control-Allow-Methods', 'POST');
        // response.setHeader('Access-Control-Allow-Methods', 'OPTIONS');
        // response.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');

        response.setHeader('Access-Control-Allow-Origin', 'http://localhost:5500');
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        response.setHeader('Access-Control-Allow-Credentials', true);

        
        
        const jsonBody = await getBody(request);

        const body = JSON.parse(jsonBody);

        var mailOptions = {
            from:process.env.EMAIL,
            to: ['maxpanas008@gmail.com', 'm.opanasenko1997@gmail.com'],
            subject: 'New request from Node.js',
            text: `Name: ${body.name}, E-mail: ${body.email}, Message: ${body.text}`
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                response.statusCode = 400;
                response.end('Error');
            } else {
                console.log('Email sent: ' + info.response);

                response.end('ok');
            }
        });
    }
}

async function getBody(request) {
    const chunks = [];

    for await (let chunk of request) chunks.push(chunk);

    return Buffer.concat(chunks).toString();
}