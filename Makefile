build-image:
	docker build -t yyarmoshyk/jekyll-minimal-mistakes:ruby-2.5 .
	# docker push yyarmoshyk/jekyll-minimal-mistakes:ruby-2.5

verify:
	docker run --name jekyll-verify --rm -v "${PWD}/test:/myblog/test" -v "${PWD}/src:/myblog" yyarmoshyk/jekyll-minimal-mistakes:ruby-2.5 /bin/bash -c "cd /myblog; bundle install; bundle exec jekyll build -d test"

build:
	docker run --name jekyll-build --rm -v "${PWD}/public:/myblog/public" -v "${PWD}/src:/myblog" yyarmoshyk/jekyll-minimal-mistakes:ruby-2.5 /bin/bash -c "cd /myblog; bundle; bundle exec jekyll build -d public"

build-profile:
	docker run --name jekyll-build --rm -v "${PWD}/public:/myblog/public" -v "${PWD}/src:/myblog" yyarmoshyk/jekyll-minimal-mistakes:ruby-2.5 /bin/bash -c "cd /myblog; bundle; bundle exec jekyll build --profile -d public"

run:
	docker run --name jekyll-run --rm -v "${PWD}/src:/myblog" -v "${PWD}/public:/myblog/public" -d -p 4000:4000 yyarmoshyk/jekyll-minimal-mistakes:ruby-2.5

run-nginx:
	docker run --name jekyll-nginx --rm -v "${PWD}/public:/usr/share/nginx/html" -d -p 80:80 nginx

restart:
	docker restart jekyll-run

stop:
	docker stop jekyll-run

deploy:
	bash deploy_s3.sh
