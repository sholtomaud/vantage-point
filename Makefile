IMAGE_APP := vantage-point
CONTAINER_NAME := vantage-point-dev

.PHONY: all start build build-app dev tests test tests-e2e shell stop clean logs

# Default target
all: build

run: dev

# ─── 1. System Lifecycle ──────────────────────────────────────────
start:
	@echo "🔌 Checking container system service..."
	@container system start 2>/dev/null || true
	@sleep 1

# ─── 2. Build ─────────────────────────────────────────────────────
build-app: start
	@echo "🔨 Building App image '$(IMAGE_APP)'..."
	container build -t "$(IMAGE_APP)" -f Dockerfile .
	@echo "✅ App build complete."

build: build-app

# ─── 3. Development ───────────────────────────────────────────────
dev: start
	@if [ -z "$$(container images -q $(IMAGE_APP))" ]; then \
		$(MAKE) build-app; \
	fi
	@echo "🚀 Starting development server with Hot Reload..."
	container run -it --rm \
		--publish 3000:3000 \
		-v "$(PWD):/app" \
		-v /app/node_modules \
		--name "$(CONTAINER_NAME)" \
		"$(IMAGE_APP)" npm run dev:all

# ─── 4. Tests ─────────────────────────────────────────────────────
tests-e2e: build-app
	container run --rm "$(IMAGE_APP)" npm run test:e2e

tests: tests-e2e
test: tests

# ─── 5. Utilities ─────────────────────────────────────────────────
shell: start
	@echo "🐚 Entering shell..."
	container run -it --rm -v "$(PWD):/app" -v /app/node_modules "$(IMAGE_APP)" bash

stop:
	@echo "🛑 Stopping any running containers..."
	-container stop "$(CONTAINER_NAME)" 2>/dev/null || true

clean: stop
	@echo "🧹 Removing images..."
	-container rmi "$(IMAGE_APP)" 2>/dev/null || true

logs:
	container logs --follow "$(CONTAINER_NAME)"
