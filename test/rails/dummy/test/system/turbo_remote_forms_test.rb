require "turbo_test_case"

require_relative "./remote_form_tests"

class TurboRemoteFormsTest < TurboTestCase
  include ::RemoteFormTests

  setup do
    @post = posts(:one)
    turbo_visit posts_path
  end
end

