require "application_system_test_case"

class SmokeTest < ApplicationSystemTestCase
  test "it should visit root without issue" do
    visit root_path
    assert_selector "body"
  end
end
