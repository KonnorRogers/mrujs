module NavigationAdapterTests
  extend ActiveSupport::Concern

  included do
    test "Should add /posts to the snapshot cache" do
      pre_fetch_count = evaluate_script("window.mrujs.navigationAdapter.snapshotCache.keys.length")

      execute_script("window.mrujs.navigationAdapter.cacheHTML({ url: '/posts', html: '<div></div>' })")

      post_fetch_count = evaluate_script("window.mrujs.navigationAdapter.snapshotCache.keys.length")

      assert_equal pre_fetch_count + 1, post_fetch_count

      has_posts_key = evaluate_script("window.mrujs.navigationAdapter.cacheContains('/posts')")
      assert has_posts_key
    end
  end
end
