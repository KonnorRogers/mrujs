require "turbolinks_test_case"

require_relative "./remote_link_tests"

class TurbolinksRemoteLinksTest < TurbolinksTestCase
  include ::RemoteLinkTests

  def setup
    turbolinks_visit remote_links_path
  end
end
