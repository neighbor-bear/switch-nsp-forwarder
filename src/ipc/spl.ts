const splMig = new Switch.Service('spl:mig');

export function splCryptoGenerateAesKek(
	wrappedKek: ArrayBuffer,
	keyGeneration: number,
	option: number,
): ArrayBuffer {
	//Result splCryptoGenerateAesKek(const void *wrapped_kek, u32 key_generation, u32 option, void *out_sealed_kek) {
	//    const struct {
	//        SplKey wrapped_kek;
	//        u32 key_generation;
	//        u32 option;
	//    } in = { *((const SplKey *)wrapped_kek), key_generation, option };
	//    return serviceDispatchInOut(_splGetCryptoSrv(), 2, in, *((SplKey *)out_sealed_kek));
	//}
	const inData = new Uint8Array(0x18);
	inData.set(new Uint8Array(wrappedKek, 0, 0x10), 0);
	const inDataArr = new Uint32Array(inData.buffer, 0x10, 2);
	inDataArr[0] = keyGeneration;
	inDataArr[1] = option;
	const out = new Uint8Array(0x10);
	splMig.dispatchInOut(2, inData.buffer, out.buffer);
	return out;
}

export function splCryptoGenerateAesKey(
	sealedKek: ArrayBuffer,
	wrappedKey: ArrayBuffer,
): ArrayBuffer {
	//Result splCryptoGenerateAesKey(const void *sealed_kek, const void *wrapped_key, void *out_sealed_key) {
	//    const struct {
	//        SplKey sealed_kek;
	//        SplKey wrapped_key;
	//    } in = { *((const SplKey *)sealed_kek), *((const SplKey *)wrapped_key) };
	//    return serviceDispatchInOut(_splGetCryptoSrv(), 4, in, *((SplKey *)out_sealed_key));
	//}
	const inData = new Uint8Array(0x20);
	inData.set(new Uint8Array(sealedKek, 0, 0x10), 0);
	inData.set(new Uint8Array(wrappedKey, 0, 0x10), 0x10);
	const out = new Uint8Array(0x10);
	splMig.dispatchInOut(4, inData.buffer, out.buffer);
	return out;
}
