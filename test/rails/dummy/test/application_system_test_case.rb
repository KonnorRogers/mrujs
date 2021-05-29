require "test_helper"

# 'capybara' and 'capybara/cuprite' need to be defined for EvilSystems to work properly.
require 'capybara'
require 'capybara/cuprite'
require 'evil_systems'

EvilSystems.initial_setup

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  driven_by :cuprite

  include EvilSystems::Helpers
end
