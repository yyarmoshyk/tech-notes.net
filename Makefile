build-image:
	docker build -t jekyll-image .

init:
	docker run --name jekyll-init --rm -v "${PWD}/myblog:/myblog" -it jekyll-image /bin/bash -c "bundle exec jekyll new myblog"

verify:
	docker run --name jekyll-verify --rm -v "${PWD}/test:/myblog/test" -v "${PWD}/myblog:/myblog" -it jekyll-image /bin/bash -c "cd /myblog; bundle install; bundle exec jekyll build -d test"

build:
	docker run --name jekyll-build --rm -v "${PWD}/public:/myblog/public" -v "${PWD}/myblog:/myblog" -it jekyll-image /bin/bash -c "cd /myblog; bundle; bundle exec jekyll build -d public"

run:
	docker run --name jekyll-run --rm -v "${PWD}/public:/myblog/public" -v "${PWD}/myblog:/myblog" -p 4000:4000 -it jekyll-image /bin/bash -c "cd /myblog; bundle install; bundle exec jekyll serve"

run-massively-master:
	docker run --name jekyll-run --rm -v "${PWD}/public:/myblog/public" -v "${PWD}/jekyll-theme-massively-master:/myblog" -p 4000:4000 -it jekyll-image /bin/bash -c "cd /myblog; bundle install; bundle exec jekyll serve"

run-minimal-mistakes:
	docker run --name jekyll-run --rm -v "${PWD}/public:/myblog/public" -v "${PWD}/minimal-mistakes:/myblog" -p 4000:4000 -it jekyll-image /bin/bash -c "cd /myblog; bundle install; bundle exec jekyll serve"

run-minimal-mistakes-docs:
	docker run --name jekyll-run --rm -v "${PWD}/public:/myblog/public" -v "${PWD}/minimal-mistakes/docs:/myblog" -p 4000:4000 -it jekyll-image /bin/bash -c "cd /myblog; bundle update; bundle install; bundle exec jekyll serve"
