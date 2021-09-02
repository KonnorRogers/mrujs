Rails.application.routes.draw do
  root "static#index"

  post "/no_content", to: "static#no_content"

  resources :posts
  resources :remote_links
end
