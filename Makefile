RSA_FILE=~/.ssh/whales
RSA=`cat ${RSA_FILE}`

download:
	docker build  -t yfei1/base --build-arg SSH_PRIVATE_KEY="$(RSA)" -f Dockerfile.download .
	docker create -it --name dummy base bash
	docker cp dummy:/whalesRebuild/. .
	docker rm -fv dummy
	docker push yfei1/base:latest

deploy: download
	docker build -t yfei1/whales -f Dockerfile.deploy .
	docker run --name whales -v $(shell pwd):/whalesRebuild yfei1/whales
	docker push yfei1/whales:latest

start:
	cd /whalesRebuild
	ncu -u
	npm install
	npm run dev

rm:
	docker rm -v whales

prune:
	docker rmi -f $(shell docker images -f "dangling=true" -q)
