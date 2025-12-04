import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export const generateInvoicePDF = async (invoiceData) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const fontSize = 10;
    const titleFontSize = 20;
    const headerFontSize = 12;

    // Helper to draw text
    const drawText = (text, x, y, options = {}) => {
        page.drawText(text, {
            x,
            y,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0),
            ...options,
        });
    };

    // --- Header ---
    page.drawText('INVOICE', {
        x: 50,
        y: height - 50,
        size: titleFontSize,
        font: boldFont,
        color: rgb(0, 0, 0),
    });

    // Company Info (Mock for now, or could be passed in)
    drawText('My Company Name', 50, height - 70, { font: boldFont });
    drawText('123 Business Rd', 50, height - 85);
    drawText('City, State, Zip', 50, height - 100);
    drawText('contact@mycompany.com', 50, height - 115);

    // Invoice Details
    const rightAlignX = width - 50;
    const invoiceNum = invoiceData.invoice_number || 'INV-0000';
    const issueDate = new Date(invoiceData.issue_date).toLocaleDateString();
    const dueDate = new Date(invoiceData.due_date).toLocaleDateString();

    drawText(`Invoice #: ${invoiceNum}`, rightAlignX - 150, height - 70, { font: boldFont });
    drawText(`Date: ${issueDate}`, rightAlignX - 150, height - 85);
    drawText(`Due Date: ${dueDate}`, rightAlignX - 150, height - 100);

    // --- Client Info ---
    const clientY = height - 160;
    drawText('Bill To:', 50, clientY, { font: boldFont });
    drawText(invoiceData.client_id?.name || 'Client Name', 50, clientY - 15);
    drawText(invoiceData.client_id?.email || '', 50, clientY - 30);
    // Add address if available in client object

    // --- Items Table ---
    const tableTop = clientY - 60;
    const col1X = 50; // Description
    const col2X = 300; // Qty
    const col3X = 380; // Rate
    const col4X = 480; // Amount

    // Table Header
    page.drawRectangle({
        x: 40,
        y: tableTop - 5,
        width: width - 80,
        height: 20,
        color: rgb(0.9, 0.9, 0.9),
    });

    drawText('Description', col1X, tableTop, { font: boldFont });
    drawText('Qty', col2X, tableTop, { font: boldFont });
    drawText('Rate', col3X, tableTop, { font: boldFont });
    drawText('Amount', col4X, tableTop, { font: boldFont });

    let currentY = tableTop - 25;

    invoiceData.items.forEach((item) => {
        const amount = item.quantity * item.rate;
        drawText(item.description, col1X, currentY);
        drawText(item.quantity.toString(), col2X, currentY);
        drawText(`$${item.rate.toFixed(2)}`, col3X, currentY);
        drawText(`$${amount.toFixed(2)}`, col4X, currentY);
        currentY -= 20;
    });

    // --- Totals ---
    const totalY = currentY - 20;
    const subtotal = invoiceData.items.reduce((acc, item) => acc + (item.quantity * item.rate), 0);
    // Assuming tax is per item or global? The current code has tax_rate per item but let's just sum it up or simplify for now.
    // The existing Invoices.jsx calculates total on the server or assumes it's passed.
    // Let's recalculate simply for display.

    // Simple calculation matching the UI logic usually found
    const total = invoiceData.total || subtotal;

    page.drawLine({
        start: { x: 350, y: totalY + 15 },
        end: { x: width - 50, y: totalY + 15 },
        thickness: 1,
        color: rgb(0.8, 0.8, 0.8),
    });

    drawText('Total:', 380, totalY, { font: boldFont, size: 12 });
    drawText(`$${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 480, totalY, { font: boldFont, size: 12 });

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
};
