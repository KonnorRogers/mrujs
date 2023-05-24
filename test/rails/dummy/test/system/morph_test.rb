require "application_system_test_case"

class MorphTest < ApplicationSystemTestCase
  test "morphs <body> content" do
    visit morphs_path

    assert_selector "h1", text: "Morph Test"
    page.execute_script("document.querySelector('h1').textContent = 'Morph Me'")
    assert_selector "h1", text: "Morph Me"

    click_link "morph-link"

    refute_selector "h1", text: "Morph Me"
    assert_selector "h1", text: "Morph Test"
  end

  test "morphs <head> content" do
    visit morphs_path

    unique_meta_tag = page.find("meta[name='morph-meta-test']", visible: false)[:content]

    page.execute_script("document.querySelector('h1').textContent = 'Morph Me'")
    click_link "morph-link"
    assert_selector "h1", text: "Morph Test"

    new_unique_meta_tag = page.find("meta[name='morph-meta-test']", visible: false)[:content]

    refute_equal unique_meta_tag, new_unique_meta_tag

    assert_css "head meta[name='morph-meta-test']", visible: false
    refute_css "body meta[name='morph-meta-test']", visible: false
  end
end
