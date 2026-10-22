#!/usr/bin/env bash

set -e

# Localiza a pasta do projeto
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$PROJECT_DIR"

echo "=================================="
echo "      INICIANDO GRADUATE"
echo "=================================="

# 1. Inicia PostgreSQL e Keycloak
echo "Iniciando infraestrutura Docker..."
docker compose up -d

# 2. Inicia o backend
echo "Iniciando backend NestJS..."
cd "$PROJECT_DIR/graduate-back"
npm run dev &
BACK_PID=$!

# 3. Inicia o frontend
echo "Iniciando frontend React..."
cd "$PROJECT_DIR/graduate-front"
npm run dev -- --host localhost &
FRONT_PID=$!

# 4. Encerra os processos ao sair
cleanup() {
    echo ""
    echo "Encerrando Graduate..."
    kill "$BACK_PID" "$FRONT_PID" 2>/dev/null || true
    wait "$BACK_PID" "$FRONT_PID" 2>/dev/null || true
}

trap cleanup EXIT INT TERM

echo ""
echo "Graduate disponível em:"
echo "http://localhost:5173/"
echo ""
echo "Pressione Ctrl+C para encerrar."

wait