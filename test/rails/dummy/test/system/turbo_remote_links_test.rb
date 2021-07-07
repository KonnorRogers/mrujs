require "application_system_test_case"

require_relative "./remote_link_tests"

class TurboRemoteLinksTest < ApplicationSystemTestCase
  include ::RemoteLinkTests

  def setup
    ENV["PACK"] = "turbo"
    visit remote_links_path

    assert_no_css("[data-turbolinks-preview]")
    assert_no_css("[data-turbo-preview]")
    turbo_is_defined = evaluate_script("window.Turbo != null")
    assert(turbo_is_defined)
    turbolinks_is_not_defined = evaluate_script("window.Turbolinks == null")
    assert(turbolinks_is_not_defined)
  end
end
