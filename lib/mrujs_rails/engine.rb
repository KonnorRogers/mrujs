require "mrujs_rails/version"
require "mrujs_rails/controller"
require "mrujs_rails/assertions"

module MrujsRails
  class Engine < ::Rails::Engine
    config.turbolinks = ActiveSupport::OrderedOptions.new
    config.turbolinks.auto_include = true

    # allows us to use a turbolinks mimetype, perhaps this should be mrujs?
    initializer "turbolinks.mimetype" do
      Mime::Type.register "text/turbolinks", :turbolinks
    end

    initializer "mrujs_rails.test_assertions" do
      ActiveSupport.on_load(:active_support_test_case) do
        include ::MrujsRails::Assertions
      end
    end

    initializer "mrujs_rails" do |app|
      ActiveSupport.on_load(:action_controller) do
        include ::MrujsRails::Controller if app.config.turbolinks.auto_include
      end
    end
  end
end
