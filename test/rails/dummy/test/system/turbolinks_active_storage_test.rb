require "turbolinks_test_case"

require_relative "./active_storage_tests"

class TurbolinksActiveStorageTest < TurbolinksTestCase
  include ::ActiveStorageTests

  setup do
    @post = posts(:one)
    turbolinks_visit edit_post_path(@post)
  end
end
