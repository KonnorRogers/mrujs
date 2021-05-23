module MrujsRails
  module Redirection
    extend ActiveSupport::Concern

    included do
      before_action :set_turbolinks_location_header_from_session if respond_to?(:before_action)
    end

    def redirect_to(url = {}, options = {})
      turbolinks = options.delete(:turbolinks)

      super.tap do
        response.set_header("X-Xhr-Redirect", location)
        response.set_header("TURBOLINKS-REDIRECT-ACTION", turbolinks.to_s)
        response.set_header("TURBOLINKS-REDIRECT-LOCATION", location)
        response.content_type = Mime[:turbolinks]
        # if request.xhr? && !request.get?
        #   visit_location_with_turbolinks(location, turbolinks)
        # elsif request.headers["Turbolinks-Referrer"]
        #   store_turbolinks_location_in_session(location)
        # end
      end
    end

    private

    # def visit_location_with_turbolinks(location, action)
    #   action = action.to_s
    #   visit_action = action == "advance" ? action : "replace"

    #   response.content_type = Mime[:turbolinks]
    # end

    def store_turbolinks_location_in_session(location)
      session[:_turbolinks_location] = location if session
    end

    def set_turbolinks_location_header_from_session
      return unless session && session[:_turbolinks_location]

      response.set_header("Turbolinks-Location", session.delete(:_turbolinks_location))
    end
  end
end
