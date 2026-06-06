#!/bin/bash
# ── EPK Database Setup Script ──────────────────────────────────────────────────
# Applies all Supabase migrations to set up the database schema.
#
# Usage:
#   ./scripts/setup-db.sh              # Apply all pending migrations
#   ./scripts/setup-db.sh --reset       # Reset local DB and re-apply
#   ./scripts/setup-db.sh --remote      # Push to linked Supabase project
#
# Prerequisites:
#   - supabase CLI installed (brew install supabase/tap/supabase)
#   - supabase linked to project (supabase link --project-ref <ref>)
# ==============================================================================

set -euo pipefail

MODE="${1:-local}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "═══ EPK Database Setup ═══"
echo "Mode: $MODE"
echo ""

case "$MODE" in
  --local|local)
    echo "→ Applying local migrations..."
    cd "$PROJECT_DIR"
    supabase migration up
    echo ""
    echo "✓ Migrations applied to local DB."
    echo "  Tables created: profiles, epks, domains"
    echo "  RPC functions: increment_epk_views, increment_epk_downloads"
    ;;

  --reset)
    echo "→ Resetting local database..."
    cd "$PROJECT_DIR"
    supabase db reset
    echo ""
    echo "✓ Local database reset and migrations re-applied."
    ;;

  --remote|remote)
    echo "→ Pushing migrations to remote Supabase project..."
    cd "$PROJECT_DIR"
    supabase db push
    echo ""
    echo "✓ Migrations pushed to remote."
    echo "  Project ref: $(cat supabase/.temp/project-ref 2>/dev/null || echo 'unknown')"
    ;;

  --sql)
    echo "→ Generating combined SQL for manual execution..."
    cd "$PROJECT_DIR"
    echo "-- EPK Schema — Run this in Supabase SQL Editor"
    echo ""
    cat supabase/migrations/001_profiles.sql
    echo ""
    echo "-- ── Migration 002 ──"
    echo ""
    cat supabase/migrations/002_full_epk_schema.sql
    ;;

  --status)
    echo "→ Checking migration status..."
    cd "$PROJECT_DIR"
    supabase migration list
    ;;

  *)
    echo "Usage: $0 [--local | --reset | --remote | --sql | --status]"
    echo ""
    echo "  --local    Apply pending migrations to local DB (default)"
    echo "  --reset    Reset local DB and re-apply all migrations"
    echo "  --remote   Push migrations to linked Supabase project"
    echo "  --sql      Output combined SQL for manual execution"
    echo "  --status   Show migration status"
    exit 1
    ;;
esac
