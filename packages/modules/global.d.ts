

export function asyncVerify(token: string, options: DecodeOptions & { json: true } | DecodeOptions & { complete: true }): null | { [key: string]: any };

