RSA_FILE=~/.ssh/whales
RSA=`cat ${RSA_FILE}`

all: build-download push-download build-deploy push-deploy

build-download:
	docker build --no-cache -t yfei1/base --build-arg SSH_PRIVATE_KEY="$(RSA)" -f Dockerfile.download .

run-download:
	docker create -it --name dummy yfei1/base bash
	docker cp dummy:/whalesRebuild/. .
	docker rm -fv dummy
push-download:
	docker push yfei1/base:latest

build-deploy:
	docker build --no-cache -t yfei1/whales -f Dockerfile.deploy .

run-deploy:
	docker run --name whales $(DETACH) -v $(shell pwd):/whalesRebuild yfei1/whales

push-deploy:
	docker push yfei1/whales:latest

rm:
	docker rm -v whales

prune:
	docker rmi -f $(shell docker images -f "dangling=true" -q)
