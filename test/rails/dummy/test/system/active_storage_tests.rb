module ActiveStorageTests
  extend ActiveSupport::Concern

  included do
    test "Should directly upload an image" do
      within "#single-image" do
        find("#post_primary_image").attach_file(file_fixture("racecar.png").to_s)
        click_on "Update Post"
      end

      assert_css ".direct-upload"
      assert_css ".direct-upload--complete", wait: 5
      assert_css ".direct-uploads--complete", wait: 5

      assert_css "input[type='hidden'][name='post[primary_image]']", count: 1, visible: false

      assert @post.reload.primary_image.attached?
    end

    test "Should allow multiple uploads" do
      files = %w[racecar.png racecar1.png racecar2.png].map { |f| file_fixture(f).to_s }

      within "#multiple-images" do
        find("#post_secondary_images").attach_file(files)
        click_on "Update Post"
      end

      assert_css ".direct-upload"
      assert_css ".direct-upload--complete", wait: 5
      assert_css ".direct-uploads--complete", wait: 5

      assert_css "input[type='hidden'][name='post[secondary_images][]']", count: 3, visible: false

      assert_equal @post.reload.secondary_images.size, 3
    end
  end
end
