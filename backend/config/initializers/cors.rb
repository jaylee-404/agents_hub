# backend/config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # 允许你的 Vite 默认开发端口访问
    origins "http://localhost:5173"

    resource "*",
             headers: :any,
             methods: [:get, :post, :put, :patch, :delete, :options, :head],
             # 重点：如果你后续要在 Header 里读取或设置 JWT Token，需要把 Authorization 暴露给前端
             expose: ["Authorization"]
  end
end