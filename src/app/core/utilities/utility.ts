declare const Buffer:any;

export function escapeHtml(unsafe:string) {
  if (!unsafe) {
    return unsafe;
  }
  return Buffer.from(encodeURIComponent(unsafe)).toString('base64');
}

export function unescapeHtml(unsafe:string ) {
  if (!unsafe) {
    return unsafe;
  }
  try {
    if (typeof unsafe === 'string') {
      return decodeURIComponent(Buffer.from(unsafe, 'base64').toString());
    }
    return unsafe;
  } catch (error) {
    console.log(error); //NOSONAR
    return unsafe;
  }
}
