#FROM yyarmoshyk/jekyll:ruby-2.5
FROM ruby:2.5.6
WORKDIR /myblog

ADD src/Gemfile /myblog/Gemfile
ADD src/_config.yml /myblog/_config.yml

ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8

RUN apt-get clean && apt-get update;\
    apt-get install -y apt-utils locales ca-certificates;\
    echo 'en_US.UTF-8 UTF-8' >> /etc/locale.gen ;\
    locale-gen ;\
    apt-get clean
RUN gem update --system 3.2.3;\
    gem install jekyll bundler;\
    bundle install

CMD ["/bin/bash","-c", "bundle exec jekyll serve -d public"]
