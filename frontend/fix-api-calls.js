const fs = require('fs');

const filePath = 'app/dashboard/admin/classes/page.tsx';

// Đọc file
let content = fs.readFileSync(filePath, 'utf8');

// Sửa dashboard stats call
content = content.replace(
  /const response = await fetch\(`\${process\.env\.NEXT_PUBLIC_API_URL \|\| "http:\/\/localhost:8000\/api\/v1"}\/classes\/analytics\/dashboard`, \{\s*credentials: 'include'\s*\}\);[\s]*const data = await response\.json\(\);/g,
  'const data = await apiRequest(\'/classes/analytics/dashboard\');'
);

// Sửa bulk operations call
content = content.replace(
  /const response = await fetch\('\/classes\/bulk-operations', \{[\s\S]*?\}\);/g,
  `const response = await fetch(\`\${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/classes/bulk-operations\`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: operation.type,
          class_ids: selectedClasses,
          data: operation.data
        })
      });`
);

// Sửa export call
content = content.replace(
  /const response = await fetch\(`\/classes\/export\/excel\?\${queryString}\`\);/g,
  'const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/classes/export/excel?${queryString}`, { credentials: \'include\' });'
);

// Sửa import call
content = content.replace(
  /const response = await fetch\('\/classes\/import\/excel', \{[\s\S]*?\}\);/g,
  `const response = await fetch(\`\${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/classes/import/excel\`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });`
);

// Sửa template download call
content = content.replace(
  /const response = await fetch\('\/classes\/template\/excel'\);/g,
  'const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/classes/template/excel`, { credentials: \'include\' });'
);

// Ghi lại file
fs.writeFileSync(filePath, content);

console.log('✅ Đã sửa tất cả API calls trong page.tsx'); 