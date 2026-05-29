/**
 * 通用 Excel 导出工具
 * 依赖：SheetJS (xlsx)
 */
import * as XLSX from 'xlsx';

/**
 * @param {Array}  data      行数据数组（对象数组）
 * @param {Array}  columns   列定义 [{ title: '列头', dataIndex: 'key' }, ...]
 * @param {string} filename  文件名（不含扩展名）
 */
export function exportToExcel(data, columns, filename = 'export') {
  // 1. 过滤掉"操作"列
  const exportCols = columns.filter(
    (col) => col.dataIndex && col.title && col.title !== '操作',
  );

  // 2. 构建表头行
  const header = exportCols.map((col) => col.title);

  // 3. 构建数据行
  const rows = data.map((row) =>
    exportCols.map((col) => {
      const val = row[col.dataIndex];
      // 如果列定义了自定义 render，优先尝试取原始值（导出不渲染 JSX）
      if (val === null || val === undefined) return '';
      return val;
    }),
  );

  // 4. 合并 header + rows → worksheet
  const wsData = [header, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // 5. 自动列宽（按内容最大字符数估算）
  const colWidths = header.map((h, i) => {
    const maxLen = Math.max(
      h.length * 2,
      ...rows.map((r) => String(r[i] ?? '').length),
    );
    return { wch: Math.min(maxLen + 4, 60) };
  });
  ws['!cols'] = colWidths;

  // 6. 写入 workbook 并触发下载
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, `${filename}_${formatDateForFile()}.xlsx`);
}

function formatDateForFile() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}
