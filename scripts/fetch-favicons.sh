#!/usr/bin/env bash

# Favicon fetching script for SLAG
# This script fetches favicons for all projects defined in YAML files

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null 2>&1 && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PROJECTS_DIR="${PROJECT_DIR}/projects"
FAVICONS_DIR="${PROJECT_DIR}/public/favicons"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Statistics
SUCCESS_COUNT=0
SKIP_COUNT=0
FAIL_COUNT=0

log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

# Create favicons directory if it doesn't exist
mkdir -p "$FAVICONS_DIR"

# Check if yq is available (for YAML parsing)
if ! command -v yq &> /dev/null; then
    log_warning "yq not found. Using fallback grep-based URL extraction."
    log_info "For better results, install yq: brew install yq"
    USE_YQ=false
else
    USE_YQ=true
fi

# Extract domain from URL
extract_domain() {
    local url="$1"
    echo "$url" | sed -E 's|https?://||' | sed -E 's|www\.||' | sed -E 's|/.*||'
}

# Sanitize domain for filename
sanitize_domain() {
    local domain="$1"
    echo "$domain" | tr '.' '-'
}

# Fetch favicon for a URL
fetch_favicon() {
    local url="$1"
    local domain
    local sanitized_domain
    local output_file

    domain=$(extract_domain "$url")
    sanitized_domain=$(sanitize_domain "$domain")
    output_file="${FAVICONS_DIR}/${sanitized_domain}.ico"

    # Skip if favicon already exists
    if [ -f "$output_file" ]; then
        log_warning "Skipping $domain (already exists)"
        ((SKIP_COUNT++))
        return 0
    fi

    log_info "Fetching favicon for $domain..."

    # Try multiple methods to fetch favicon
    local fetched=false

    # Method 1: Try direct favicon.ico
    if curl -sS -L --max-time 10 "https://${domain}/favicon.ico" -o "$output_file" 2>/dev/null; then
        if [ -s "$output_file" ]; then
            # Verify it's actually an image
            if file "$output_file" | grep -qE "image|icon|data"; then
                log_success "Fetched from https://${domain}/favicon.ico"
                ((SUCCESS_COUNT++))
                return 0
            fi
        fi
        rm -f "$output_file"
    fi

    # Method 2: Try favicon.png
    if curl -sS -L --max-time 10 "https://${domain}/favicon.png" -o "$output_file" 2>/dev/null; then
        if [ -s "$output_file" ]; then
            if file "$output_file" | grep -qE "PNG image"; then
                log_success "Fetched from https://${domain}/favicon.png"
                ((SUCCESS_COUNT++))
                return 0
            fi
        fi
        rm -f "$output_file"
    fi

    # Method 3: Google's favicon service (most reliable fallback)
    if curl -sS -L --max-time 10 "https://www.google.com/s2/favicons?domain=${domain}&sz=64" -o "$output_file" 2>/dev/null; then
        if [ -s "$output_file" ]; then
            log_success "Fetched from Google's favicon service"
            ((SUCCESS_COUNT++))
            return 0
        fi
        rm -f "$output_file"
    fi

    log_error "Failed to fetch favicon for $domain"
    ((FAIL_COUNT++))
    return 1
}

# Main execution
log_info "Starting favicon fetch for SLAG projects..."
echo

# Check if projects directory exists
if [ ! -d "$PROJECTS_DIR" ]; then
    log_error "Projects directory not found: $PROJECTS_DIR"
    exit 1
fi

# Find all YAML files
yaml_files=$(find "$PROJECTS_DIR" -name "*.yaml" -o -name "*.yml")

if [ -z "$yaml_files" ]; then
    log_warning "No YAML files found in $PROJECTS_DIR"
    exit 0
fi

# Process each YAML file
while IFS= read -r yaml_file; do
    if [ "$USE_YQ" = true ]; then
        # Use yq for proper YAML parsing
        url=$(yq eval '.url' "$yaml_file" 2>/dev/null || echo "")
    else
        # Fallback: Use grep
        url=$(grep -E '^url:' "$yaml_file" | sed -E 's/^url: *"?([^"]*)"?/\1/' | tr -d '"')
    fi

    if [ -n "$url" ]; then
        fetch_favicon "$url" || true  # Continue even if fetch fails
    else
        log_warning "No URL found in $(basename "$yaml_file")"
    fi
done <<< "$yaml_files"

# Print summary
echo
log_info "================================"
log_info "Favicon Fetch Summary"
log_info "================================"
log_success "Successfully fetched: $SUCCESS_COUNT"
log_warning "Skipped (already exist): $SKIP_COUNT"
log_error "Failed: $FAIL_COUNT"
echo

if [ $FAIL_COUNT -gt 0 ]; then
    log_warning "Some favicons could not be fetched. They will use fallback display."
fi

log_success "Done!"
