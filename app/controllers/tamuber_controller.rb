class TamuberController < ApplicationController
  skip_before_action :check_token
  
  layout 'layouts/header', :except => [:index]
  
  def index
  end
end
