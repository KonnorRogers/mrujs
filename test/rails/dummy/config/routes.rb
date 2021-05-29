Rails.application.routes.draw do
  resources :comments
  resources :posts
  resources :users
  get 'static/index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root "static#index"
end
