class AgentDispatcherJob
  include Sidekiq::Job
  sidekiq_options retry: 3 # 失败重试 3 次

  def perform(task_id)
    task = Task.find(task_id)
    return if task.completed?

    # 更新状态为“进行中”
    task.update!(status: :processing)

    # 调用 FastAPI (agent 服务)
    # AGENT_SERVICE_URL 定义在 .env 中，例如 http://agent:8000
    begin
      response = HTTParty.post(
        "#{ENV['AGENT_SERVICE_URL']}/agent/run",
        body: {
          task_id: task.id,
          stream_token: task.stream_token,
          payload: task.payload
        }.to_json,
        headers: { 'Content-Type' => 'application/json' },
        timeout: 10
      )

      if response.success?
        Rails.logger.info "✅ Task #{task_id} dispatched successfully."
      else
        raise "Agent Service Error: #{response.code}"
      end
    rescue => e
      Rails.logger.error "❌ Dispatch Failed: #{e.message}"
      task.update!(status: :failed, result: { error: e.message })
      # 抛出异常触发 Sidekiq 重试
      raise e
    end
  end
end