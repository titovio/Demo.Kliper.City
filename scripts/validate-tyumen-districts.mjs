import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const file = path.resolve(here, '../js/data/tyumen-districts.json');
const payload = JSON.parse(fs.readFileSync(file, 'utf8'));
const errors = [];
const ids = new Set();
const slugs = new Set();
const validGroups = new Set(['newDistrict', 'establishedDistrict']);
const validAdmins = new Set(['Восточный', 'Калининский', 'Ленинский', 'Центральный']);

for (const [index, item] of payload.districts.entries()) {
  const at = `districts[${index}]`;
  for (const field of ['id','slug','name','catalogGroup','administrativeDistrict','status','description']) {
    if (!item[field]) errors.push(`${at}: missing ${field}`);
  }
  if (ids.has(item.id)) errors.push(`${at}: duplicate id ${item.id}`);
  if (slugs.has(item.slug)) errors.push(`${at}: duplicate slug ${item.slug}`);
  ids.add(item.id); slugs.add(item.slug);
  if (!validGroups.has(item.catalogGroup)) errors.push(`${at}: invalid catalogGroup ${item.catalogGroup}`);
  if (!validAdmins.has(item.administrativeDistrict)) errors.push(`${at}: invalid administrativeDistrict ${item.administrativeDistrict}`);
}
for (const item of payload.districts) {
  if (item.parentDistrictId && !ids.has(item.parentDistrictId)) errors.push(`${item.id}: missing parent ${item.parentDistrictId}`);
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
const counts = payload.districts.reduce((acc, item) => ((acc[item.catalogGroup] = (acc[item.catalogGroup] || 0) + 1), acc), {});
console.log(`OK: ${payload.districts.length} districts`, counts);
