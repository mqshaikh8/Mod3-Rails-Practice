class TasksController < ApplicationController

  def create
    if params[:list_id]
      @task = Task.create(task_params)
      if @task.valid?
        render json: @task, status: 201
      else
        render json: {error: "Name must be provided"}, status: 404
      end
    else
      render json: {error: "List not Found"}, status: 404
    end
  end

  def update
    @task = Task.find(params[:id])
    @task.update(task_params)
    render json: @task
  end

  private
  def task_params
    params.permit(:done, :name, :list_id)
  end

end
