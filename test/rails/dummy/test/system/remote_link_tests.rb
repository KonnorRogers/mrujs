module RemoteLinkTests
  extend ActiveSupport::Concern

  included do
    test "it should not navigate on a data-remote get request" do
      assert_current_path remote_links_path
      click_link "Remote Get Link"
      assert_current_path remote_links_path
    end

    test "it should use ajax if only data-method is specifed, we assume remote" do
      assert_current_path remote_links_path
      click_link "Method Get Link"
      assert_current_path remote_links_path
    end

    test "should navigate for a regular link" do
      assert_current_path remote_links_path
      click_link "Go home"
      assert_current_path root_path
    end
  end
end
