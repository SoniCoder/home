#!/usr/bin/env bash
# Shizuha Runtime Installer
# Usage: curl -fsSL http://s1.tail.shizuha.com/install.sh | bash
#
# Downloads a self-contained binary for your platform.
# No system dependencies required (Node.js is bundled).
set -euo pipefail

SHIZUHA_DIR="${SHIZUHA_DIR:-$HOME/.shizuha}"
BIN_DIR="${BIN_DIR:-$HOME/.local/bin}"
SHIZUHA_HOST="${SHIZUHA_HOST:-http://s1.tail.shizuha.com}"
VERSION="${SHIZUHA_VERSION:-0.1.0}"

# ── Colors ───────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
RESET='\033[0m'

info()  { printf "  ${CYAN}%s${RESET}\n" "$*"; }
ok()    { printf "  ${GREEN}%s${RESET}\n" "$*"; }
warn()  { printf "  ${YELLOW}%s${RESET}\n" "$*"; }
err()   { printf "  ${RED}%s${RESET}\n" "$*" >&2; }
step()  { printf "\n${BOLD}%s${RESET}\n" "$*"; }

# ── Banner ───────────────────────────────────────────────────────────────
printf "\n"
printf "${BOLD}${CYAN}"
printf "  ╔══════════════════════════════════════╗\n"
printf "  ║          静葉  Shizuha Runtime       ║\n"
printf "  ║     AI agents for your entire stack  ║\n"
printf "  ╚══════════════════════════════════════╝\n"
printf "${RESET}\n"

# ── Detect platform ─────────────────────────────────────────────────────
step "Detecting platform..."

OS="$(/usr/bin/uname -s)"
ARCH="$(/usr/bin/uname -m)"

case "$OS" in
  Linux)  PLATFORM="linux" ;;
  Darwin) PLATFORM="darwin" ;;
  MINGW*|MSYS*|CYGWIN*)
    err "Windows is not supported natively. Use WSL:"
    err "  wsl --install && wsl"
    exit 1
    ;;
  *)
    err "Unsupported OS: $OS"
    exit 1
    ;;
esac

case "$ARCH" in
  x86_64|amd64)    ARCH_NAME="x64" ;;
  aarch64|arm64)   ARCH_NAME="arm64" ;;
  armv7l)
    err "32-bit ARM is not supported. Use a 64-bit OS."
    exit 1
    ;;
  *)
    err "Unsupported architecture: $ARCH"
    exit 1
    ;;
esac

TARGET="${PLATFORM}-${ARCH_NAME}"
ok "Platform: ${TARGET}"

# ── Check for existing installation ─────────────────────────────────────

if [ -f "$SHIZUHA_DIR/VERSION" ]; then
  EXISTING_VERSION=$(cat "$SHIZUHA_DIR/VERSION" 2>/dev/null || echo "unknown")
  if [ "$EXISTING_VERSION" = "$VERSION" ]; then
    info "Reinstalling Shizuha v${VERSION}..."
  else
    info "Upgrading from v${EXISTING_VERSION} to v${VERSION}..."
  fi
fi

# ── Download ─────────────────────────────────────────────────────────────
step "Downloading Shizuha Runtime v${VERSION}..."

ARCHIVE_NAME="shizuha-${VERSION}-${TARGET}.tar.gz"
DOWNLOAD_URL="${SHIZUHA_HOST}/rt/releases/${ARCHIVE_NAME}"

TMPDIR_DL="$(mktemp -d)"
trap "rm -rf '$TMPDIR_DL'" EXIT

info "Fetching ${ARCHIVE_NAME}..."
if ! curl -fSL --progress-bar "$DOWNLOAD_URL" -o "$TMPDIR_DL/$ARCHIVE_NAME"; then
  err "Download failed: $DOWNLOAD_URL"
  err ""
  err "This platform (${TARGET}) may not have a prebuilt binary yet."
  err "Available platforms: linux-x64, linux-arm64, darwin-x64, darwin-arm64"
  err ""
  err "Build from source:"
  err "  git clone https://github.com/shizuha-trading/shizuha.git"
  err "  cd shizuha && npm install && npm run build"
  exit 1
fi

# ── Extract ──────────────────────────────────────────────────────────────
step "Installing..."

info "Extracting..."
tar xzf "$TMPDIR_DL/$ARCHIVE_NAME" -C "$TMPDIR_DL"

# The archive contains a directory like shizuha-0.1.0-linux-x64/
EXTRACTED_DIR="$TMPDIR_DL/shizuha-${VERSION}-${TARGET}"

if [ ! -d "$EXTRACTED_DIR" ]; then
  err "Archive format unexpected — missing directory ${EXTRACTED_DIR}"
  exit 1
fi

# ── Self-install ─────────────────────────────────────────────────────────
# Delegate to the bundled install script (like `claude install`)

if [ -x "$EXTRACTED_DIR/install" ]; then
  SHIZUHA_DIR="$SHIZUHA_DIR" BIN_DIR="$BIN_DIR" "$EXTRACTED_DIR/install"
else
  # Fallback: manual copy
  mkdir -p "$SHIZUHA_DIR"
  cp -r "$EXTRACTED_DIR"/* "$SHIZUHA_DIR/"

  mkdir -p "$BIN_DIR"
  cat > "$BIN_DIR/shizuha" << WRAPPER
#!/usr/bin/env bash
exec "$SHIZUHA_DIR/bin/shizuha" "\$@"
WRAPPER
  chmod +x "$BIN_DIR/shizuha"

  if ! echo "$PATH" | tr ':' '\n' | grep -q "^$BIN_DIR$"; then
    SHELL_NAME=$(basename "${SHELL:-bash}")
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
    warn "Added $BIN_DIR to PATH in $RC_FILE"
  fi
fi

# Cleanup
rm -rf "$TMPDIR_DL"
trap - EXIT

# ── Install Python MCP deps (optional) ──────────────────────────────────
if command -v python3 &>/dev/null; then
  PY_VERSION=$(python3 -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')
  PY_MAJOR=$(echo "$PY_VERSION" | cut -d. -f1)
  PY_MINOR=$(echo "$PY_VERSION" | cut -d. -f2)
  if [ "$PY_MAJOR" -ge 3 ] && [ "$PY_MINOR" -ge 10 ]; then
    info "Installing Python MCP dependencies..."
    pip3 install --quiet --user mcp pydantic httpx 2>/dev/null || true
    ok "Python packages installed"
  fi
fi

# ── Verify ──────────────────────────────────────────────────────────────
step "Verifying installation..."

if "$BIN_DIR/shizuha" --version &>/dev/null 2>&1; then
  INSTALLED_VERSION=$("$BIN_DIR/shizuha" --version 2>/dev/null || echo "$VERSION")
  ok "Shizuha Runtime v${INSTALLED_VERSION} installed successfully!"
else
  warn "Binary installed but verification failed."
  warn "Try: source ~/.bashrc && shizuha --version"
fi

# ── Auto-start daemon ─────────────────────────────────────────────────
# Always start the daemon. Works without login (local mode) or with
# platform auth if already logged in.

step "Starting daemon..."
# Stop any existing daemon first
"$BIN_DIR/shizuha" down 2>/dev/null || true
# Start (installs systemd service on Linux, launchd on macOS)
DAEMON_STARTED=false
if "$BIN_DIR/shizuha" up 2>/dev/null; then
  DAEMON_STARTED=true
  ok "Daemon running — dashboard at http://localhost:8015"
else
  warn "Could not start daemon automatically."
  warn "Run: shizuha up"
fi

# ── Done ────────────────────────────────────────────────────────────────
printf "\n"
printf "${BOLD}${GREEN}  Installation complete!${RESET}\n"
printf "\n"

if [ "$DAEMON_STARTED" = true ]; then
  printf "  ${BOLD}${GREEN}Daemon is running.${RESET}\n"
  printf "\n"
  printf "  ${BOLD}Dashboard:${RESET}  ${CYAN}http://localhost:8015${RESET}\n"
  printf "  ${BOLD}Stop:${RESET}       ${CYAN}shizuha down${RESET}\n"
  printf "  ${BOLD}Logs:${RESET}       ${CYAN}tail -f ~/.shizuha/daemon.log${RESET}\n"
else
  printf "  ${BOLD}To start manually:${RESET}\n"
  printf "     ${CYAN}shizuha up${RESET}\n"
fi

printf "\n"
printf "  ${DIM}Use directly:${RESET}\n"
printf "     ${CYAN}shizuha${RESET}                        # Interactive TUI\n"
printf "     ${CYAN}shizuha exec -p \"hello\"${RESET}        # Single prompt\n"
printf "\n"
printf "  ${DIM}Docs: http://s1.tail.shizuha.com/docs${RESET}\n"
printf "\n"
