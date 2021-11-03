require "turbo_test_case"

require_relative "./active_storage_tests"

class TurboActiveStorageTest < TurboTestCase
  include ::ActiveStorageTests

  setup do
    @post = posts(:one)
    turbo_visit edit_post_path(@post)
  end
end
