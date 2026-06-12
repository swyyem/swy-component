type PipelineObject = Record<string, any>;
type PipelineFunction = (v: PipelineObject) => PipelineObject;
export declare class Pipeline {
    private fns;
    add(fn: PipelineFunction): Pipeline;
    run(p?: PipelineObject): PipelineObject;
}
export default Pipeline;
