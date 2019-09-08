FROM ruby:2.5
ADD Gemfile /Gemfile

RUN gem install jekyll bundler;\
    bundle install
