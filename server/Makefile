.PHONY: dev-build
dev-build:
	docker compose -f compose-dev.yaml build

.PHONY: dev-up-d
dev-up-d:
	docker compose -f compose-dev.yaml up -d

.PHONY: dev
dev:
	@make dev-build
	@make dev-up-d

.PHONY: down
down:
	docker compose -f compose-dev.yaml down

.PHONY: bash
bash:
	docker compose -f compose-dev.yaml exec django bash

.PHONY: logs
logs:
	docker compose -f compose-dev.yaml logs
