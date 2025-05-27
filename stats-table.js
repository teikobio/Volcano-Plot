// stats-table.js
import { processData } from './data-processor.js';

export function renderStatsTable(container, dataset) {
  // Process the data using the shared processor
  const statsData = processData(dataset);

  // Create table HTML
  const tableHTML = `
    <div class="stats-table-container">
      <div class="table-controls">
        <button class="export-btn" id="stats-export-csv">Export CSV</button>
        <button class="export-btn" id="stats-export-json">Export JSON</button>
      </div>
      <table class="stats-table">
        <thead>
          <tr>
            <th data-sort="area">Area</th>
            <th data-sort="type">Type</th>
            <th data-sort="effectSize">Effect Size (%)</th>
            <th data-sort="log2FoldChange">log₂ FC</th>
            <th data-sort="avgPriceOct2022">Avg Price Oct 2022</th>
            <th data-sort="avgPriceMay2025">Avg Price May 2025</th>
            <th data-sort="pValue">p-value</th>
            <th data-sort="negLogP">-log₁₀(p)</th>
            <th data-sort="sampleSize">Sample Size</th>
            <th data-sort="significant">Significant</th>
          </tr>
        </thead>
        <tbody>
          ${statsData.map(row => `
            <tr class="${row.significant ? 'significant' : ''}">
              <td>${row.area}</td>
              <td>${row.type}</td>
              <td>${row.effectSize.toFixed(2)}%</td>
              <td>${row.log2FoldChange.toFixed(3)}</td>
              <td>$${row.avgPriceOct2022.toLocaleString()}</td>
              <td>$${row.avgPriceMay2025.toLocaleString()}</td>
              <td>${row.pValue.toExponential(4)}</td>
              <td>${row.negLogP.toFixed(3)}</td>
              <td>${row.sampleSize}</td>
              <td>${row.significant ? 'Yes' : 'No'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  // Add styles
  const styles = `
    <style>
      .stats-table-container {
        overflow-x: auto; /* Enable horizontal scroll */
        max-width: 682px; /* Ensure it doesn't overflow the article width */
        margin: 0 auto; /* Center the container */
        background: #202028;
        border-radius: 12px;
        /* padding: 24px; Adjusted below */
        padding: 16px; /* Reduced padding for smaller screens */
        color: #fff;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      .table-controls {
        margin-bottom: 12px; /* Reduced margin */
        text-align: right;
      }
      .export-btn {
        background: #2c3e50;
        color: #fff;
        border: none;
        padding: 6px 10px; /* Reduced padding */
        border-radius: 6px;
        font-size: 11px; /* Reduced font size */
        font-weight: 600;
        cursor: pointer;
        margin-left: 8px;
        transition: background 0.2s;
      }
      .export-btn:hover {
        background: #34495e;
      }
      .stats-table {
        min-width: 800px; /* Set a min-width so columns don't collapse too much */
        width: 100%;
        border-collapse: collapse;
        font-size: 13px; /* Reduced base font size */
      }
      .stats-table th {
        background: #2c3e50;
        padding: 10px 8px; /* Reduced padding */
        text-align: left;
        font-weight: 600;
        cursor: pointer;
        user-select: none;
        white-space: nowrap; /* Prevent header text from wrapping */
      }
      .stats-table th:hover {
        background: #34495e;
      }
      .stats-table td {
        padding: 10px 8px; /* Reduced padding */
        border-bottom: 1px solid #444;
        white-space: nowrap; /* Prevent cell text from wrapping */
      }
      .stats-table tr:hover {
        background: #2c3e50;
      }
      .stats-table tr.significant {
        background: rgba(76, 255, 143, 0.1);
      }
      .stats-table tr.significant:hover {
        background: rgba(76, 255, 143, 0.2);
      }
      .table-scroll-hint {
        font-size: 11px; /* Smaller font for the hint */
        color: #aaa;
        text-align: right;
        margin: 0 8px 4px 0;
        display: block; /* Make it a block to take up width */
      }

      /* Media queries for further responsiveness */
      @media (max-width: 768px) { /* Adjust breakpoint as needed */
        .stats-table {
          font-size: 12px;
          min-width: 700px; /* Adjust min-width for smaller screens */
        }
        .stats-table th,
        .stats-table td {
          padding: 8px 6px;
        }
        .export-btn {
          font-size: 10px;
          padding: 5px 8px;
        }
        .stats-table-container {
            padding: 12px;
        }
      }
      @media (max-width: 600px) {
        .stats-table {
          font-size: 11px;
          min-width: 600px;
        }
         .stats-table th,
        .stats-table td {
          padding: 6px 4px;
        }
        /* Optionally hide less critical columns on very small screens */
        /* For example, hide log2FC and Sample Size */
        .stats-table th:nth-child(4),
        .stats-table td:nth-child(4),
        .stats-table th:nth-child(9),
        .stats-table td:nth-child(9) {
          /* display: none; */ /* Uncomment to hide */
        }
      }
    </style>
  `;

  // Add table and styles to container, including the scroll hint
  container.innerHTML = styles +
    (container.offsetWidth < 800 ? '<span class="table-scroll-hint">Scroll right to see more columns &rarr;</span>' : '') +
    tableHTML;

  // Add sorting functionality
  const table = container.querySelector('.stats-table');
  const headers = table.querySelectorAll('th');
  
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const sortKey = header.dataset.sort;
      const currentDirection = header.dataset.direction === 'asc' ? 'desc' : 'asc';
      
      // Reset all headers
      headers.forEach(h => h.dataset.direction = '');
      header.dataset.direction = currentDirection;
      
      // Sort the data
      statsData.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        const direction = currentDirection === 'asc' ? 1 : -1;
        
        if (typeof aVal === 'string') {
          return direction * aVal.localeCompare(bVal);
        }
        return direction * (aVal - bVal);
      });
      
      // Update table
      const tbody = table.querySelector('tbody');
      tbody.innerHTML = statsData.map(row => `
        <tr class="${row.significant ? 'significant' : ''}">
          <td>${row.area}</td>
          <td>${row.type}</td>
          <td>${row.effectSize.toFixed(2)}%</td>
          <td>${row.log2FoldChange.toFixed(3)}</td>
          <td>$${row.avgPriceOct2022.toLocaleString()}</td>
          <td>$${row.avgPriceMay2025.toLocaleString()}</td>
          <td>${row.pValue.toExponential(4)}</td>
          <td>${row.negLogP.toFixed(3)}</td>
          <td>${row.sampleSize}</td>
          <td>${row.significant ? 'Yes' : 'No'}</td>
        </tr>
      `).join('');
    });
  });

  // Add export functionality
  document.getElementById('stats-export-csv').addEventListener('click', () => {
    const headers = ['Area', 'Type', 'Effect Size (%)', 'log₂ FC', 'Avg Price Oct 2022', 
                    'Avg Price May 2025', 'p-value', '-log₁₀(p)', 'Sample Size', 'Significant'];
    const csvContent = [
      headers.join(','),
      ...statsData.map(row => [
        row.area,
        row.type,
        row.effectSize.toFixed(2),
        row.log2FoldChange.toFixed(3),
        row.avgPriceOct2022,
        row.avgPriceMay2025,
        row.pValue.toExponential(4),
        row.negLogP.toFixed(3),
        row.sampleSize,
        row.significant ? 'Yes' : 'No'
      ].join(','))
    ].join('\n');
    
    downloadFile(csvContent, 'stats-table.csv', 'text/csv');
  });

  document.getElementById('stats-export-json').addEventListener('click', () => {
    const jsonContent = JSON.stringify(statsData, null, 2);
    downloadFile(jsonContent, 'stats-table.json', 'application/json');
  });
}

function downloadFile(content, filename, contentType) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
} 