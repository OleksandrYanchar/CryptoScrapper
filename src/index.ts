// Import statements remain the same
import puppeteer from 'puppeteer';
import fs from 'fs/promises';

// Interface remains the same
interface Transaction {
    link: string;
    id: string;
    amount: string;
    fee: string;
    size: string;
}

// Export the async function rather than invoking it
export async function run(): Promise<Transaction[]> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const url = 'https://blockstream.info/tx/recent';

    await page.goto(url);
    await page.waitForSelector('.transactions-table', { visible: true });

    let transactions: Transaction[] = await page.evaluate(() => {
        const rows = document.querySelectorAll('.transactions-table .transactions-table-link-row');
        return Array.from(rows).map(row => {
            const cells = row.querySelectorAll('.transactions-table-cell');
            // Use optional chaining (?.) to access properties safely and nullish coalescing operator (??) for defaults
            const linkElement = row.querySelector('a');
            return {
                link: linkElement?.href ?? '',
                id: cells.length > 0 ? cells[0]?.textContent?.trim() ?? '' : '',
                amount: cells.length > 1 ? cells[1]?.textContent?.trim() ?? '' : '',
                fee: cells.length > 2 ? cells[2]?.textContent?.trim() ?? '' : '',
                size: cells.length > 3 ? cells[3]?.textContent?.trim() ?? '' : '',
            };
        });
    });
    
    
    

    console.log(transactions);

    await browser.close();

    try {
        // Save the file with UTF-8 encoding and indentation for readability
        await fs.writeFile('data.json', JSON.stringify(transactions, null, 2), 'utf-8');
        console.log('File saved');
    } catch (err) {
        console.error('Failed to save file:', err);
        throw new Error('File save failed');
    }

    return transactions; // Ensure this is the last line before any error handling to make sure you return Transaction[]
}
