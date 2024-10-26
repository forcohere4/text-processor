const express = require('express');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.text({ type: 'text/html' })); // Accept HTML as plain text

// POST route to receive HTML and generate PDF
app.post('/generate-pdf', async (req, res) => {
    const htmlContent = req.body;

    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        // Apply inline styles to markers directly
        await page.evaluate(() => {
            document.querySelectorAll('.marker-yellow').forEach(el => el.style.backgroundColor = '#FFFF99'); // Light yellow
            document.querySelectorAll('.marker-green').forEach(el => el.style.backgroundColor = '#CCFFCC');  // Light green
            document.querySelectorAll('.marker-pink').forEach(el => el.style.backgroundColor = '#FFCCEB');   // Light pink
            document.querySelectorAll('.marker-blue').forEach(el => el.style.backgroundColor = '#CCFFFF');    // Light cyan
            document.querySelectorAll('.pen-red').forEach(el => {
                el.style.color = 'red';
                el.style.backgroundColor = 'transparent';  // Make the background transparent
            });
            
            document.querySelectorAll('.pen-green').forEach(el => {
                el.style.color = 'green';
                el.style.backgroundColor = 'transparent';  // Make the background transparent
            });
        });

        // Add custom CSS for text colors and table styling without affecting existing backgrounds
        await page.addStyleTag({
            content: `
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid black; padding: 8px; }
                
                /* Hide editor-specific elements to remove artifacts */
                .ck-widget__selection-handle,
                .ck-widget__type-around,
                .ck-icon__selected-indicator,
                .ck-table-column-resizer {
                    display: none !important;
                }
            `,
        });

        // Remove unwanted editor artifacts from the DOM before generating the PDF
        await page.evaluate(() => {
            document.querySelectorAll('.ck-widget__selection-handle, .ck-widget__type-around, .ck-icon__selected-indicator, .ck-table-column-resizer').forEach(el => el.remove());
        });

        // Generate PDF with background colors enabled
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        // Set headers and send PDF as response
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