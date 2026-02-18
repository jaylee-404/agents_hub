class Api::V1::AuthController < ApplicationController
  def login
    # 模拟逻辑：如果用户不存在则创建，验证码固定 123456
    if params[:code] == "123456"
      user = User.find_or_initialize_by(phone: params[:phone])
      user.password = "secret_placeholder" if user.new_record? # 简单处理密码
      user.save!

      token = JsonWebToken.encode(user_id: user.id)
      render json: { token: token, user: { id: user.id, phone: user.phone } }, status: :ok
    else
      render json: { error: 'Invalid verification code' }, status: :unauthorized
    end
  end
end