import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'
import Papa from 'papaparse'

const BASE_URL = 'https://shreeradhemarbles.in'

interface BlogRow {
  slug: string
  updatedAt: string
}

interface ProductRow {
  id: string
  createdAt: string
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    '/about',
    '/blogs',
    '/contact',
    '/products',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic Blog Routes
  let blogRoutes: MetadataRoute.Sitemap = []
  try {
    const blogsPath = path.join(process.cwd(), 'data', 'blogs.csv')
    if (fs.existsSync(blogsPath)) {
      const fileContent = fs.readFileSync(blogsPath, 'utf-8')
      const parsed = Papa.parse<BlogRow>(fileContent, {
        header: true,
        skipEmptyLines: true,
      })
      blogRoutes = parsed.data.map((blog) => ({
        url: `${BASE_URL}/blogs/${blog.slug}`,
        lastModified: new Date(blog.updatedAt || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    }
  } catch (error) {
    console.error('Error generating blog sitemap:', error)
  }

  // Dynamic Product Routes
  let productRoutes: MetadataRoute.Sitemap = []
  try {
    const productsPath = path.join(process.cwd(), 'data', 'products.csv')
    if (fs.existsSync(productsPath)) {
      const fileContent = fs.readFileSync(productsPath, 'utf-8')
      const parsed = Papa.parse<ProductRow>(fileContent, {
        header: true,
        skipEmptyLines: true,
      })
      productRoutes = parsed.data.map((product) => ({
        url: `${BASE_URL}/products/${product.id}`,
        lastModified: new Date(product.createdAt || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    }
  } catch (error) {
    console.error('Error generating product sitemap:', error)
  }

  return [...staticRoutes, ...blogRoutes, ...productRoutes]
}
