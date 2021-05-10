# desc "Explaining what the task does"
# task :mrujs_rails do
#   # Task goes here
# end

# Used for internal testing
namespace :mrujs do
  task :test_precompile => :environment do
    system("cd test/ruby/dummy && bundle exec rails assets:precompile")
  end
end
