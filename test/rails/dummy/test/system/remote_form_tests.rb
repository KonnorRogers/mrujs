module RemoteFormTests
  extend ActiveSupport::Concern

  included do
    test "visiting the index" do
      assert_selector "h1", text: "Posts"
    end

    test "creating a Post" do
      click_on "New Post"

      within "#normal-form" do
        fill_in "Body", with: @post.body
        fill_in "Title", with: @post.title
        click_on "Create Post"
      end

      assert_text ::PostsController::CREATED
      click_on "Back"
    end

    test "create a post with ajax" do
      click_on "New Post"

      within "#ajax-form" do
        fill_in "Body", with: @post.body
        fill_in "Title", with: @post.title
        click_on "Create Post"
        # assert_button "Submitting...", disabled: true
      end

      assert_text ::PostsController::CREATED if @turbo == false
      click_on "Back"

      # Make sure disabled buttons re-enable
      click_on "New Post", match: :first
      assert_button "Create Post"
    end

    test "updating a Post" do
      click_on "Edit", match: :first

      within "#normal-form" do
        fill_in "Body", with: @post.body
        fill_in "Title", with: @post.title
        click_on "Update Post"
      end

      assert_text ::PostsController::UPDATED if @turbo == false
      click_on "Back"
    end

    test "updating a Post with ajax" do
      click_on "Edit", match: :first

      within "#ajax-form" do
        fill_in "Body", with: @post.body
        fill_in "Title", with: @post.title
        click_on "Update Post"
        # assert_button "Submitting...", disabled: true
      end

      assert_text ::PostsController::UPDATED if @turbo == false
      click_on "Back"
      click_on "Edit", match: :first
      assert_button "Update Post"
    end

    test "destroying a Post" do
      page.accept_confirm do
        click_on "Destroy", match: :first
      end

      # known bug with Turbo.
      assert_text ::PostsController::DESTROYED if @turbo == false
    end

    test "destroying a post with ajax and confirm" do
      page.accept_confirm do
        click_on "Ajax Destroy", match: :first
      end

      assert_link "Destroying..."

      # known bug with Turbo
      assert_text ::PostsController::DESTROYED if @turbo == false
    end

    test "When cancelling a data-confirm" do
      page.dismiss_confirm do
        click_on "Ajax Destroy", match: :first
      end

      refute_text ::PostsController::DESTROYED
      assert_link "Ajax Destroy", match: :first
    end
  end
end
