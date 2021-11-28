require "bundler/setup"

task :test do
  sh("cd test/rails/dummy && bundle exec rails test:all")
end

namespace :ci do
  task :test do
    sh("cd test/rails/dummy && bundle exec rails db:prepare && bundle exec rails test:all")
  end
end
