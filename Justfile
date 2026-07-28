set shell := ["bash", "-eu", "-o", "pipefail", "-c"]

# List available recipes
default:
    @just --list

# Run Codex in Docker container
[arg("args", help="Command arguments")]
codex *args:
    @docker compose run --rm codex {{ args }}

# Run Claude in Docker container
[arg("args", help="Command arguments")]
claude *args:
    @docker compose run --rm claude {{ args }}

# Run Vite dev server
[arg("args", help="Command arguments")]
dev *args:
    npm run dev -- {{ args }}

# Preview production build
[arg("args", help="Command arguments")]
preview *args:
    npm run preview -- {{ args }}

# Run unit tests
[arg("args", help="Command arguments")]
test *args:
    npm run test -- {{ args }}

# Run unit tests with coverage
[arg("args", help="Command arguments")]
coverage *args:
    npm run coverage -- {{ args }}

# Run unit and e2e tests in Docker, with coverage
[arg("args", help="Command arguments")]
e2e-test *args:
    docker compose run --rm test {{ args }}
