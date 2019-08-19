build-image:
	docker build -t jekyll-image .

init:
	docker run --name jekyll-init --rm -v "${PWD}/myblog:/myblog" -it jekyll-image /bin/bash -c "jekyll new myblog"

verify:
	docker run --name jekyll-verify --rm -v "${PWD}/test:/myblog/test" -v "${PWD}/myblog:/myblog" -it jekyll-image /bin/bash -c "cd /myblog; bundle install; bundle exec jekyll build -d test"

build:
	docker run --name jekyll-build --rm -v "${PWD}/public:/myblog/public" -v "${PWD}/myblog:/myblog" -it jekyll-image /bin/bash -c "cd /myblog; bundle; bundle exec jekyll build -d public"

run:
	docker run --name jekyll-run --rm -v "${PWD}/public:/myblog/public" -v "${PWD}/myblog:/myblog" -p 4000:4000 -it jekyll-image /bin/bash -c "cd /myblog; bundle install; bundle exec jekyll serve"
