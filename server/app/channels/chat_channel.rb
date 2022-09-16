class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_from "stream_test"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def speak(data)
    ActionCable.server.broadcast "stream_test", data
  end
end
