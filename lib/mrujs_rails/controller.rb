# frozen_string_literal: true

require "mrujs_rails/redirection"

module MrujsRails
  module Controller
    extend ActiveSupport::Concern

    included do
      include Redirection
    end
  end
end
