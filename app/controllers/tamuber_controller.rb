class TamuberController < ApplicationController
  skip_before_action :check_token
  render layout:false
  def index
  end
end
