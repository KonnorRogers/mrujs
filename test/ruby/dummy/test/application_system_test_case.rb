require "test_helper"

require "capybara"
require "capybara/cuprite"
require "evil_systems"

EvilSystems.initial_setup(task: "assets:precompile")

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  driven_by :cuprite

  include EvilSystems::Helpers
end
