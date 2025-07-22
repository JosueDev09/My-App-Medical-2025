export function esperar(ms:any) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

