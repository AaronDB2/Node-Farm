const fs = require('fs');
const http = require('http');
const url = require('url');
const { replaceTemplate } = require(`${__dirname}/modules/replaceTemplate.js`);

// Read all the HTML Pages/Templates and CSS files
const overviewPage = fs.readFileSync(`${__dirname}/templates/overviewPage/overview.html`, 'utf-8');
const cardTemplate = fs.readFileSync(`${__dirname}/templates/overviewPage/template-card.html`, 'utf-8');
const productPage = fs.readFileSync(`${__dirname}/templates/productPage/product.html`, 'utf-8');
const overviewCSS = fs.readFileSync(`${__dirname}/templates/overviewPage/overview.css`, 'utf-8');
const productCSS = fs.readFileSync(`${__dirname}/templates/productPage/product.css`, 'utf-8');

// Read Data from data.json and Parse it to a Javascript Object
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

// Create HTTP Server and Check Routing
const server = http.createServer((req, res) => {

    const { query, pathname } = url.parse(req.url, true);

    // Overview Page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'});

        const cardsHtml = dataObj.map(el => replaceTemplate(cardTemplate, el)).join('');
        const output = overviewPage.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);
    
    // Overveiw CSS
    } else if (pathname === '/overview.css') {
        res.writeHead(200, {'Content-type': 'text/css'});
        res.end(overviewCSS);

    // Product Page
    } else if (pathname === '/product') {
        res.writeHead(200, {'Content-type': 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(productPage, product);
        res.end(output);
    
    // Product CSS
    } else if (pathname === '/product.css') {
        res.writeHead(200, {'Content-type': 'text/css'});
        res.end(productCSS);

    // API
    } else if (pathname === '/api') {
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(dataObj);

    // Not found
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-wrold',
        });
        res.end('<h1>Page not found!<h1>');
    }
});


// Start Server
server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});