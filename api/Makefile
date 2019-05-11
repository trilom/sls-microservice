
MKFILEPATH := $(shell pwd)
LC_SERVICE := $(shell echo $(SERVICE) | tr A-Z a-z)
SLS_SERVICE := $(subst /,-,$(LC_SERVICE))
CAMEL_SERVICE := $(shell echo $(SLS_SERVICE) | sed 's/-\([a-z]\)/\U\1/g;s/^\([a-z]\)/\U\1/g')
ESCAPED_SERVICE := $(subst /,\/,$(LC_SERVICE))

remove: _check_service_definition
	$(info [*] Removing dev env....)
	cd ./src/${SERVICE} && serverless remove --stage dev

removeAll:
	$(info [*] Removing dev env for all....)
	@$(MAKE) _removeAll

clean: _check_service_definition ##=> Deletes current build environment and latest build
	$(info [*] Who needs all that anyway? Destroying environment....)
	@rm -rf ./src/${SERVICE}/node_modules
	@rm -rf ./src/${SERVICE}/.serverless

cleanAll:
	$(info [*] Who needs all that anyway? Destroying environment for all paths....)
	@find ./src -depth -type d -not -name 'src' -not -path "*/node_modules/*" -not -name 'node_modules' -not -name '.serverless'  > results.txt
	@while read line; do \
		echo "Cleaning $$line..."; \
		rm -rf $$line/node_modules; \
		rm -rf $$line/.serverless; \
	done < results.txt
	@rm -rf results.txt

build: _check_service_definition
	yarn install --cwd ./src/${SERVICE}

buildAll:
	@$(MAKE) _buildAll

deploy: _check_service_definition _check_stage_definition
	cd ./src/${SERVICE} && serverless deploy --stage ${STAGE}

deployAll: _check_stage_definition _deployAll

endpoint:
	$(info [*] Making new endpoint at ./src/$(SERVICE)....)
	@$(MAKE) _createEndpoint SERVICE=${SERVICE}

#############
#  Helpers  #
#############
_createEndpoint:
	#make directory
	@mkdir -p ./src/${SERVICE}
	@touch ./src/${SERVICE}/index.js
	@cp serverless.yml ./src/${SERVICE}/serverless.yml
	@sed -i "s/__SERVICE__/${SLS_SERVICE}/" ./src/${SERVICE}/serverless.yml
	@sed -i "s/__FUNCTION__/${CAMEL_SERVICE}/" ./src/${SERVICE}/serverless.yml
	@sed -i "s/__PATH__/${ESCAPED_SERVICE}/" ./src/${SERVICE}/serverless.yml
	@yarn add --dev --cwd ./src/${SERVICE} serverless
	@yarn add --dev --cwd ./src/${SERVICE} serverless-pseudo-parameters
	@yarn add --dev --cwd ./src/${SERVICE} serverless-iam-roles-per-function
	@yarn add --dev --cwd ./src/${SERVICE} serverless-plugin-reducer
	@yarn add --dev --cwd ./src/${SERVICE} '@serverless/enterprise-plugin'

_removeAll:
	@find ./src -depth -type d -not -name 'src' -not -path "*/node_modules/*" -not -name 'node_modules' -not -name '.serverless' > results.txt
	@while read line; do \
		echo "Removing $$line..."; \
		cd $$line && serverless remove --stage dev; \
		cd ${MKFILEPATH}; \
	done < results.txt
	@rm -rf results.txt

_buildAll:
	@find ./src -depth -type d -not -name 'src' -not -path "*/node_modules/*" -not -name 'node_modules' -not -name '.serverless' > results.txt
	@while read line; do \
		echo "Building $$line..."; \
		yarn install --cwd $$line; \
		cd ${MKFILEPATH}; \
	done < results.txt
	@rm -rf results.txt

_deployAll:
	@find ./src -type d -not -name 'src' -not -path "*/node_modules/*" -not -name 'node_modules' -not -name '.serverless' > results.txt
	@while read line; do \
		echo "Deploying $$line..."; \
		cd $$line && serverless deploy --stage ${STAGE}; \
		cd ${MKFILEPATH}; \
	done < results.txt
	@rm -rf results.txt

_check_service_definition:
	$(info [*] Checking whether service $(SERVICE) exists...)
ifndef SERVICE
	$(error [!] SERVICE env not defined, make sure you define SERVICE='users' for example.)
endif

ifeq ($(wildcard ./src/$(SERVICE)),)
	$(error [!] '$(SERVICE)' folder doesnt exist)
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
