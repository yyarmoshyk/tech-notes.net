#FROM yyarmoshyk/jekyll:ruby-2.5
FROM ruby:2.5
WORKDIR /myblog

ADD src /myblog

ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8

RUN apt-get clean && apt-get update;\
    apt-get install -y apt-utils;\
    apt-get install -y locales;\
    echo 'en_US.UTF-8 UTF-8' >> /etc/locale.gen ;\
    locale-gen ;\
    apt-get clean
RUN gem install jekyll bundler;\
    cd /myblog;\
    bundle install

CMD ["/bin/bash","-c", "bundle exec jekyll serve -d public"]
