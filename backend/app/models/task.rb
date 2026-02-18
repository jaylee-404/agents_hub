class Task < ApplicationRecord
  belongs_to :user

  # 状态枚举：0:待处理, 1:进行中, 2:流式传输中, 3:已完成, 4:失败
  enum :status, {
    pending: 0,
    processing: 1,
    streaming: 2,
    completed: 3,
    failed: 4
  }, default: :pending

  # 只要是 JSON 字段，建议通过代码确保其初始为 Hash
  attribute :payload, :jsonb, default: {}
  attribute :result, :jsonb, default: {}

  # 创建前自动生成 stream_token 和 初始 ID
  before_create :generate_stream_token

  private

  def generate_stream_token
    # 生成 32 位随机安全令牌，供前端和 FastAPI 握手使用
    self.stream_token = SecureRandom.urlsafe_base64(32)
  end
end