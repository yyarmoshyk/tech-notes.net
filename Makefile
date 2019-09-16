build-image:
	docker build -t yyarmoshyk/jekyll-minimal-mistakes:ruby-2.5 .
	# docker push yyarmoshyk/jekyll-minimal-mistakes:ruby-2.5

verify:
	docker run --name jekyll-verify --rm -v "${PWD}/test:/myblog/test" -v "${PWD}/src:/myblog" -it yyarmoshyk/jekyll-minimal-mistakes:ruby-2.5 /bin/bash -c "cd /myblog; bundle install; bundle exec jekyll build -d test"

build:
	docker run --name jekyll-build --rm -v "${PWD}/public:/myblog/public" -v "${PWD}/src:/myblog" -it yyarmoshyk/jekyll-minimal-mistakes:ruby-2.5 /bin/bash -c "cd /myblog; bundle; bundle exec jekyll build -d public"

run:
	docker run --name jekyll-run --rm -v "${PWD}/src:/myblog" -v "${PWD}/public:/src/public" -p 4000:4000 yyarmoshyk/jekyll-minimal-mistakes:ruby-2.5
