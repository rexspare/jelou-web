import { OUTPUT_TYPES } from "../domain/contants.output";
import { IOutputsRepository, Output } from "../domain/outputs.domain";

export class OutputsCreator {
    constructor(private readonly outputRepository: IOutputsRepository) {}

    async create(output: Partial<Output>, allOutputs: Output[]) {
        if (output.type === OUTPUT_TYPES.SUCCESS) {
            const successOutput = allOutputs.find((output) => output.type === OUTPUT_TYPES.SUCCESS);
            if (successOutput) {
                throw new Error('Solo puedes tener un output de tipo "success"');
            }
        }

        return this.outputRepository.create(output);
    }
}
