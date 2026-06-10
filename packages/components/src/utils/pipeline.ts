/**
 * 管道模式实现
 * 用于链式处理数据，每个函数接收上一个函数的输出
 */

type PipelineObject = Record<string, any>
type PipelineFunction = (v: PipelineObject) => PipelineObject

/** 管道类 */
export class Pipeline {
  private fns: PipelineFunction[] = [] // 函数队列

  /** 添加处理函数 */
  add(fn: PipelineFunction): Pipeline {
    this.fns.push(fn)
    return this as unknown as Pipeline // 支持链式调用
  }

  /** 执行管道 */
  run(p?: PipelineObject): PipelineObject {
    const params = p || {}
    const result = {}
    for (const fn of this.fns) {
      const res = fn(params)
      if (res && typeof res === 'object') {
        Object.assign(result, res) // 合并结果
      }
    }
    return result
  }
}
export default Pipeline
