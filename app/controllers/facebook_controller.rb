class FacebookController < ApplicationController
	before_filter :authenticate_user!
end
