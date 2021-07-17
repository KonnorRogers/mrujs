require "turbolinks_test_case"

require_relative "./remote_form_tests"

class TurbolinksRemoteFormsTest < TurbolinksTestCase
  include ::RemoteFormTests

  setup do
    @post = posts(:one)
    turbolinks_visit posts_path
  end
end

