const puppeteer = require('puppeteer');
const fs = require('fs');

async function run() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    let url = 'https://blockstream.info/tx/recent';

    await page.goto(url);

    await page.waitForSelector('.transactions-table', { visible: true }); //wait for the page to load

    const transactions = await page.evaluate(() => {
        let content = document.querySelectorAll('.transactions-table .transactions-table-link-row');
        let transactionsArray = [];

        content.forEach((e) => {
            transactionsArray.push({
                link: e.querySelector('a').href,
                id: e.querySelectorAll('.transactions-table-cell')[0].innerText,
                amount: e.querySelectorAll('.transactions-table-cell')[1].innerText,
                fee: e.querySelectorAll('.transactions-table-cell')[2].innerText,
                size: e.querySelectorAll('.transactions-table-cell')[3].innerText,
            })
        });

        return transactionsArray;
    })

    console.log(transactions);

    await browser.close();

    fs.writeFile('data.json', JSON.stringify(transactions), (err) => {
        if (err) {
            throw err;
        }

        console.log('File saved');
    });
}

run();
