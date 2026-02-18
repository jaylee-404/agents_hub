class Api::V1::TasksController < Api::V1::BaseController
  # 创建任务
  def create
    task = @current_user.tasks.new(task_params)

    if task.save
      # 立即异步分发到 Sidekiq
      AgentDispatcherJob.perform_async(task.id)

      render json: {
        task_id: task.id,
        stream_token: task.stream_token,
        status: task.status
      }, status: :created
    else
      render json: { errors: task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # 查询任务状态（用于前端轮询或初始化）
  def show
    task = @current_user.tasks.find(params[:id])
    render json: task
  end

  private

  def task_params
    params.require(:task).permit(:task_type, payload: {})
  end
end