class MorphsController < ApplicationController
  def index; end

  def create
    redirect_to morphs_path
  end
end
