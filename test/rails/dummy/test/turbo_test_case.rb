require "application_system_test_case"

class TurboTestCase < ApplicationSystemTestCase
  def turbo_visit(...)
    before_visit
    visit(...)
    after_visit
  end

  def before_visit
    @turbo = true
    ENV["PACK"] = "turbo"
  end

  def after_visit
    assert_no_css("[data-turbolinks-preview]")
    assert_no_css("[data-turbo-preview]")
    turbo_is_defined = evaluate_script("window.Turbo != null")
    assert(turbo_is_defined)
    turbolinks_is_not_defined = evaluate_script("window.Turbolinks == null")
    assert(turbolinks_is_not_defined)
  end
end
