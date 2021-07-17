require "application_system_test_case"

require_relative "./remote_form_tests"

class TurboRemoteFormsTest < TurboTestCase
  include ::RemoteFormTests

  setup do
    before_visit
    @post = posts(:one)
    visit posts_path
    after_visit
  end
end

