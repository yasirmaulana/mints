// Import kategori & subkategori dari kategori.md (TSV: "kategori<TAB>Nama" / "subkategori<TAB>Nama").
// Aman dijalankan berkali-kali (upsert by slug). Kategori lama yang belum punya induk dipindah
// jadi subkategori "Fashion Muslim" (atau digabung bila namanya sama dengan subkategori hasil seed).
import { readFileSync } from 'node:fs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const LEGACY_PARENT = 'Fashion Muslim'

const slugify = (s) => s.toLowerCase().replace(/&/g, ' dan ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

function parse(file) {
  const tree = []
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const [type, name] = line.split('\t').map(s => s?.trim())
    if (!type || !name) continue
    if (type === 'kategori') tree.push({ name, children: [] })
    else if (type === 'subkategori' && tree.length) tree.at(-1).children.push(name)
    else console.warn('Baris dilewati:', line)
  }
  return tree
}

async function main() {
  const tree = parse(new URL('../kategori.md', import.meta.url))
  const parentNames = new Set(tree.map(p => p.name))
  let subCount = 0

  for (const p of tree) {
    const pSlug = slugify(p.name)
    const parent = await prisma.category.upsert({
      where: { slug: pSlug },
      create: { name: p.name, slug: pSlug },
      update: { name: p.name, parentId: null }
    })
    for (const name of p.children) {
      const slug = `${pSlug}-${slugify(name)}`
      await prisma.category.upsert({
        where: { slug },
        create: { name, slug, parentId: parent.id },
        update: { name, parentId: parent.id }
      })
      subCount++
    }
  }
  console.log(`✓ ${tree.length} kategori, ${subCount} subkategori`)

  // Kategori lama (tanpa induk, bukan salah satu induk baru) → bawah Fashion Muslim
  const fm = await prisma.category.findUnique({ where: { slug: slugify(LEGACY_PARENT) } })
  if (!fm) return
  const legacy = await prisma.category.findMany({ where: { parentId: null, name: { notIn: [...parentNames] } } })
  for (const c of legacy) {
    const twin = await prisma.category.findFirst({ where: { parentId: fm.id, name: { equals: c.name, mode: 'insensitive' } } })
    if (twin) {
      await prisma.product.updateMany({ where: { categoryId: c.id }, data: { categoryId: twin.id } })
      await prisma.category.delete({ where: { id: c.id } })
      console.log(`✓ "${c.name}" digabung ke ${LEGACY_PARENT} › ${twin.name}`)
    } else {
      await prisma.category.update({ where: { id: c.id }, data: { parentId: fm.id, slug: `${fm.slug}-${slugify(c.name)}` } })
      console.log(`✓ "${c.name}" dipindah ke ${LEGACY_PARENT}`)
    }
  }
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
