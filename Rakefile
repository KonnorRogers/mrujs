require "bundler/setup"

task :test do
  Dir.chdir("test/rails/dummy") { system("bundle exec rails test:all") }
end

namespace :ci do
  task :test do
    Dir.chdir("test/rails/dummy") do
      system("bundle exec rails db:prepare && bundle exec rails test:all")
    end
  end
end
