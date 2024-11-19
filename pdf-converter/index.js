const express = require('express');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors());
app.use(bodyParser.text({ type: 'text/html', limit: '50mb' }));

function getISTTimestamp() {
    const now = new Date();
    const istOffset = 330;
    const localTime = new Date(now.getTime() + istOffset * 60 * 1000);

    const day = localTime.getUTCDate().toString().padStart(2, '0');
    const month = (localTime.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = localTime.getUTCFullYear();
    const hours = localTime.getUTCHours().toString().padStart(2, '0');
    const minutes = localTime.getUTCMinutes().toString().padStart(2, '0');
    const seconds = localTime.getUTCSeconds().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

app.post('/generate-pdf', async (req, res) => {
    const htmlContent = req.body;
    const orientation = req.query.orientation || 'portrait';
    const author = req.query.author || '';

    try {
        const browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        await page.setViewport({
            width: orientation === 'landscape' ? 1687 : 1192,
            height: orientation === 'landscape' ? 1192 : 1687,
        });

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        await page.evaluate(() => {
            document.querySelectorAll('figure').forEach(fig => fig.style.width = '');
        });

        await page.evaluate(() => {
            document.querySelectorAll('.marker-yellow').forEach(el => el.style.backgroundColor = '#FFFF99');
            document.querySelectorAll('.marker-green').forEach(el => el.style.backgroundColor = '#CCFFCC');
            document.querySelectorAll('.marker-pink').forEach(el => el.style.backgroundColor = '#FFCCEB');
            document.querySelectorAll('.marker-blue').forEach(el => el.style.backgroundColor = '#CCFFFF');
            document.querySelectorAll('.pen-red').forEach(el => {
                el.style.color = 'red';
                el.style.backgroundColor = 'transparent';
            });
            document.querySelectorAll('.pen-green').forEach(el => {
                el.style.color = 'green';
                el.style.backgroundColor = 'transparent';
            });
        });

        await page.addStyleTag({
            content: `
                @page {
                    margin-bottom: 12mm;
                    margin-top: 3mm;
                    size: ${orientation === 'landscape' ? 'A4 landscape' : 'A4 portrait'};
                }
                
                body {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    box-sizing: border-box;
                }

                .content-wrapper {
                    box-sizing: border-box;
                    width: 100%;
                }
                
                table { 
                    table-layout: fixed !important; 
                    border-collapse: collapse !important; 
                    width: 100% !important;
                    max-width: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
                
                th, td { 
                    border: 1px solid black; 
                    word-wrap: break-word;
                    word-break: break-word;
                    white-space: normal;
                    overflow: hidden;
                }
                
                th { 
                    background-color: #f2f2f2;
                }

                ${orientation === 'landscape' ? `
                    table td:nth-child(1), table th:nth-child(1) { width: 3% !important; }
                    table td:nth-child(2), table th:nth-child(2) { width: 4% !important; }
                    table td:nth-child(3), table th:nth-child(3) { width: 21% !important; }
                    table td:nth-child(4), table th:nth-child(4) { width: 56% !important; }
                    table td:nth-child(5), table th:nth-child(5) { width: 8% !important; }
                    table td:nth-child(6), table th:nth-child(6) { width: 8% !important; }
                ` : `
                    table td:nth-child(1), table th:nth-child(1) { width: 5% !important; }
                    table td:nth-child(2), table th:nth-child(2) { width: 5% !important; }
                    table td:nth-child(3), table th:nth-child(3) { width: 23% !important; }
                    table td:nth-child(4), table th:nth-child(4) { width: 47% !important; }
                    table td:nth-child(5), table th:nth-child(5) { width: 10% !important; }
                    table td:nth-child(6), table th:nth-child(6) { width: 10% !important; }
                `}
            `,
        });

        await page.evaluate((orientation) => {
            const table = document.querySelector('table');
            if (table) {
                const existingColgroup = table.querySelector('colgroup');
                if (existingColgroup) {
                    existingColgroup.remove();
                }

                const colgroup = document.createElement('colgroup');
                const widths = orientation === 'landscape' 
                    ? [3, 4, 21, 56, 8, 8]
                    : [5, 5, 23, 47, 10, 10];

                widths.forEach(width => {
                    const col = document.createElement('col');
                    col.style.width = width + '%';
                    colgroup.appendChild(col);
                });

                table.insertBefore(colgroup, table.firstChild);
            }
        }, orientation);

        await page.evaluate(() => {
            const body = document.body;
            const wrapper = document.createElement('div');
            wrapper.className = 'content-wrapper';
            while (body.firstChild) {
                wrapper.appendChild(body.firstChild);
            }
            body.appendChild(wrapper);
        });

        await page.evaluate(() => {
            document.querySelectorAll('.ck-widget__selection-handle, .ck-fake-selection-container, .ck-widget__type-around, .ck-icon__selected-indicator, .ck-table-column-resizer').forEach(el => el.remove());
        });

        const timestamp = getISTTimestamp();

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
            landscape: orientation === 'landscape',
            displayHeaderFooter: true,
            footerTemplate: `
                <div style="font-size:10px; width:100%; padding:0 10mm; position:relative; box-sizing: border-box;">
                    <span style="float:left;">${timestamp}</span>
                    <span style="float:right;">${author ? author : ''}</span>
                    <span style="position:absolute; left:50%; transform:translateX(-50%);">Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
                </div>
            `,
            headerTemplate: '<div></div>',
        });

        await browser.close();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfBuffer.length,
        });
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
});

app.post('/generate-pdf-merge', async (req, res) => {
    const htmlContent = req.body;
    const orientation = req.query.orientation || 'portrait';
    const author = req.query.author || '';

    try {
        const browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        await page.setViewport({
            width: orientation === 'landscape' ? 1687 : 1192,
            height: orientation === 'landscape' ? 1192 : 1687,
        });

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        await page.evaluate(() => {
            document.querySelectorAll('figure').forEach(fig => fig.style.width = '');
        });

        await page.evaluate(() => {
            document.querySelectorAll('.marker-yellow').forEach(el => el.style.backgroundColor = '#FFFF99');
            document.querySelectorAll('.marker-green').forEach(el => el.style.backgroundColor = '#CCFFCC');
            document.querySelectorAll('.marker-pink').forEach(el => el.style.backgroundColor = '#FFCCEB');
            document.querySelectorAll('.marker-blue').forEach(el => el.style.backgroundColor = '#CCFFFF');
            document.querySelectorAll('.pen-red').forEach(el => {
                el.style.color = 'red';
                el.style.backgroundColor = 'transparent';
            });
            document.querySelectorAll('.pen-green').forEach(el => {
                el.style.color = 'green';
                el.style.backgroundColor = 'transparent';
            });
        });

        await page.addStyleTag({
            content: `
                @page {
                    margin-bottom: 12mm;
                    margin-top: 3mm;
                    size: ${orientation === 'landscape' ? 'A4 landscape' : 'A4 portrait'};
                }
                
                body {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    box-sizing: border-box;
                }

                .content-wrapper {
                    box-sizing: border-box;
                    width: 100%;
                }
                
                table { 
                    table-layout: fixed !important; 
                    border-collapse: collapse !important; 
                    width: 100% !important;
                    max-width: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
                
                th, td { 
                    border: 1px solid black; 
                    word-wrap: break-word;
                    word-break: break-word;
                    white-space: normal;
                    overflow: hidden;
                }
                
                th { 
                    background-color: #f2f2f2;
                }

                ${orientation === 'landscape' ? `
                    table td:nth-child(1), table th:nth-child(1) { width: 3% !important; }
                    table td:nth-child(2), table th:nth-child(2) { width: 4% !important; }
                    table td:nth-child(3), table th:nth-child(3) { width: 21% !important; }
                    table td:nth-child(4), table th:nth-child(4) { width: 56% !important; }
                    table td:nth-child(5), table th:nth-child(5) { width: 8% !important; }
                    table td:nth-child(6), table th:nth-child(6) { width: 8% !important; }
                ` : `
                    table td:nth-child(1), table th:nth-child(1) { width: 5% !important; }
                    table td:nth-child(2), table th:nth-child(2) { width: 5% !important; }
                    table td:nth-child(3), table th:nth-child(3) { width: 23% !important; }
                    table td:nth-child(4), table th:nth-child(4) { width: 47% !important; }
                    table td:nth-child(5), table th:nth-child(5) { width: 10% !important; }
                    table td:nth-child(6), table th:nth-child(6) { width: 10% !important; }
                `}
            `,
        });

        await page.evaluate((orientation) => {
            const table = document.querySelector('table');
            if (table) {
                const existingColgroup = table.querySelector('colgroup');
                if (existingColgroup) {
                    existingColgroup.remove();
                }

                const colgroup = document.createElement('colgroup');
                const widths = orientation === 'landscape' 
                    ? [3, 4, 21, 56, 8, 8]
                    : [5, 5, 23, 47, 10, 10];

                widths.forEach(width => {
                    const col = document.createElement('col');
                    col.style.width = width + '%';
                    colgroup.appendChild(col);
                });

                table.insertBefore(colgroup, table.firstChild);
            }
        }, orientation);

        await page.evaluate(() => {
            const body = document.body;
            const wrapper = document.createElement('div');
            wrapper.className = 'content-wrapper';
            while (body.firstChild) {
                wrapper.appendChild(body.firstChild);
            }
            body.appendChild(wrapper);
        });

        await page.evaluate(() => {
            document.querySelectorAll('.ck-widget__selection-handle, .ck-fake-selection-container, .ck-widget__type-around, .ck-icon__selected-indicator, .ck-table-column-resizer').forEach(el => el.remove());
        });

        const timestamp = getISTTimestamp();

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '0mm', bottom: '11mm', left: '5mm', right: '5mm' },
            landscape: orientation === 'landscape',
            displayHeaderFooter: true,
            footerTemplate: `
                <div style="font-size:10px; width:100%; padding:0 10mm; position:relative; box-sizing: border-box;">
                    <span style="float:left;">${timestamp}</span>
                    <span style="float:right;">${author ? author : ''}</span>
                    <span style="position:absolute; left:50%; transform:translateX(-50%);">Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
                </div>
            `,
            headerTemplate: '<div></div>',
        });

        await browser.close();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfBuffer.length,
        });
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
