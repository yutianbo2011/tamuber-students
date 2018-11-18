class ApplicationController < ActionController::Base
  
  before_action :check_token
  
  layout 'application'
  protect_from_forgery with: :exception
  
  # Added the following for Login 
  # Edit Manish start
  
  include SessionsHelper
  def check_token
    unless logged_in?
      session[:original_url] = request.url
     # redirect_to :controller => :users, :action => :new
      redirect_to :controller => :sessions, :action => :new
    end
  end
  # Edit Manish end
end
