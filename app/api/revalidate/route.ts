/**
 * Sanity Webhook Revalidation API
 *
 * This endpoint receives webhook notifications from Sanity and triggers
 * on-demand revalidation of Next.js pages when content changes.
 *
 * Setup in Sanity:
 * 1. Go to Sanity Manage → API → Webhooks
 * 2. Create webhook pointing to: https://your-domain.com/api/revalidate?secret=YOUR_SECRET
 * 3. Set trigger: Create, Update, Delete
 * 4. Set filter: _type in ["product", "testimonial", "partner"]
 */

import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'

// Constants for Sanity webhook signature verification
const SIGNATURE_HEADER_NAME = 'x-sanity-signature'

/**
 * Sanity webhook payload structure
 */
interface SanityWebhookPayload {
  _type: 'product' | 'testimonial' | 'partner'
  _id: string
  slug?: {
    current: string
  }
  _rev?: string
  _createdAt?: string
  _updatedAt?: string
}

/**
 * Revalidation response structure
 */
interface RevalidationResponse {
  revalidated: boolean
  now: number
  message?: string
  paths?: string[]
  tags?: string[]
  error?: string
}

/**
 * Content type to path mapping
 * Defines which paths should be revalidated for each content type
 */
const REVALIDATION_MAP: Record<string, string[]> = {
  product: [
    '/', // Homepage shows products
    '/products', // Products listing (if exists)
    '/products/[slug]' // Individual product pages
  ],
  testimonial: [
    '/' // Homepage shows testimonials
  ],
  partner: [
    '/' // Homepage shows partners
  ]
}

/**
 * Verify webhook signature from Sanity
 * Prevents unauthorized revalidation requests
 */
async function verifySignature(
  request: NextRequest,
  body: string
): Promise<boolean> {
  const signature = request.headers.get(SIGNATURE_HEADER_NAME)
  const secret = process.env.SANITY_WEBHOOK_SECRET

  if (!secret) {
    console.warn('[Revalidation] SANITY_WEBHOOK_SECRET not configured')
    return false
  }

  if (!signature) {
    console.warn('[Revalidation] No signature header found')
    return false
  }

  try {
    // Verify HMAC signature manually (same algorithm as @sanity/webhook)
    const hash = createHmac('sha256', secret)
      .update(body)
      .digest('hex')

    // Sanity sends signature in format: sha256=<hash>
    const expectedSignature = `sha256=${hash}`

    return signature === expectedSignature
  } catch (error) {
    console.error('[Revalidation] Signature verification failed:', error)
    return false
  }
}

/**
 * POST handler for Sanity webhook revalidation
 *
 * Security: Validates both query secret and Sanity signature
 * Performance: Targeted revalidation based on content type
 * Logging: Comprehensive logs for debugging
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Step 1: Validate query secret (simple first-line defense)
    const secret = request.nextUrl.searchParams.get('secret')

    if (secret !== process.env.REVALIDATE_SECRET) {
      console.warn('[Revalidation] Invalid secret provided')
      return NextResponse.json(
        { error: 'Invalid secret', revalidated: false, now: Date.now() } as RevalidationResponse,
        { status: 401 }
      )
    }

    // Step 2: Parse request body
    const bodyText = await request.text()
    let body: SanityWebhookPayload

    try {
      body = JSON.parse(bodyText)
    } catch (error) {
      console.error('[Revalidation] Invalid JSON payload:', error)
      return NextResponse.json(
        { error: 'Invalid JSON payload', revalidated: false, now: Date.now() } as RevalidationResponse,
        { status: 400 }
      )
    }

    // Step 3: Verify Sanity webhook signature (optional but recommended)
    if (process.env.SANITY_WEBHOOK_SECRET) {
      const isValid = await verifySignature(request, bodyText)
      if (!isValid) {
        console.warn('[Revalidation] Invalid Sanity signature')
        return NextResponse.json(
          { error: 'Invalid signature', revalidated: false, now: Date.now() } as RevalidationResponse,
          { status: 401 }
        )
      }
    }

    // Step 4: Extract content type from payload
    const { _type, _id, slug } = body

    if (!_type) {
      console.error('[Revalidation] Missing _type in payload')
      return NextResponse.json(
        { error: 'Missing _type', revalidated: false, now: Date.now() } as RevalidationResponse,
        { status: 400 }
      )
    }

    // Step 5: Get paths to revalidate based on content type
    const pathsToRevalidate = REVALIDATION_MAP[_type] || []

    if (pathsToRevalidate.length === 0) {
      console.warn(`[Revalidation] No revalidation paths configured for type: ${_type}`)
      return NextResponse.json({
        revalidated: false,
        now: Date.now(),
        message: `No paths configured for type: ${_type}`
      } as RevalidationResponse)
    }

    // Step 6: Perform revalidation
    const revalidatedPaths: string[] = []
    const errors: string[] = []

    for (const path of pathsToRevalidate) {
      try {
        // Handle dynamic routes (e.g., /products/[slug])
        if (path.includes('[slug]') && slug?.current) {
          const dynamicPath = path.replace('[slug]', slug.current)
          revalidatePath(dynamicPath)
          revalidatedPaths.push(dynamicPath)
        } else if (!path.includes('[')) {
          // Static routes
          revalidatePath(path)
          revalidatedPaths.push(path)
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.error(`[Revalidation] Failed to revalidate ${path}:`, errorMessage)
        errors.push(`${path}: ${errorMessage}`)
      }
    }

    // Step 7: Revalidate by tag (primary strategy for static content)
    // This invalidates all content using the tag, triggering fresh fetches
    const tags = [_type, `${_type}:${_id}`] // e.g., ['testimonials', 'testimonials:abc123']
    try {
      for (const tag of tags) {
        revalidateTag(tag, 'max')
      }
    } catch (error) {
      console.error('[Revalidation] Tag revalidation failed:', error)
    }

    // Step 8: Log success
    const duration = Date.now() - startTime
    console.log('[Revalidation] Success:', {
      type: _type,
      id: _id,
      paths: revalidatedPaths,
      tags,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    })

    // Step 9: Return response
    const response: RevalidationResponse = {
      revalidated: true,
      now: Date.now(),
      message: `Revalidated ${revalidatedPaths.length} path(s) for ${_type}`,
      paths: revalidatedPaths,
      tags
    }

    if (errors.length > 0) {
      response.error = `Some paths failed: ${errors.join(', ')}`
    }

    return NextResponse.json(response)

  } catch (error) {
    const duration = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : String(error)

    console.error('[Revalidation] Unexpected error:', {
      error: errorMessage,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json(
      {
        error: 'Internal server error',
        revalidated: false,
        now: Date.now()
      } as RevalidationResponse,
      { status: 500 }
    )
  }
}

/**
 * GET handler for testing revalidation endpoint
 * Only available in development mode
 */
export async function GET(request: NextRequest) {
  // Only allow GET in development for testing
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Method not allowed in production' },
      { status: 405 }
    )
  }

  const secret = request.nextUrl.searchParams.get('secret')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { error: 'Invalid secret' },
      { status: 401 }
    )
  }

  // Test revalidation of homepage
  try {
    revalidatePath('/')
    return NextResponse.json({
      message: 'Test revalidation successful',
      revalidated: true,
      paths: ['/'],
      now: Date.now()
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        revalidated: false,
        now: Date.now()
      },
      { status: 500 }
    )
  }
}
