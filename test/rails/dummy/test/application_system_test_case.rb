require "test_helper"

# 'capybara' and 'capybara/cuprite' need to be defined for EvilSystems to work properly.
require 'capybara'
require 'selenium-webdriver'
require 'evil_systems'

ENV["APP_HOST"] = "127.0.0.1"
EvilSystems.initial_setup

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  driven_by :selenium, using: (ENV["BROWSER"] || "headless_chrome").to_sym, screen_size: [1400, 1400]

  include EvilSystems::Helpers

  def after_teardown
    super
    FileUtils.rm_rf(ActiveStorage::Blob.service.root)
  end
end
