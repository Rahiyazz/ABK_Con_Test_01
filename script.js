let workCounter = 0;
const workTableBody = document.querySelector('#workTable tbody');

function evaluateExpression(expression) {
    try {
        return Function(`'use strict'; return (${expression})`)();
    } catch {
        alert('Invalid expression entered. Please correct it.');
        return null;
    }
}

function addWorkArea() {
    const workArea = document.getElementById('workArea').value;
    const category = document.getElementById('category').value;
    const unit = document.getElementById('unit').value;
    const nos = parseFloat(document.getElementById('nos').value) || 0;
    const lengthExpression = document.getElementById('length').value;
    const widthExpression = document.getElementById('widthHeight').value;

    const length = evaluateExpression(lengthExpression);
    const widthHeight = evaluateExpression(widthExpression);
    const selectedUnit = document.querySelector('input[name="unit"]:checked').value;

    if (!workArea || !category || !unit || isNaN(nos) || length === null || widthHeight === null) {
        alert('Please fill in all fields with valid data.');
        return;
    }

    const fixingSFT = unit === 'SFT' ? nos * length * widthHeight : 0;
    const fixingRFT = unit === 'RFT' ? nos * length : 0;

    workCounter++;

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${workCounter}</td>
        <td>${workArea}</td>
        <td>${category}</td>
        <td>${unit}</td>
        <td>${nos.toFixed(2)}</td>
        <td>${lengthExpression} = ${length.toFixed(2)} (${selectedUnit})</td>
        <td>${widthExpression} = ${widthHeight.toFixed(2)} (${selectedUnit})</td>
        <td>${fixingSFT.toFixed(2)}</td>
        <td>${fixingRFT.toFixed(2)}</td>
    `;

    workTableBody.appendChild(row);
    resetForm();
}

function resetForm() {
    document.getElementById('workArea').value = '';
    document.getElementById('category').value = '';
    document.getElementById('unit').value = '';
    document.getElementById('nos').value = '';
    document.getElementById('length').value = '';
    document.getElementById('widthHeight').value = '';
    document.querySelector('input[name="unit"][value="Feet"]').checked = true;
}

function viewData() {
    const newWindow = window.open();
    newWindow.document.write('<html><head><title>Work Area Data</title><style>body { font-family: Arial, sans-serif; margin: 20px; } table { width: 100%; border-collapse: collapse; margin-top: 20px; } table, th, td { border: 1px solid #ccc; } th { background-color: #4CAF50; color: white; } tr:nth-child(even) { background-color: #f2f2f2; } tr:nth-child(odd) { background-color: #ffffff; } td { color: #333; }</style></head><body><h1>Work Area Data</h1><table><thead><tr><th>S.No</th><th>Work Area</th><th>Work Category Description</th><th>Unit</th><th>Qty/No.s</th><th>Length (Details)</th><th>Width/Height (Details)</th><th>Fixing SFT</th><th>Fixing RFT</th></tr></thead><tbody>');
    const rows = workTableBody.querySelectorAll('tr');
    rows.forEach((row) => {
        const cols = row.querySelectorAll('td');
        newWindow.document.write('<tr>');
        cols.forEach((col) => {
            newWindow.document.write(`<td>${col.textContent}</td>`);
        });
        newWindow.document.write('</tr>');
    });
    newWindow.document.write('</tbody></table></body></html>');
}

function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text('Work Area Measurements', 10, 10);

    const tableData = [];
    const rows = workTableBody.querySelectorAll('tr');
    rows.forEach((row) => {
        const cols = row.querySelectorAll('td');
        const rowData = Array.from(cols).map(col => col.textContent);
        tableData.push(rowData);
    });

    doc.autoTable({
        head: [['S.No', 'Work Area', 'Category', 'Unit', 'Qty/No.s', 'Length (Details)', 'Width/Height (Details)', 'Fixing SFT', 'Fixing RFT']],
        body: tableData,
        startY: 20,
        styles: { lineColor: [0, 0, 0], lineWidth: 0.5 }
    });

    doc.save('work_area_measurements.pdf');
}

function exportToExcel() {
    const rows = workTableBody.querySelectorAll('tr');
    const tableData = [];

    rows.forEach((row) => {
        const cols = row.querySelectorAll('td');
        const rowData = Array.from(cols).map(col => col.textContent);
        tableData.push(rowData);
    });

    const ws = XLSX.utils.aoa_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Work Area Measurements');
    XLSX.writeFile(wb, 'work_area_measurements.xlsx');
}

function openExportPopup() {
    document.getElementById('popup-background').style.display = 'flex';
}

function closeExportPopup() {
    document.getElementById('popup-background').style.display = 'none';
}

function exportSummary() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text('Work Area Summary', 10, 10);

    const summaryData = [];
    const rows = workTableBody.querySelectorAll('tr');
    rows.forEach((row, index) => {
        const cols = row.querySelectorAll('td');
        const summaryRow = [cols[0].textContent, cols[1].textContent, cols[2].textContent];
        summaryData.push(summaryRow);
    });

    doc.autoTable({
        head: [['S.No', 'Work Area', 'Work Category Description']],
        body: summaryData,
        startY: 20,
        styles: { lineColor: [0, 0, 0], lineWidth: 0.5 }
    });

    doc.save('work_area_summary.pdf');
}
