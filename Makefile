help:  ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n\nTargets:\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-13s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

up: docker-compose.yaml docker-compose.override.yaml ## Does docker-compose up, automaticly create docker-compose.override.yaml
	docker-compose up -d --remove-orphans

clean: ## Deletes all containers and volumes. WILL DROP ALL DB DATA
	docker-compose down --volumes --remove-orphans

install: up ## Install basic data
	docker-compose exec api curl "http://localhost:8080/$${APICORE_SERVER_PATH_PREFIX}/install"

install-demo: up install ## Install demo data
	docker-compose exec api curl "http://localhost:8080/$${APICORE_SERVER_PATH_PREFIX}/demo"

docker-compose.override.yaml:
	cp docker-compose.override.dist.yaml docker-compose.override.yaml
