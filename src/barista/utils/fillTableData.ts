export function fillTableData(table: HTMLTableElement): void {
  let th = Array.prototype.slice.call(table.querySelectorAll('th'));
  if (!th.length) {
    th = Array.prototype.slice.call(table.querySelectorAll('thead td'));
  }
  const header = th.map(el => el.textContent);
  const tr = table.querySelectorAll('tr');
  tr.forEach(row => {
    const td = row.querySelectorAll('td');
    td.forEach((cell, i) => cell.setAttribute('data-th', header[i]));
  });
}
