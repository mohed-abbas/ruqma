#!/usr/bin/env tsx
/**
 * Sanity CMS Migration Script
 *
 * Migrates existing JSON data (products and testimonials) to Sanity CMS
 * with comprehensive error handling, progress logging, and dry-run support.
 *
 * Usage:
 *   npm run migrate              # Full migration
 *   npm run migrate -- --dry-run # Test without writing to Sanity
 *   npm run migrate -- --backup  # Create backup before migration
 */

import { config } from 'dotenv'
import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'

// Load environment variables from .env.local
config({ path: '.env.local' })

// ============================================================================
// CONFIGURATION
// ============================================================================

const isDryRun = process.argv.includes('--dry-run')
const shouldBackup = process.argv.includes('--backup')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
  apiVersion: '2024-01-01',
})

// ============================================================================
// UTILITIES
// ============================================================================

interface MigrationStats {
  productsProcessed: number
  productsSuccess: number
  productsFailed: number
  testimonialsProcessed: number
  testimonialsSuccess: number
  testimonialsFailed: number
  imagesUploaded: number
  errors: Array<{ type: string; item: string; error: string }>
}

const stats: MigrationStats = {
  productsProcessed: 0,
  productsSuccess: 0,
  productsFailed: 0,
  testimonialsProcessed: 0,
  testimonialsSuccess: 0,
  testimonialsFailed: 0,
  imagesUploaded: 0,
  errors: [],
}

/**
 * Log with color and formatting
 */
function log(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') {
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    error: '\x1b[31m',   // Red
    warning: '\x1b[33m', // Yellow
  }
  const reset = '\x1b[0m'
  const prefix = {
    info: 'ℹ️ ',
    success: '✅',
    error: '❌',
    warning: '⚠️ ',
  }

  console.log(`${colors[type]}${prefix[type]} ${message}${reset}`)
}

/**
 * Create backup of existing JSON files
 */
function createBackup() {
  const backupDir = path.join(process.cwd(), 'data-backup', new Date().toISOString().split('T')[0])

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
  }

  // Backup products
  const productsPath = path.join(process.cwd(), 'data/products/catalog.json')
  const testimonialsPath = path.join(process.cwd(), 'data/content/testimonials.json')

  fs.copyFileSync(
    productsPath,
    path.join(backupDir, 'catalog.json')
  )
  fs.copyFileSync(
    testimonialsPath,
    path.join(backupDir, 'testimonials.json')
  )

  log(`Backup created at: ${backupDir}`, 'success')
  return backupDir
}

/**
 * Upload image to Sanity with error handling
 */
async function uploadImage(imagePath: string, description: string): Promise<string | null> {
  try {
    const fullPath = path.join(process.cwd(), 'public', imagePath)

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      log(`Image not found: ${imagePath}`, 'warning')
      stats.errors.push({
        type: 'image',
        item: imagePath,
        error: 'File not found',
      })
      return null
    }

    if (isDryRun) {
      log(`[DRY RUN] Would upload: ${imagePath}`, 'info')
      return 'mock-image-id'
    }

    const imageBuffer = fs.readFileSync(fullPath)
    const asset = await client.assets.upload('image', imageBuffer, {
      filename: path.basename(imagePath),
    })

    stats.imagesUploaded++
    log(`Uploaded ${description}: ${imagePath}`, 'success')
    return asset._id
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    log(`Failed to upload ${imagePath}: ${errorMessage}`, 'error')
    stats.errors.push({
      type: 'image',
      item: imagePath,
      error: errorMessage,
    })
    return null
  }
}

/**
 * Generate slug from product name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// ============================================================================
// PRODUCT MIGRATION
// ============================================================================

async function migrateProducts() {
  log('\n🛍️  Starting Product Migration...', 'info')

  const productsData = JSON.parse(
    fs.readFileSync('./data/products/catalog.json', 'utf-8')
  )

  for (const product of productsData.products) {
    stats.productsProcessed++

    try {
      log(`\nProcessing product: ${product.name} (${product.model})`, 'info')

      // Upload main image
      const mainImageId = await uploadImage(
        product.imageUrl,
        `main image for ${product.name}`
      )

      if (!mainImageId) {
        throw new Error('Failed to upload main product image')
      }

      // Upload main feature image
      const mainFeatureImageId = await uploadImage(
        product.productDetails.mainFeature.image,
        `main feature image for ${product.name}`
      )

      if (!mainFeatureImageId) {
        throw new Error('Failed to upload main feature image')
      }

      // Upload detail image
      const detailImageId = await uploadImage(
        product.productDetails.detailImage.src,
        `detail image for ${product.name}`
      )

      if (!detailImageId) {
        throw new Error('Failed to upload detail image')
      }

      // Create product document
      const productDocument = {
        _type: 'product',
        name: product.name,
        model: product.model,
        slug: {
          _type: 'slug',
          current: product.slug || generateSlug(product.name),
        },
        description: product.description,
        additionalDescription: product.additionalDescription,
        mainImage: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: mainImageId,
          },
          alt: product.imageAlt,
        },
        showOnHome: product.showOnHome,
        brand: product.brand,
        productDetails: {
          _type: 'object',
          mainFeature: {
            _type: 'object',
            title: product.productDetails.mainFeature.title,
            highlight: product.productDetails.mainFeature.highlight,
            description: product.productDetails.mainFeature.description,
            image: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: mainFeatureImageId,
              },
              alt: product.productDetails.mainFeature.imageAlt,
            },
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          features: product.productDetails.features.map((feature: any) => ({
            _type: 'object',
            _key: feature.id,
            id: feature.id,
            title: feature.title,
            highlight: feature.highlight,
            description: feature.description,
          })),
          detailImage: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: detailImageId,
            },
            alt: product.productDetails.detailImage.alt,
          },
        },
      }

      if (isDryRun) {
        log(`[DRY RUN] Would create product document for: ${product.name}`, 'info')
      } else {
        await client.create(productDocument)
        log(`Created product: ${product.name}`, 'success')
      }

      stats.productsSuccess++
    } catch (error) {
      stats.productsFailed++
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      log(`Failed to migrate product ${product.name}: ${errorMessage}`, 'error')
      stats.errors.push({
        type: 'product',
        item: product.name,
        error: errorMessage,
      })
    }
  }
}

// ============================================================================
// TESTIMONIAL MIGRATION
// ============================================================================

async function migrateTestimonials() {
  log('\n💬 Starting Testimonial Migration...', 'info')

  const testimonialsData = JSON.parse(
    fs.readFileSync('./data/content/testimonials.json', 'utf-8')
  )

  for (const testimonial of testimonialsData.testimonials) {
    stats.testimonialsProcessed++

    try {
      log(`\nProcessing testimonial: ${testimonial.name}`, 'info')

      // Upload avatar
      const avatarId = await uploadImage(
        testimonial.avatar,
        `avatar for ${testimonial.name}`
      )

      if (!avatarId) {
        throw new Error('Failed to upload avatar')
      }

      // Create testimonial document
      const testimonialDocument = {
        _type: 'testimonial',
        name: testimonial.name,
        company: testimonial.company,
        rating: testimonial.rating,
        text: testimonial.text,
        avatar: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: avatarId,
          },
        },
        cardType: testimonial.cardType,
        priority: testimonial.priority || 5,
        date: testimonial.date,
      }

      if (isDryRun) {
        log(`[DRY RUN] Would create testimonial document for: ${testimonial.name}`, 'info')
      } else {
        await client.create(testimonialDocument)
        log(`Created testimonial: ${testimonial.name}`, 'success')
      }

      stats.testimonialsSuccess++
    } catch (error) {
      stats.testimonialsFailed++
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      log(`Failed to migrate testimonial ${testimonial.name}: ${errorMessage}`, 'error')
      stats.errors.push({
        type: 'testimonial',
        item: testimonial.name,
        error: errorMessage,
      })
    }
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function migrate() {
  console.clear()
  log('═'.repeat(60), 'info')
  log('🚀 SANITY CMS MIGRATION SCRIPT', 'info')
  log('═'.repeat(60), 'info')

  // Check environment variables
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    log('Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable', 'error')
    process.exit(1)
  }

  if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
    log('Missing NEXT_PUBLIC_SANITY_DATASET environment variable', 'error')
    process.exit(1)
  }

  if (!isDryRun && !process.env.SANITY_API_TOKEN) {
    log('Missing SANITY_API_TOKEN environment variable', 'error')
    log('This is required for writing to Sanity', 'warning')
    process.exit(1)
  }

  // Display mode
  if (isDryRun) {
    log('\n🔍 DRY RUN MODE - No changes will be made', 'warning')
  } else {
    log('\n⚠️  LIVE MODE - Changes will be written to Sanity', 'warning')
  }

  // Create backup if requested
  if (shouldBackup && !isDryRun) {
    log('\n📦 Creating backup...', 'info')
    createBackup()
  }

  // Start migration
  const startTime = Date.now()

  try {
    await migrateProducts()
    await migrateTestimonials()

    // Print summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)

    log('\n' + '═'.repeat(60), 'info')
    log('📊 MIGRATION SUMMARY', 'info')
    log('═'.repeat(60), 'info')
    log(`\nProducts:`, 'info')
    log(`  Processed: ${stats.productsProcessed}`, 'info')
    log(`  Success: ${stats.productsSuccess}`, 'success')
    log(`  Failed: ${stats.productsFailed}`, stats.productsFailed > 0 ? 'error' : 'info')

    log(`\nTestimonials:`, 'info')
    log(`  Processed: ${stats.testimonialsProcessed}`, 'info')
    log(`  Success: ${stats.testimonialsSuccess}`, 'success')
    log(`  Failed: ${stats.testimonialsFailed}`, stats.testimonialsFailed > 0 ? 'error' : 'info')

    log(`\nImages Uploaded: ${stats.imagesUploaded}`, 'success')
    log(`Duration: ${duration}s`, 'info')

    // Print errors if any
    if (stats.errors.length > 0) {
      log('\n⚠️  ERRORS ENCOUNTERED:', 'warning')
      stats.errors.forEach((error, index) => {
        log(`  ${index + 1}. [${error.type}] ${error.item}: ${error.error}`, 'error')
      })
    }

    log('\n' + '═'.repeat(60), 'info')

    if (isDryRun) {
      log('✅ DRY RUN COMPLETED - Run without --dry-run to execute migration', 'success')
    } else {
      log('✅ MIGRATION COMPLETED', 'success')
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    log(`\n❌ Migration failed: ${errorMessage}`, 'error')
    process.exit(1)
  }
}

// Execute migration
migrate().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
