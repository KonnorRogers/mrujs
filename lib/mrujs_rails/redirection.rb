module MrujsRails
  module Redirection
    extend ActiveSupport::Concern

    included do
      before_action :set_turbolinks_location_header_from_session if respond_to?(:before_action)
    end

    def redirect_to(url = {}, options = {})
      turbolinks = options.delete(:turbolinks)

      super.tap do
        if turbolinks != false && request.xhr? && !request.get?
          visit_location_with_turbolinks(location, turbolinks)
        elsif request.headers["Turbolinks-Referrer"]
          store_turbolinks_location_in_session(location)
        end
      end
    end

    private

    def visit_location_with_turbolinks(location, action)
      action = action.to_s
      visit_action = action == "advance" ? action : "replace"

      response.content_type =
        response.headers["X-Xhr-Redirect"] = location
      response.headers["TURBOLINKS-REDIRECT-ACTION"] = visit_action
      response.headers["TURBOLINKS-REDIRECT-LOCATION"] = location
    end

    def store_turbolinks_location_in_session(location)
      session[:_turbolinks_location] = location if session
    end

    def set_turbolinks_location_header_from_session
      if session && session[:_turbolinks_location]
        response.headers["Turbolinks-Location"] = session.delete(:_turbolinks_location)
      end
    end
  end
end
