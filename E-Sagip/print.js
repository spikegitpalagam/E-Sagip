function printVol() {
  // Hide UI elements
  document.querySelector('.vol-search-wrap').style.display = 'none';
  document.querySelector('.vol-filter-row').style.display = 'none';

  // Build a clean print table
  const cards = document.querySelectorAll('.vol-card');

  let tableHTML = `
    <h2 style="color: #800020; margin-bottom: 16px; text-align: center;">E-Sagip Volunteer Database</h2>
    <table style="width:100%; border-collapse:collapse; font-family:Arial; font-size:13px;">
      <thead>
        <tr style="background:#f0f0f0;">
          <th style="border:1px solid #560019; padding:8px;">Name</th>
          <th style="border:1px solid #560019; padding:8px;">Status</th>
          <th style="border:1px solid #560019; padding:8px;">Address</th>
          <th style="border:1px solid #560019; padding:8px;">Contact Number</th>
        </tr>
      </thead>
      <tbody>
  `;

  cards.forEach(card => {
    const name = card.querySelector('.vol-name')?.childNodes[0]?.textContent.trim() || '';
    const status = card.querySelector('.vol-badge')?.textContent.trim() || '';
    const meta = card.querySelector('.vol-meta')?.textContent.trim() || '';

    // Split address and contact by " · "
    const [address, contact] = meta.split(' · ');

    tableHTML += `
      <tr>
        <td style="border:1px solid #560019; padding:8px; font-weight: bold;">${name}</td>
        <td style="border:1px solid #560019; padding:8px;">${status}</td>
        <td style="border:1px solid #560019; padding:8px;">${address || ''}</td>
        <td style="border:1px solid #560019; padding:8px;">${contact || ''}</td>
      </tr>
    `;
  });

  tableHTML += `</tbody></table>`;

   const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head><title>E-Sagip Volenteer Database</title></head>
      <body>${tableHTML}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}

function printLog() {
  const cards = document.querySelectorAll('.recent-op-card');

  let tableHTML = `
    <h2 style="color: #800020; margin-bottom: 16px; text-align: center;">Operation Logs</h2>
    <table style="width:100%; border-collapse:collapse; font-family:Arial; font-size:13px;">
      <thead>
        <tr style="background:#f0f0f0;">
          <th style="border:1px solid #560019; padding:8px;">Title</th>
          <th style="border:1px solid #560019; padding:8px;">Date</th>
          <th style="border:1px solid #560019; padding:8px;">Location</th>
          <th style="border:1px solid #560019; padding:8px;">Volunteers</th>
          <th style="border:1px solid #560019; padding:8px;">Families Helped</th>
        </tr>
      </thead>
      <tbody>
  `;

  cards.forEach(card => {
    const title      = card.querySelector('.recent-op-name')?.textContent.trim() || '';
    const date       = card.querySelector('.recent-op-date')?.textContent.trim() || '';

    // Strip SVG text from location
    const locEl      = card.querySelector('.recent-op-loc');
    const location   = locEl ? [...locEl.childNodes]
                        .filter(n => n.nodeType === Node.TEXT_NODE)
                        .map(n => n.textContent.trim())
                        .filter(Boolean)
                        .join('') : '';

    // Strip SVG text from badges
    const volEl      = card.querySelector('.badge-vol');
    const volunteers = volEl ? [...volEl.childNodes]
                        .filter(n => n.nodeType === Node.TEXT_NODE)
                        .map(n => n.textContent.trim())
                        .filter(Boolean)
                        .join('') : '';

    const famEl      = card.querySelector('.badge-helped');
    const families   = famEl ? [...famEl.childNodes]
                        .filter(n => n.nodeType === Node.TEXT_NODE)
                        .map(n => n.textContent.trim())
                        .filter(Boolean)
                        .join('') : '';

    tableHTML += `
      <tr>
        <td style="border:1px solid #560019; padding:8px;">${title}</td>
        <td style="border:1px solid #560019; padding:8px;">${date}</td>
        <td style="border:1px solid #560019; padding:8px;">${location}</td>
        <td style="border:1px solid #560019; padding:8px;">${volunteers}</td>
        <td style="border:1px solid #560019; padding:8px;">${families}</td>
      </tr>
    `;
  });

  tableHTML += `</tbody></table>`;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head><title>Operation Logs</title></head>
      <body>${tableHTML}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}

function printAdmin() {
  const cards = document.querySelectorAll('.admin-card');

  let tableHTML = `
    <h2 style="color: #800020; margin-bottom: 16px; text-align: center;">Admin List</h2>
    <table style="width:100%; border-collapse:collapse; font-family:Arial; font-size:13px;">
      <thead>
        <tr style="background:#f0f0f0;">
          <th style="border:1px solid #560019; padding:8px;">Name</th>
          <th style="border:1px solid #560019; padding:8px;">Email</th>
          <th style="border:1px solid #560019; padding:8px;">Role</th>
        </tr>
      </thead>
      <tbody>
  `;

  cards.forEach(card => {
    const name  = card.querySelector('.admin-name')?.textContent.trim() || '';
    const email = card.querySelector('.admin-email')?.textContent.trim() || '';
    const role  = card.querySelector('.role-badge')?.textContent.trim() || '';

    tableHTML += `
      <tr>
        <td style="border:1px solid #560019; padding:8px;">${name}</td>
        <td style="border:1px solid #560019; padding:8px;">${email}</td>
        <td style="border:1px solid #560019; padding:8px; text-align:center;">${role}</td>
      </tr>
    `;
  });

  tableHTML += `</tbody></table>`;

   const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head><title>E-Sagip Admin Database</title></head>
      <body>${tableHTML}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}
