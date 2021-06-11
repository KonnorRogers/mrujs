Rails.application.routes.draw do
  root "static#index"

  resources :posts
  resources :remote_links
end
