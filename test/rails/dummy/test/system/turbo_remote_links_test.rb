require "turbo_test_case"

require_relative "./remote_link_tests"

class TurboRemoteLinksTest < TurboTestCase
  include ::RemoteLinkTests

  def setup
    turbo_visit remote_links_path
  end
end
