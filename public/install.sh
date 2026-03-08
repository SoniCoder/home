#!/usr/bin/env bash
# Shizuha Runtime Installer
# Usage: curl -fsSL https://s1.tail.shizuha.com/install.sh | bash
set -euo pipefail

SHIZUHA_DIR="${SHIZUHA_DIR:-$HOME/.shizuha}"
BIN_DIR="${BIN_DIR:-$HOME/.local/bin}"
SHIZUHA_HOST="${SHIZUHA_HOST:-https://s1.tail.shizuha.com}"

# ── Colors ───────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
RESET='\033[0m'

info()  { printf "${CYAN}%s${RESET}\n" "$*"; }
ok()    { printf "${GREEN}%s${RESET}\n" "$*"; }
warn()  { printf "${YELLOW}%s${RESET}\n" "$*"; }
err()   { printf "${RED}%s${RESET}\n" "$*" >&2; }
step()  { printf "\n${BOLD}%s${RESET}\n" "$*"; }

# ── Banner ───────────────────────────────────────────────────────────────
printf "\n"
printf "${BOLD}${CYAN}"
printf "  ╔══════════════════════════════════════╗\n"
printf "  ║          静葉  Shizuha Runtime       ║\n"
printf "  ║     AI agents for your entire stack  ║\n"
printf "  ╚══════════════════════════════════════╝\n"
printf "${RESET}\n"

# ── Preflight checks ────────────────────────────────────────────────────
step "Checking requirements..."

# OS detection
OS="$(uname -s)"
ARCH="$(uname -m)"
case "$OS" in
  Linux)  PLATFORM="linux" ;;
  Darwin) PLATFORM="macos" ;;
  *)      err "Unsupported OS: $OS"; exit 1 ;;
esac
info "  Platform: $PLATFORM ($ARCH)"

# Node.js >= 20
if ! command -v node &>/dev/null; then
  err "  Node.js not found. Install Node.js 20+ first:"
  err "    https://nodejs.org/ or: curl -fsSL https://fnm.vercel.app/install | bash"
  exit 1
fi
NODE_VERSION=$(node -v | sed 's/^v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
  err "  Node.js $NODE_VERSION found, but 20+ required."
  exit 1
fi
ok "  Node.js v$(node -v | sed 's/^v//')"

# Python >= 3.10 (for MCP servers)
if ! command -v python3 &>/dev/null; then
  warn "  Python 3 not found. MCP servers won't work without it."
  warn "  Install Python 3.10+: https://www.python.org/downloads/"
else
  PY_VERSION=$(python3 -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')
  PY_MAJOR=$(echo "$PY_VERSION" | cut -d. -f1)
  PY_MINOR=$(echo "$PY_VERSION" | cut -d. -f2)
  if [ "$PY_MAJOR" -lt 3 ] || { [ "$PY_MAJOR" -eq 3 ] && [ "$PY_MINOR" -lt 10 ]; }; then
    warn "  Python $PY_VERSION found, but 3.10+ recommended for MCP servers."
  else
    ok "  Python $PY_VERSION"
  fi
fi

# ── Download runtime ────────────────────────────────────────────────────
step "Installing Shizuha Runtime..."

mkdir -p "$SHIZUHA_DIR"

# Download CLI bundle
info "  Downloading CLI..."
curl -fsSL "$SHIZUHA_HOST/rt/dist/shizuha.min.js" -o "$SHIZUHA_DIR/shizuha.js"
chmod +x "$SHIZUHA_DIR/shizuha.js"

# Download MCP servers
info "  Downloading MCP servers..."
mkdir -p "$SHIZUHA_DIR/mcp"
for server in base admin_server books_server browser_server connect_server \
              drive_server finance_server hr_server id_server inventory_server \
              mail_server notes_server pulse_server scs_server time_server \
              wiki_server notify_server; do
  curl -fsSL "$SHIZUHA_HOST/rt/mcp/${server}.py" -o "$SHIZUHA_DIR/mcp/${server}.py" 2>/dev/null || true
done

# Download package.json for npm deps
info "  Downloading package manifest..."
curl -fsSL "$SHIZUHA_HOST/rt/package.json" -o "$SHIZUHA_DIR/package.json" 2>/dev/null || true

# ── Install npm dependencies ────────────────────────────────────────────
step "Installing dependencies..."
if [ -f "$SHIZUHA_DIR/package.json" ]; then
  cd "$SHIZUHA_DIR"
  npm install --production --silent 2>/dev/null || npm install --omit=dev --silent
  cd - >/dev/null
  ok "  npm packages installed"
else
  warn "  No package.json found, skipping npm install"
fi

# ── Install MCP Python deps ─────────────────────────────────────────────
if command -v python3 &>/dev/null && command -v pip3 &>/dev/null; then
  info "  Installing Python MCP dependencies..."
  pip3 install --quiet --user mcp pydantic httpx 2>/dev/null || true
  ok "  Python packages installed"
fi

# ── Create binary ───────────────────────────────────────────────────────
step "Setting up PATH..."

mkdir -p "$BIN_DIR"

# Create wrapper script
cat > "$BIN_DIR/shizuha" << 'WRAPPER'
#!/usr/bin/env bash
SHIZUHA_DIR="${SHIZUHA_DIR:-$HOME/.shizuha}"
exec node "$SHIZUHA_DIR/shizuha.js" "$@"
WRAPPER
chmod +x "$BIN_DIR/shizuha"

# Check if BIN_DIR is in PATH
if ! echo "$PATH" | tr ':' '\n' | grep -q "^$BIN_DIR$"; then
  SHELL_NAME=$(basename "$SHELL")
  case "$SHELL_NAME" in
    zsh)  RC_FILE="$HOME/.zshrc" ;;
    bash) RC_FILE="$HOME/.bashrc" ;;
    fish) RC_FILE="$HOME/.config/fish/config.fish" ;;
    *)    RC_FILE="$HOME/.profile" ;;
  esac

  if [ "$SHELL_NAME" = "fish" ]; then
    echo "set -gx PATH \"$BIN_DIR\" \$PATH" >> "$RC_FILE"
  else
    echo "export PATH=\"$BIN_DIR:\$PATH\"" >> "$RC_FILE"
  fi
  warn "  Added $BIN_DIR to PATH in $RC_FILE"
  warn "  Run: source $RC_FILE  (or open a new terminal)"
else
  ok "  $BIN_DIR already in PATH"
fi

# ── Verify ──────────────────────────────────────────────────────────────
step "Verifying installation..."

if "$BIN_DIR/shizuha" --version &>/dev/null; then
  VERSION=$("$BIN_DIR/shizuha" --version 2>/dev/null || echo "unknown")
  ok "  Shizuha Runtime v$VERSION installed successfully!"
else
  warn "  Binary installed but verification failed. Try: shizuha --version"
fi

# ── Done ────────────────────────────────────────────────────────────────
printf "\n"
printf "${BOLD}${GREEN}"
printf "  Installation complete!\n"
printf "${RESET}\n"
printf "  ${BOLD}Get started:${RESET}\n"
printf "    ${CYAN}shizuha${RESET}                        # Interactive mode\n"
printf "    ${CYAN}shizuha exec -p \"hello\"${RESET}        # Run a prompt\n"
printf "    ${CYAN}shizuha serve${RESET}                   # Start HTTP API\n"
printf "    ${CYAN}shizuha config${RESET}                  # Configure providers\n"
printf "\n"
printf "  ${DIM}Installed to: $SHIZUHA_DIR${RESET}\n"
printf "  ${DIM}Binary at:    $BIN_DIR/shizuha${RESET}\n"
printf "\n"
