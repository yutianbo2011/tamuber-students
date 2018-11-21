class TamuberController < ApplicationController
  skip_before_action :check_token
  layout "application", except: [:index]
  def index
  end
end
