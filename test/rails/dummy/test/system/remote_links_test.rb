require "application_system_test_case"

class RemoteFormsTest < ApplicationSystemTestCase
  test "it should not navigate on a data-remote get request" do
    visit remote_links_path
    assert_current_path remote_links_path
    click_link "Remote Get Link"
    assert_current_path remote_links_path
  end
end
