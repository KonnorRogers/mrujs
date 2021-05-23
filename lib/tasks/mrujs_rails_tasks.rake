desc "Used for internal testing, do not touch this."
namespace :mrujs do
  task test_precompile: :environment do
    system("cd test/ruby/dummy && bundle exec rails assets:precompile")
  end
end
