require "application_system_test_case"

require_relative "./remote_form_tests"

class TurbolinksRemoteFormsTest < ApplicationSystemTestCase
  include ::RemoteFormTests

  setup do
    @post = posts(:one)
    @turbo = false
    ENV["PACK"] = "turbolinks"
    visit posts_path
    assert_no_css("[data-turbolinks-preview]")
    assert_no_css("[data-turbo-preview]")
    turbo_is_not_defined = evaluate_script("window.Turbo == null")
    assert(turbo_is_not_defined)
    turbolinks_is_defined = evaluate_script("window.Turbolinks != null")
    assert(turbolinks_is_defined)
  end
end

