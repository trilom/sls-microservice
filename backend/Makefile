MKFILEPATH := $(shell pwd)
SERVICE ?= ''

remove:
	$(info [*] Removing dev env....)
	serverless remove --stage dev

removeAll:
	$(info [*] Removing dev env for all....)
	@$(MAKE) _removeAll

clean: _check_service_definition
	$(info [*] Who needs all that anyway? Destroying environment....)
ifeq ($(SERVICE), '')
	rm -rf node_modules
	rm -rf .serverless
else
	rm -rf ./src/${SERVICE}/node_modules
	rm -rf ./src/${SERVICE}/.serverless
endif

cleanAll:
	$(info [*] Who needs all that anyway? Destroying environment for all paths....)
	@rm -rf node_modules
	@rm -rf .serverless
	@find ./src -depth -type d -not -name 'src' -not -path "*/node_modules/*" -not -name 'node_modules' -not -name '.serverless'  > results.txt
	@while read line; do \
		echo "Cleaning $$line..."; \
		rm -rf $$line/node_modules; \
		rm -rf $$line/.serverless; \
	done < results.txt
	@rm -rf results.txt
	@rm -rf ./node_modules
	@rm -rf ./.serverless
	@cd ../api && $(MAKE) cleanAll

build: _check_service_definition
ifeq ($(SERVICE), '')
	yarn install
else
	yarn install --cwd ./src/${SERVICE}
endif

buildAll:
	$(info [*] Building....)
	@$(MAKE) _buildAll

deploy: _check_stage_definition
	$(info [*] Deploying to $(STAGE)....)
	serverless deploy --stage ${STAGE}

deployAll: _check_stage_definition
	$(info [*] Deploying all infrastructure to $(STAGE)....)
	$(MAKE) _deployAll STAGE=${STAGE}

#############
#  Helpers  #
#############
_removeAll:
	cd ../api && $(MAKE) removeAll
	cd ${MKFILEPATH} && serverless remove --stage dev

_buildAll:
	yarn install
	@find ./src -depth -type d -not -name 'src' -not -path "*/node_modules/*" -not -name 'node_modules' -not -name '.serverless'  > results.txt
	@while read line; do \
		echo "Building $$line..."; \
		yarn install --cwd $$line; \
		cd ${MKFILEPATH}; \
	done < results.txt
	@rm -rf results.txt
	cd ../api && $(MAKE) buildAll

_deployAll:
	serverless deploy --stage ${STAGE}
	cd ../api && $(MAKE) deployAll

_check_service_definition:
	$(info [*] Checking whether service $(SERVICE) exists...)
ifndef SERVICE
	$(info [*] SERVICE env not defined, make sure you define SERVICE='order', assuming root directory.)
endif

_check_stage_definition:
	$(info [*] Checking whether STAGE $(STAGE) exists...)
ifndef STAGE
	$(error [!] STAGE env not defined, make sure you define STAGE='dev' for example.)
endif

define HELP_MESSAGE
	Environment variables to be aware of or to hardcode depending on your use case:

	SERVICE
		Default: not_defined
		Info: The folder in src for the function endpoint being deployed.  /src/users is SERVICE='users'.

	STAGE
		Default: not_defined
		Info: The deployment stage

	Common usage:

	...::: Cleans up the environment removes node_modules :::...
	$ make clean SERVICE="users"

	...::: Cleans up the environment removes node_modules for all functions :::...
	$ make cleanAll

	...::: Build Function :::...
	$ make build SERVICE="vehicles/command"

	...::: Build All Functions :::...
	$ make buildAll

	...::: Deploy Function to Stage :::...
	$ make deploy SERVICE="vehicles" STAGE="prod"

	...::: Deploy All Functions to Stage :::...
	$ make prodAll STAGE="dev"

endef
