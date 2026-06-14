type PipelineObject = Record<string, any>
type PipelineFunction = (v: PipelineObject) => PipelineObject

export class Pipeline {
  private fns: PipelineFunction[] = []

  add(fn: PipelineFunction): Pipeline {
    this.fns.push(fn)
    return this as unknown as Pipeline
  }

  run(p?: PipelineObject): PipelineObject {
    const params = p || {}
    const result = {}
    for (const fn of this.fns) {
      const res = fn(params)
      if (res && typeof res === 'object') {
        Object.assign(result, res)
      }
    }
    return result
  }
}
export default Pipeline
