require "application_system_test_case"

class ExampleTest < ApplicationSystemTestCase
  test "should navigate to root" do
    visit("/")
    assert_selector("body")
  end
end
