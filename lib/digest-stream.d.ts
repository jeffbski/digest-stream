declare module "digest-stream" {
  import { HexBase64BinaryEncoding, Utf8AsciiBinaryEncoding } from "crypto";
  import { Transform, TransformCallback, TransformOptions } from "stream";
  export default function digestStream(
    algorithm: string,
    inputEncoding: Utf8AsciiBinaryEncoding | null,
    digestEncoding: HexBase64BinaryEncoding | null,
    options: TransformOptions | null,
    listenerFn: (digest: string, length: number) => Error | void
  ): Transform;
}
