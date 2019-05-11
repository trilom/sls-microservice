MKFILEPATH := $(shell pwd)

remove:
	$(info [*] Removing dev env....)
	serverless remove --stage dev

removeAll:
	$(info [*] Removing dev env for all....)
	@$(MAKE) _removeAll

clean:
	$(info [*] Who needs all that anyway? Destroying environment....)
	@rm -rf ./node_modules
	@rm -rf ./.serverless

cleanAll:
	$(info [*] Who needs all that anyway? Destroying environment for all paths....)
	@rm -rf ./node_modules
	@rm -rf ./.serverless
	@cd ../api && $(MAKE) cleanAll

build:
	yarn install

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
	cd ../api && $(MAKE) buildAll

_deployAll:
	serverless deploy --stage ${STAGE}
	cd ../api && $(MAKE) deployAll

_check_stage_definition:
	$(info [*] Checking whether STAGE $(STAGE) exists...)
ifndef STAGE
	$(error [!] STAGE env not defined, make sure you define STAGE='dev' for example.)
endif

define HELP_MESSAGE
	Environment variables to be aware of or to hardcode depending on your use case:

	STAGE
		Default: not_defined
		Info: The deployment stage

	Common usage:

	...::: Cleans up the environment removes node_modules :::...
	$ make clean

	...::: Cleans up the environment removes node_modules for all functions :::...
	$ make cleanAll

	...::: Build Function :::...
	$ make build

	...::: Build All Functions :::...
	$ make buildAll

	...::: Deploy Function to Stage :::...
	$ make deploy STAGE="prod"

	...::: Deploy All Functions to Stage :::...
	$ make prodAll STAGE="dev"

endef
