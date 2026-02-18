module Api
  module V1
    module Internal
      class CallbacksController < ActionController::API
        # 内部回调接口，跳过 JWT 检查（因为这是服务间通信）

        def task_finished
          task = Task.find(params[:task_id])

          # 更新最终状态和结果
          if params[:status] == 'success'
            task.update!(status: :completed, result: params[:result])
          else
            task.update!(status: :failed, result: { error: params[:message] })
          end

          render json: { message: "Status synchronized" }, status: :ok
        end
      end
    end
  end
end