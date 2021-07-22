require "turbo_test_case"

require_relative "./navigation_adapter_tests"

class TurboNavigationAdapterTest < TurboTestCase
  include NavigationAdapterTests

  setup do
    turbo_visit root_path
  end
end
