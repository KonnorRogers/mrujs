class Post < ApplicationRecord
  has_one_attached :primary_image, dependent: :destroy
  has_many_attached :secondary_images, dependent: :destroy
end
