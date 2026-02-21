const fetch = require('node-fetch');

async function testReminder() {
    const payload = {
        borrowerEmail: 'jeelnandha52@gmail.com',
        borrowerName: 'Rahul borrower',
        lenderName: 'Jeel Lender',
        lenderUPI: 'jeel@oksbi',
        amount: '1500',
        agreementId: '65d8a9e2b1c2d3e4f5a6b7c8'
    };

    try {
        console.log('Testing Send Reminder API...');
        const response = await fetch('http://localhost:3000/api/send-reminder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(data, null, 2));

        if (data.success) {
            console.log('SUCCESS: API route works as expected.');
            console.log('UPI Link generated:', data.data.upiLink);
            console.log('QR Code generated (truncated):', data.data.qrCodeDataUrl.substring(0, 50) + '...');
        } else {
            console.log('FAILED:', data.error);
        }
    } catch (error) {
        console.error('Error during test:', error);
    }
}

testReminder();
