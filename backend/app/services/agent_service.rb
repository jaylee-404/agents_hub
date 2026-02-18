class AgentService
  include HTTParty
  base_uri ENV.fetch("AGENT_SERVICE_URL", "http://localhost:8000")

  def self.publish_to_redbook(title, content, images)
    post("/publish", body: { title: title, content: content, images: images }.to_json, headers: { 'Content-Type' => 'application/json' })
  end
end