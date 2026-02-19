class Api::V1::TasksController < Api::V1::BaseController
  def create
    # 1. 过滤并获取纯文本参数
    base_params = task_params

    # 2. 提取前端传过来的文件数组（如果没有传则默认为空数组）
    uploaded_images = params[:images] || []
    uploaded_documents = params[:documents] || []

    # 3. TODO: 将文件上传到七牛云，并获取返回的 URL 数组
    # 这里我们暂时用空数组代替，等你写好七牛云上传服务（比如 QiniuService）后再解开注释
    # image_urls = uploaded_images.map { |file| QiniuService.upload(file) }
    # document_urls = uploaded_documents.map { |file| QiniuService.upload(file) }

    image_urls = []
    document_urls = []

    # 4. 将文本参数和转换后的 URL 组合，构建最终的入库参数
    # 注意：task_type 暂时不需要，直接忽略或默认置空即可
    task_attributes = base_params.merge(
      image_urls: image_urls,
      document_urls: document_urls
    )

    # 5. 实例化并保存任务
    task = @current_user.tasks.new(task_attributes)

    if task.save
      # 立即异步分发到 Sidekiq 处理后续与 FastAPI 的交互
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

  def show
    task = @current_user.tasks.find(params[:id])
    render json: task
  end

  private

  # 匹配前端 FormData 的扁平结构，移除 require(:task)
  def task_params
    params.permit(:title, :content)
  end
end