require "test_helper"

require "capybara"
require "capybara/cuprite"
require "evil_systems"

puts Dir.pwd
EvilSystems.initial_setup(task: "mrujs:test_precompile")

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  driven_by :cuprite

  include EvilSystems::Helpers
end
