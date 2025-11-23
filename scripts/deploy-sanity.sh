#!/bin/bash

###############################################################################
# Sanity Studio Deployment Script
#
# This script automates the deployment of Sanity Studio to production.
# It performs pre-deployment checks, builds the studio, and deploys it.
#
# Usage:
#   ./scripts/deploy-sanity.sh [--skip-checks] [--dry-run]
#
# Options:
#   --skip-checks  Skip pre-deployment validation checks
#   --dry-run      Build without deploying (test only)
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script options
SKIP_CHECKS=false
DRY_RUN=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --skip-checks)
      SKIP_CHECKS=true
      shift
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      exit 1
      ;;
  esac
done

###############################################################################
# Helper Functions
###############################################################################

print_header() {
  echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}  $1${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
  echo -e "${RED}❌ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
  echo -e "${BLUE}ℹ️  $1${NC}"
}

check_command() {
  if ! command -v $1 &> /dev/null; then
    print_error "$1 is not installed"
    return 1
  fi
  return 0
}

###############################################################################
# Pre-Deployment Checks
###############################################################################

if [ "$SKIP_CHECKS" = false ]; then
  print_header "PRE-DEPLOYMENT CHECKS"

  # Check if Sanity CLI is installed
  print_info "Checking Sanity CLI installation..."
  if ! check_command sanity; then
    print_error "Sanity CLI not found. Install with: npm install -g @sanity/cli"
    exit 1
  fi
  print_success "Sanity CLI found"

  # Check if we're in the right directory
  if [ ! -f "sanity.config.ts" ]; then
    print_error "sanity.config.ts not found. Are you in the project root?"
    exit 1
  fi
  print_success "Project structure verified"

  # Check environment variables
  print_info "Checking environment variables..."
  if [ -z "$NEXT_PUBLIC_SANITY_PROJECT_ID" ]; then
    print_warning "NEXT_PUBLIC_SANITY_PROJECT_ID not set in environment"
  fi
  if [ -z "$NEXT_PUBLIC_SANITY_DATASET" ]; then
    print_warning "NEXT_PUBLIC_SANITY_DATASET not set in environment"
  fi

  # Check if logged in to Sanity
  print_info "Checking Sanity authentication..."
  if ! sanity login --sso 2>/dev/null; then
    print_error "Not logged in to Sanity. Run: sanity login"
    exit 1
  fi
  print_success "Sanity authentication verified"

  # Check git status
  print_info "Checking git status..."
  if ! git diff-index --quiet HEAD --; then
    print_warning "You have uncommitted changes"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      print_info "Deployment cancelled"
      exit 0
    fi
  else
    print_success "Working directory clean"
  fi

  print_success "All pre-deployment checks passed!"
fi

###############################################################################
# Build Sanity Studio
###############################################################################

print_header "BUILDING SANITY STUDIO"

print_info "Installing dependencies..."
npm install

print_info "Building Sanity Studio..."
if ! npm run build 2>&1 | tee sanity-build.log; then
  print_error "Build failed! Check sanity-build.log for details"
  exit 1
fi

print_success "Build completed successfully!"

###############################################################################
# Deploy to Sanity
###############################################################################

if [ "$DRY_RUN" = true ]; then
  print_header "DRY RUN MODE"
  print_success "Build completed successfully (not deployed)"
  print_info "To deploy, run without --dry-run flag"
  exit 0
fi

print_header "DEPLOYING TO SANITY"

print_info "Deploying Sanity Studio..."
if ! sanity deploy; then
  print_error "Deployment failed!"
  exit 1
fi

print_success "Deployment completed successfully!"

###############################################################################
# Post-Deployment
###############################################################################

print_header "POST-DEPLOYMENT"

# Get studio URL
STUDIO_URL=$(sanity manage 2>/dev/null | grep -oP 'https://[^/]+\.sanity\.studio' || echo "")

if [ -n "$STUDIO_URL" ]; then
  print_success "Studio deployed to: $STUDIO_URL"

  print_info "Next steps:"
  echo "  1. Visit: $STUDIO_URL"
  echo "  2. Test content creation"
  echo "  3. Verify webhook configuration"
  echo "  4. Deploy Next.js application"
else
  print_warning "Could not determine studio URL automatically"
  print_info "Check your Sanity dashboard for the studio URL"
fi

print_header "DEPLOYMENT COMPLETE"

print_success "Sanity Studio deployed successfully! 🎉"
