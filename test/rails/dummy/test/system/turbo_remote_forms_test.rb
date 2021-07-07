require "application_system_test_case"

require_relative "./remote_form_tests"

class TurboRemoteFormsTest < ApplicationSystemTestCase
  include ::RemoteFormTests

  setup do
    @post = posts(:one)
    @turbo = true
    ENV["PACK"] = "turbo"
    visit posts_path
    assert_no_css("[data-turbolinks-preview]")
    assert_no_css("[data-turbo-preview]")
    turbo_is_defined = evaluate_script("window.Turbo != null")
    assert(turbo_is_defined)
    turbolinks_is_not_defined = evaluate_script("window.Turbolinks == null")
    assert(turbolinks_is_not_defined)
  end
end

