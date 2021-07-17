require "turbolinks_test_case"

require_relative "./navigation_adapter_tests"

class TurbolinksNavigationAdapterTest < TurbolinksTestCase
  include NavigationAdapterTests

  setup do
    turbolinks_visit root_path
  end
end
