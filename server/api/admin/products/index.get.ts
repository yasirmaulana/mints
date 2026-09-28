import { sortVariants } from '~~/shared/utils/product-sizes'

export default defineEventHandler(async (event) => {
  const { categoryId, productType, status, search } = getQuery(event)

  const where: Record<string, any> = {}
  if (categoryId) where.categoryId = String(categoryId)
  if (productType) where.productType = String(productType)
  if (status) where.status = String(status)
  if (search) where.title = { contains: String(search), mode: 'insensitive' }

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      variants: true
    }
  })
  return products.map(p => ({ ...p, variants: sortVariants(p.variants) }))
})
