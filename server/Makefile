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

.PHONY: test
test:
	docker compose -f compose-dev.yml exec django python manage.py test

# Lintとフォーマット
.PHONY: black
black:
	docker compose -f compose-dev.yml exec django black .

.PHONY: isort
isort:
	docker compose -f compose-dev.yml exec django isort .

.PHONY: flake8
flake8:
	docker compose -f compose-dev.yml exec django flake8 .

.PHONY: lint
lint:
	@make black
	@make isort
	@make flake8
