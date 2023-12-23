const fetch = require("node-fetch");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const apikey = process.env.apikey;
const prodtype = process.env.prodtype;
const prodid = parseInt(process.env.prodid, 10);
const duration = parseInt(process.env.duration, 10);

const apis = [
    {
        path: "/point-renew",
        rainyun_apiurl : "https://api.v2.rainyun.com/product/point_renew",
        fetch_options: {
            method: "POST",
            headers: {
                "X-Api-Key": apikey,
                "User-Agent": "Apifox/1.0.0 (https://apifox.com)",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                duration_day: duration,
                product_id: prodid,
                product_type: prodtype
            }),
            redirect: "follow",
        },
    },
];

apis.forEach((e) => {
    app.get(e.path, (req, res, next) => {
        (async (req, res) => {
            const rp = await fetch(e.rainyun_apiurl, e.fetch_options);
            const txt = await rp.text();
            console.log("Status", rp.status);
            console.log("Response", txt);
            res.status(rp.status).send(txt);
        })(req, res).catch(next);
    });
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`App started on port ${port}`);
    });
}

module.exports = app;