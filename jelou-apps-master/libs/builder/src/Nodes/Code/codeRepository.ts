// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ow from "ow";
import { Repository } from "../../shared/handleErrorRepositories";

export class CodeRepository extends Repository {
  public async documentation(code: string) {
    ow(code, ow.string);
    ow(code, ow.string.nonEmpty.message("code should not be empty"));

    return await fetch("https://ai-functions.jelou.ai/generate-docs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic MDFIMzAzUEMxUTNNM05CSjlKSFcwOVkzUEU6ZDQ5NjE0NTMtNjA1OS00N2M1LTkxODktMDZkOTg4YzI4Njk3",
      },
      body: JSON.stringify({
        code,
      }),
    });
  }

  public async generateCode(instruction: string) {
    ow(instruction, ow.string);
    ow(instruction, ow.string.nonEmpty.message("instruction should not be empty"));

    return await fetch("https://ai-functions.jelou.ai/generate-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic MDFIMzAzUEMxUTNNM05CSjlKSFcwOVkzUEU6ZDQ5NjE0NTMtNjA1OS00N2M1LTkxODktMDZkOTg4YzI4Njk3"
      },
      body: JSON.stringify({
        documentation: instruction,
      }),
    });
  }

  /**
   * Read stream
   */
  public async readStream(response: Response, setText: React.Dispatch<React.SetStateAction<string>>): Promise<string> {
    if (!response.body) {
      return "";
    }

    const reader = response.body.pipeThrough(new window.TextDecoderStream()).getReader();

    let text = "";

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      text += value;
      setText((preState) => preState + value);
    }

    return text;
  }
}
