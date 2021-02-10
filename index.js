const express = require('express');
const request = require('request');

const serviceUrl = 'https://pro-api.coinmarketcap.com/v1';
const privateKey = '10673202-49c0-40fa-b358-29ecc9723cab';


const app = express();
const port = 3000;

var memory = {};

app.use( express.urlencoded({
    extended: true
}) );
app.use( express.json() );

app.listen(port, () => console.log(`App listening on port ${port}!`) );

app.get('/top30', (req, res) => {
    console.log(`GET '/top30'`);

    res.send(memory);
});

app.get('/update', (req, res) => {
    console.log(`GET '/update'`);

    var options = {
        'method': 'GET',
        'url': serviceUrl + '/cryptocurrency/listings/latest?start=1&limit=30&convert=USD',
        'headers': {
          'X-CMC_PRO_API_KEY': privateKey,
          'Cookie': '__cfduid=dcf82b5cbe929d30c9f3b13e3dd503a331612975649'
        }
      };

      request(options, function (error, response) {
        if (error) {
            console.log(error);
            res.send( 'ERROR' );
        }
        memory = {};
        let i = 0;

        let responseBody = JSON.parse(response.body);
        console.log(`response: ${responseBody.data}`);
        let data = responseBody.data;
        data.forEach(crypto => {
            const key = crypto.symbol;

            const value = {
                price: crypto.quote['USD'].price,
                market_cap: crypto.quote['USD'].market_cap
            }

            memory[key] = value;
        });

        response.body;

        res.send( 'OK' );
      });
});