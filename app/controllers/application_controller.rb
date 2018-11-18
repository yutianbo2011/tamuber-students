class ApplicationController < ActionController::Base
  layout 'application'
  protect_from_forgery with: :exception
  
  # Added the following for Login 
  # Edit Manish start
  before_filter :check_token
  
  include SessionsHelper
  def check_token
    unless logged_in?
      session[:original_url] = request.url
      redirect_to :controller => :users, :action => :new
    end
  end
  # Edit Manish end
end
