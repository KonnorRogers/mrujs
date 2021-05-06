require "bundler/setup"

APP_RAKEFILE = File.expand_path("test/ruby/dummy/Rakefile", __dir__)
load "rails/tasks/engine.rake"

load "rails/tasks/statistics.rake"

require "bundler/gem_tasks"

require "rake/testtask"

Rake::TestTask.new(:test) do |t|
  t.libs << "test/ruby"
  t.pattern = "test/ruby/**/*_test.rb"
  t.verbose = false
end

task default: :test

require "standard/rake"
