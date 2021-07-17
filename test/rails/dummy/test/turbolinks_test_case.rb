require "application_system_test_case"

class TurbolinksTestCase < ApplicationSystemTestCase
  def turbolinks_visit(...)
    before_visit
    visit(...)
    after_visit
  end

  def before_visit
    @turbo = false
    ENV["PACK"] = "turbolinks"
  end

  def after_visit
    assert_no_css("[data-turbolinks-preview]")
    assert_no_css("[data-turbo-preview]")
    turbo_is_not_defined = evaluate_script("window.Turbo == null")
    assert(turbo_is_not_defined)
    turbolinks_is_defined = evaluate_script("window.Turbolinks != null")
    assert(turbolinks_is_defined)
  end
end
