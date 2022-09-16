class ChatController < ApplicationController
  def post
    message = chat_post_params[:message]
    pp message
  end

  private

  def chat_post_params
    params.permit(:message)
  end
end
