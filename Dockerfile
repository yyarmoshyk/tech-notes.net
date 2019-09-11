FROM ruby:2.4
ADD Gemfile /Gemfile

RUN gem install jekyll bundler;\
    bundle install
